# backend/app.py
from flask import Flask, request, jsonify, send_from_directory, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from model import NGramModel
from models import db, Usuario, Feedback
from model import model, obtener_sugerencias_combinadas, registrar_palabra
import os

# creamos la instancia de la aplicación Flask, indicando que la carpeta estática
app = Flask(__name__, static_folder='../frontend', static_url_path='')

#################### CONFIGURACION BASE DE DATOS ####################
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///greenyellow.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'una_clave_secreta_muy_segura'

############# INICIAMOS DE LA BASE DE DATOS Y  FLASK-LOGIN ############
db.init_app(app)
login_manager = LoginManager()
login_manager.login_view = 'login'          
login_manager.init_app(app)
## creamos todas las tablas dentro del conetxto de la aplicaicon 
with app.app_context():
    db.create_all()

## abre el archivo lo lee y se entrena el modelo de n-gram
with open('corpus.txt', encoding='utf-8') as f:
    corpus = f.read()
model = NGramModel(n=3)
model.train(corpus)

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

########## SUGERENCIAS AUTOCOMPLETADO #############
@app.route('/predict', methods=['GET'])
@login_required
def predict():
    contexto = request.args.get('contexto', '')
    # Si no se ha pasado ningún contexto, se devuelve un array vacío.
    if not contexto:
        return jsonify([])
    # Se obtienen las sugerencias combinadas, utilizando tanto el modelo n-gram como
    # el historial personalizado del usuario
    sugerencias = obtener_sugerencias_combinadas(contexto, current_user.id)
    return jsonify(sugerencias)

######### REENTRENAR EL MODELO N-GRAM MODIFICANDO EL TAMAÑO #########
@app.route('/train', methods=['POST'])
def train():
    data = request.get_json()
    new_n = data.get('n')
    ## SI EXISTE 
    if new_n:
        global model                                            ## Se declara la variable model como global.
        model = NGramModel(n=int(new_n))                        ## Se crea una nueva instancia de NGramModel con el nuevo valor de n.
        with open('corpus.txt', encoding='utf-8') as f:
            corpus = f.read()                                   ## Se entrena el modelo con el corpus leído.
        model.train(corpus)
        return jsonify({'status': 'modelo reentrenado', 'n': new_n})
    
    return jsonify({'status': 'error', 'message': 'valor de n no proporcionado'}), 400

############## REGISTRAR LAS SUGERENCIAS ##################
# Cada vez que el usuario selecciona una sugerencia de autocompletado, se guarda un registro en la base de datos.
@app.route('/feedback', methods=['POST'])
@login_required
def feedback():
    data = request.get_json()                       ## Se recibe una petición POST, y se extrae el JSON enviado
    # OBTENEMOS DOS PARAMETROS 
    contexto = data.get('contexto', '')             ## el contexto de texto en el que se ha ofrecido la sugerencia.
    accepted = data.get('accepted', '')             ## la palabra que el usurio a seleccionado
    ## creamos una instancia feedback utilizando el id junto con el contexto y la palabara seleccionada 
    fb = Feedback(usuario_id=current_user.id, contexto=contexto, palabra_aceptada=accepted)
    db.session.add(fb)                                 ## la añadimos a la sesion de la base de datos 
    registrar_palabra(current_user.id, accepted)
    db.session.commit()                                ## y se guarda
    return jsonify({'status': 'feedback recibido'})

#################### VERIFICAR QUE EL SURIO EXISTE ########################
### permite que el fronted consulte el estado de la sesion del usuario
@app.route('/is_logged_in', methods=['GET'])
def is_logged_in():
    return jsonify({'logged_in': current_user.is_authenticated})

## gestiona el proceso de atutentificacion
## si hace GET vamos al index.html lo que carga la interfaz dd usuario
## POST: recoje el nombre y contraseña del formulario
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return send_from_directory(app.static_folder, 'index.html')
    
    username = request.form.get('username')
    password = request.form.get('password')
    user = Usuario.query.filter_by(username=username).first()
    ## si existe llamamos a login_user para iniaiar sesion
    if user and user.check_password(password):
        login_user(user)
        # comprovamos si la peticion es AJAX mediante las cabecera 
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            # si es asi devuelve un JOSN con el el estado de exito
            return jsonify({'status': 'success'})
        return redirect(url_for('index'))
    ## si no existe devuelve un json de fallo ajax 
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'status': 'fail', 'message': 'Login fallido'}), 401
    return "Login fallido", 401

###################### REGISTRO NUEVOS USUARIOS #######################
# Endpoint de registro usando AJAX
@app.route('/register', methods=['GET', 'POST'])
def register():
    ## Si se realiza una solicitud GET nos da el archivo index.html
    if request.method == 'GET':
        return send_from_directory(app.static_folder, 'index.html')
    ## para solicitud POST se recibe la contraseña y usuario dessde el formulario
    username = request.form.get('username')
    password = request.form.get('password')
    ## verificamos si el usuario existe 
    if Usuario.query.filter_by(username=username).first():
        ## Si existe y la petición es AJAX (se comprueba la cabecera X-Requested-With), se devuelve un JSON indicando fallo 
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':                     
            return jsonify({'status': 'fail', 'message': 'El usuario ya existe'}), 400
        return "El usuario ya existe", 400
    
    ##-------------------------------- CREACION NUEVO USUARIO --------------------------##
    new_user = Usuario(username=username)   ## se crea un nuevo objeto con el nombre del usuario recibido
    new_user.set_password(password)         ## establecemos la contraseña genera y almacenar un hash
    db.session.add(new_user)                ## se añade el usuario neuvo 
    db.session.commit()                     ## para guardar los datos 
    login_user(new_user)                    ## iniciio de sesion automatico
    ## respuesa final que la peticion fue AJAX y devuelve un json
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'status': 'success'})
    return redirect(url_for('index'))

##################### CRERRA SESION #################
@app.route('/logout')
@login_required                                         ## solo los usuarios autenticados puedan acceder a este endpoint
def logout():
    logout_user()                                       ## función de Flask-Login para terminar la sesión
    return jsonify({'status': 'logged out'})            ## Devuelve un JSON confirmando qeu se a cerrado la sesion

########### RUTA PRINCIPAL DE LA APLICACION ##########
@app.route('/')
@login_required                                                 ## Solo losusuarios registrados pueden acceder 
def index():
    return send_from_directory(app.static_folder, 'index.html') ## sirve el archivo desde la carepta estatica

if __name__ == '__main__':
    app.run(debug=True)