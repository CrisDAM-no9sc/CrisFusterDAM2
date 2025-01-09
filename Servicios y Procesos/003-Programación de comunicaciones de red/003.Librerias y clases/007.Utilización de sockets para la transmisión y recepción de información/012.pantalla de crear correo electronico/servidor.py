from funcionescorreo import *
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/recibir")
def recibir_email():
    return recibir()


@app.route("/enviar", methods=["POST"])
def enviar_email():
    data = request.get_json()
    asunto = data.get("asunto")
    para = data.get("para")
    mensaje = data.get("mensaje")
    enviar("dam2pruebasp@gmail.com",para, asunto, mensaje)
    return jsonify({"status": "ok", "message": "ok"}),200

if __name__ == "__main__":
    app.run(debug=True)