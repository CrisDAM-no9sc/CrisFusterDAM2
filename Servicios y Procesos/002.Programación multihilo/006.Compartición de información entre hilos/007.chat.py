# request nos va a permitir acceder a las solicitudes http que lleguan al servidor 
#jsonify convierte la estructura de datos (listas, diccionarios) en formato json
from flask import Flask, request, jsonify
#para permitir que sea accesible desde otros dominios 
from flask_cors import CORS  

#variable global donde se van a guadar los mensjaes recibidos y sus autores
# Lista que almacenará los mensajes
mensajes = []

# Creamos una instancia de la aplicación Flask, necesaria para definir rutas y solicitudes
app = Flask(__name__)

# Activamos CORS en la aplicación
CORS(app)

#------------------------------- definimos la ruta raiz -----------------------------#
# Ruta principal
# Definimos la ruta raíz
@app.route('/')                                             
def inicio():    
    # Retorna un saludo simple al acceder a la ruta                                           
    return "Hola mundo"  

#------------------------------- OBTENEMOS LOS MENSAJES -----------------------------#
# Ruta para obtener los mensajes
# Definimos la ruta /dame
@app.route('/dame')                                          
def dame(): 
    # Accedemos a la lista de mensajes global                                                 
    global mensajes 
    # Retorna la lista de mensajes en formato JSON 
    return jsonify(mensajes)  

#------------------------------- RECIBIR NUEVOS MESNAJES -----------------------------#
# Ruta para recibir nuevos mensajes
@app.route('/toma')                                       
def toma():     
    # Accedemos a la lista de mensajes global                                             
    global mensajes 
    # Obtenemos los parámetros 'mensaje' y 'usuario' de la solicitud
    mensaje = request.args.get('mensaje')                  
    usuario = request.args.get('usuario')                   
    
    # Agregamos el nuevo mensaje y el usuario a la lista
    mensajes.append({'mensaje': mensaje, 'usuario': usuario})  
    # Retorna una respuesta simple indicando que se recibió el mensaje
    return str({"mensaje": "ok"})  

#------------------------------- INICIAMOS EL SERVIDOR -----------------------------#
# Bloque principal para ejecutar la aplicación
if __name__ == '__main__':   
    # Inicia la aplicación en modo debug y en la IP y puerto especificados                               
    app.run(debug=True, host='0.0.0.0', port=5001) 
