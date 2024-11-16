# Flask se usa para crear una aplicación web ligera
# request es un objeto de Flask que contiene toda la información sobre la solicitud HTTP que el servidor recibe
# jsonify es una función de Flask que convierte los datos de Python en JSON 
from flask import Flask, request, jsonify  

# CORS es un mecanismo para que la aplicación web Flask sea accesible desde otros dominios o aplicaciones web                  
from flask_cors import CORS

# Inicia la aplicación
app = Flask(__name__)   

# Permite el acceso a la API desde otros orígenes
CORS(app, resources={r"/*": {"origins": "*"}})

#creamos una lista vacia donde guardaremos los mensajes enviados al servidor
##es una variable global por lo que cualquier funcion en el servidor puede acceder y modificar
mensajes = []  

#----------------------- definimos la ruta raiz  ---------------# 
# La ruta raíz (página de inicio) devuelve "Hola mundo".
@app.route('/')                                             
def inicio():                                               
    return "Hola mundo"                                   

#----------------------- OBTENEMOS LOS MENSAJES  ---------------# 
# definimos una ruta para cojer los mensajes guardados 
@app.route('/dame') 
#                                      
def dame(): 
    #nos permite acceder a la lista de menajse                                                  
    global mensajes    
    #y convertimos esa lista en json y la envia como respuesta                                    
    return jsonify(mensajes)                                    

#----------------------- RECIBIR NUEVOS MESNAJES  ---------------# 
# Aquí obtenemos los parámetros mensaje de la url con "toma?mensaje=..."
# Lo guarda en la lista mensajes, y devuelve una respuesta de éxito.
@app.route('/toma')                                        
def toma():                                                  
    global mensajes 
    # Atrapamos el mensaje de la url                                         
    mensaje = request.args.get('mensaje')   
    # agregamos el mensaje recibido como un diccionario
    # nos va a pertmiri guardar cada mensaje con un formato estructurado                 
    mensajes.append({'mensaje': mensaje})      
    #le decimos wue nos devuleva el mensaje de ok                         
    return str({"mensaje": "ok"})                           

#------------------------------- INICIAMOS EL SERVIDOR -----------------------------#
# Solo quiero que el servidor se ejecute si este archivo se está ejecutando directamente
if __name__ == '__main__':    
    # debug: pone el servidor en modo depuración, 
    # quiere decir que si cambiamos algo en el código se reiniciará automáticamente                              
    app.run(debug=True, host='0.0.0.0', port=5001)  
