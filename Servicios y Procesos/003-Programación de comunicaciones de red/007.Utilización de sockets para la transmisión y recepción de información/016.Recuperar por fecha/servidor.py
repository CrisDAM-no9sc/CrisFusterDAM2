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
        respuesta = enviar("dam@jocarsa.com", para, asunto, mensaje)
        return jsonify({"status": "ok", "message": "Correo enviado correctamente"}), 200
    except Exception as e:
        # Manejo de errores en el envío
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/recibir/<mail_id>")
def recibir_email_individual(mail_id):
    try:
        print(f"Recibiendo correo con ID: {mail_id}")  # Verifica qué ID se está recibiendo
        if not mail_id:
            return jsonify({"status": "error", "message": "Mail ID is missing"}), 400

        # Llamamos a la función recibir con mail_id
        mensajes = recibir(mail_id)

        if isinstance(mensajes, dict) and mensajes.get("status") == "error":
            print(f"Error al recuperar el correo: {mensajes['message']}")
            return jsonify(mensajes), 500  # Devolver el error del servidor

        if mensajes:
            print(f"Correo encontrado: {mensajes[0]}")  # Ver los detalles del correo
            return jsonify({"status": "ok", "email": mensajes[0]}), 200
        else:
            print(f"Correo no encontrado para el ID: {mail_id}")
            return jsonify({"status": "error", "message": "Email not found"}), 404
    except Exception as e:
        print(f"Error en recibir_email_individual: {str(e)}")  # Imprimir error
        return jsonify({"status": "error", "message": f"Error inesperado: {str(e)}"}), 500
    
if __name__ == "__main__":
    app.run(debug=True)
