from funcionescorreo import *  # Importa las funciones desde funcionescorreo.py
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


# Ruta para servir archivos estáticos desde la carpeta `public`
@app.route('/public/<path:filename>')
def public_static(filename):
    return send_from_directory(os.path.join(app.root_path, 'public'), filename)

# Ruta para la página principal
@app.route("/")
def index():
    return render_template("index.html")  # Renderiza la página index.html

# Ruta para recibir todos los correos
@app.route("/recibir")
def recibir_email():
    try:
        mensajes = recibir()  # Llama a la función recibir() desde funcionescorreo.py
        if not mensajes:
            return jsonify({"status": "error", "message": "No emails found"}), 404
        return jsonify({"status": "ok", "emails": mensajes}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Ruta para enviar correos
@app.route("/enviar", methods=["POST"])
def enviar_email():
    data = request.get_json()
    asunto = data.get("asunto")
    para = data.get("para")
    mensaje = data.get("mensaje")
    
    # Validar los datos recibidos
    if not asunto or not para or not mensaje:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    try:
        enviar("dam2pruebasp@gmail.com", para, asunto, mensaje)  # Usa la función enviar()
        return jsonify({"status": "ok", "message": "Correo enviado correctamente"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Ruta para recibir correos filtrados por fecha
@app.route("/recibir_por_fecha/<fecha>")
def recibir_email_por_fecha(fecha):
    try:
        mensaje = recibir_por_fecha(fecha)  # Usa la función recibir_por_fecha()
        if mensaje:
            return jsonify({"status": "ok", "email": mensaje}), 200
        else:
            return jsonify({"status": "error", "message": "Correo no encontrado para la fecha especificada"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Ruta para recibir un correo específico por ID
@app.route("/recibir/<mail_id>")
def recibir_email_individual(mail_id):
    try:
        mensajes = recibir(mail_id)  # Aquí se espera que recibir(mail_id) devuelva un correo
        if mensajes:
            return jsonify({"status": "ok", "email": mensajes[0]}), 200
        else:
            return jsonify({"status": "error", "message": "Email not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
