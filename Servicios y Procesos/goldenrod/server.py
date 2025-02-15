import socket
import threading
import json
import os
import sys
from datetime import datetime

TOKEN_SECRETO = "clave_segura"
ARCHIVO_MENSAJES = "messages.txt"

def manejar_cliente(conexion, direccion):
    """Maneja la conexión con un cliente, recibe datos y responde según la acción solicitada."""
    print(f"[NUEVA CONEXIÓN] Cliente conectado desde {direccion}.")
    with conexion:
        try:
            datos_recibidos = conexion.recv(4096)
            if not datos_recibidos:
                return
            
            datos_usuario = json.loads(datos_recibidos.decode('utf-8'))
            accion = datos_usuario.get("accion")
            token = datos_usuario.get("token")

            if token != TOKEN_SECRETO:
                conexion.sendall(json.dumps({"estado": "error", "mensaje": "Acceso denegado"}).encode('utf-8'))
                return

            if accion == "registrar":
                usuario = datos_usuario.get("usuario", "Desconocido")
                correo = datos_usuario.get("correo", "Sin correo")
                fecha_hora = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                with open(ARCHIVO_MENSAJES, 'a') as archivo:
                    archivo.write(f"{fecha_hora} - {usuario}, {correo}\n")

                respuesta = {"estado": "exito", "mensaje": "Registro exitoso"}
            
            elif accion == "listar":
                with open(ARCHIVO_MENSAJES, 'r') as archivo:
                    registros = archivo.readlines()

                respuesta = {"estado": "exito", "datos": registros}
            
            else:
                respuesta = {"estado": "error", "mensaje": "Acción no válida"}
            
            conexion.sendall(json.dumps(respuesta).encode('utf-8'))
        except Exception as e:
            print(f"[ERROR] {e}")
    
    print(f"[DESCONECTADO] Cliente en {direccion} desconectado.")


def iniciar_servidor():
    """Inicia el servidor y espera conexiones de clientes."""
    HOST = "0.0.0.0"
    PUERTO = 3000
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as servidor:
        servidor.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            servidor.bind((HOST, PUERTO))
        except socket.error as e:
            print(f"[ERROR] No se pudo enlazar a {HOST}:{PUERTO}: {e}")
            sys.exit(1)

        servidor.listen()
        print(f"[SERVIDOR] Escuchando en {HOST}:{PUERTO}")

        while True:
            conexion, direccion = servidor.accept()
            hilo_cliente = threading.Thread(target=manejar_cliente, args=(conexion, direccion))
            hilo_cliente.start()
            print(f"[CONEXIONES ACTIVAS] {threading.active_count() - 1}")

if __name__ == "__main__":
    print("[INICIANDO] Servidor en marcha...")
    iniciar_servidor()
