from flask import Flask

mensajes = []

app = Flask(__name__)

@app.route('/')
def inicio():
    return "Hola mundo"
    
@app.route('/dame')
def dame():
    global mensajes
    return str(mensajes)    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)