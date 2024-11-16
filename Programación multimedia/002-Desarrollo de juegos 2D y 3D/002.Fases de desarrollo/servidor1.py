from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Estado del juego inicial con tablero como una matriz 8x8
game_state = {
    "tablero": [
        ["fichablanca", "", "fichablanca", "", "fichablanca", "", "fichablanca", ""],
        ["", "fichanegra", "", "fichanegra", "", "fichanegra", "", "fichanegra"],
        ["fichablanca", "", "fichablanca", "", "fichablanca", "", "fichablanca", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["fichanegra", "", "fichanegra", "", "fichanegra", "", "fichanegra", ""],
        ["", "fichanegra", "", "fichanegra", "", "fichanegra", "", "fichanegra"],
        ["fichanegra", "", "fichanegra", "", "fichanegra", "", "fichanegra", ""]
    ],
    "turno": "p1",  # El turno inicial es para el jugador 1
    "last_updated_by": ""  # El jugador que hizo la última actualización
}

def es_movimiento_valido(origen, destino, jugador):
    # Función para verificar si un movimiento es válido según las reglas
    fila_origen, col_origen = origen
    fila_destino, col_destino = destino

    ficha_origen = game_state['tablero'][fila_origen][col_origen]
    ficha_destino = game_state['tablero'][fila_destino][col_destino]

    # Verifica que la ficha de origen sea del jugador correcto
    if jugador == "p1" and ficha_origen != "fichanegra":
        return False
    if jugador == "p2" and ficha_origen != "fichablanca":
        return False

    # Verifica que la celda de destino esté vacía
    if ficha_destino != "":
        return False

    # Lógica de movimiento: las fichas se mueven solo una casilla en diagonal
    if abs(fila_destino - fila_origen) != 1 or abs(col_destino - col_origen) != 1:
        return False

    return True

@app.route('/update_board', methods=['POST'])
def update_board():
    data = request.get_json()
    origen = data.get('origen')  # Tupla (fila, columna) de la ficha de origen
    destino = data.get('destino')  # Tupla (fila, columna) de la celda destino
    jugador = data.get('player')  # Jugador que realizó el movimiento
    
    if jugador != game_state["turno"]:
        return jsonify({"status": "error", "message": "No es tu turno"}), 400

    # Verificar si el movimiento es válido
    if es_movimiento_valido(origen, destino, jugador):
        # Actualiza el tablero
        fila_origen, col_origen = origen
        fila_destino, col_destino = destino
        
        # Mueve la ficha en el tablero
        game_state['tablero'][fila_destino][col_destino] = game_state['tablero'][fila_origen][col_origen]
        game_state['tablero'][fila_origen][col_origen] = ""  # Vacía la celda de origen
        
        # Cambia el turno
        game_state['turno'] = "p1" if jugador == "p2" else "p2"
        game_state['last_updated_by'] = jugador  # Actualiza quién hizo la última jugada

        return jsonify({"status": "success", "message": "Movimiento realizado correctamente"})
    else:
        return jsonify({"status": "error", "message": "Movimiento no válido"}), 400

@app.route('/get_board', methods=['GET'])
def get_board():
    # Devuelve el estado actual del juego
    return jsonify(game_state)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Escucha en el puerto 5000
