from funcionescorreo import *  # Importa las funciones desde funcionescorreo.py
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    # Renderiza la página index.html
    return render_template("index.html")

@app.route("/recibir")
def recibir_email():
    # Llama a la función recibir() y devuelve los correos como JSON
    try:
        mensajes = recibir()  # Asumiendo que 'recibir' devuelve una lista de correos
        if not mensajes:
            return jsonify({"status": "error", "message": "No emails found"}), 404
        return jsonify({"status": "ok", "emails": mensajes}), 200
    except Exception as e:
        # Captura cualquier error que ocurra al recibir los correos
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/enviar", methods=["POST"])
def enviar_email():
    # Extrae los datos de la solicitud POST
    data = request.get_json()
    asunto = data.get("asunto")
    para = data.get("para")
    mensaje = data.get("mensaje")
    
    # Verificar que los parámetros no estén vacíos
    if not asunto or not para or not mensaje:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    try:
        # Llamamos a la función de envío con tus credenciales y los datos del mensaje
        respuesta = enviar("dam2pruebasp@gmail.com", para, asunto, mensaje)
        return jsonify({"status": "ok", "message": "Correo enviado correctamente"}), 200
    except Exception as e:
        # Manejo de errores en el envío
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/recibir/<mail_id>")
def recibir_email_individual(mail_id):
    # Llama a recibir() con mail_id para obtener un correo específico
    try:
        mensajes = recibir(mail_id)  # Aquí se espera que recibir(mail_id) devuelva un correo
        if mensajes:
            return jsonify({"status": "ok", "email": mensajes[0]}), 200
        else:
            return jsonify({"status": "error", "message": "Email not found"}), 404
    except Exception as e:
        # Captura errores en la función recibir
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
