#aqui hacemos la importacion de flask que es un  micro-framework, facilita la creacion de servidores web
from flask import Flask
##creamos una instancia de la aplicacion
app = Flask(__name__)

@app.route('/')
def inicio():
    return "Hola mundo!"

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')