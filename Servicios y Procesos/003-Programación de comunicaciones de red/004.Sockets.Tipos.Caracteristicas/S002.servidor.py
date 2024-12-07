import socket  # Importo la librería de sockets

################################## CONFIGURACIÓN DEL SERVIDOR ##################################

# Creo un socket para el servidor (IPv4, TCP)
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Asocio el servidor a 'localhost' en el puerto 8888
server.bind(('localhost', 8888))

# Pongo el servidor en modo de escucha para un máximo de 5 conexiones pendientes
server.listen(5)

print(f"El servidor está escuchando en: 8888...")

################################## ACEPTACIÓN DE CLIENTE ######################################

# Acepto la conexión de un cliente
client_socket, addr = server.accept()

# Imprimo la dirección del cliente que se conectó
print(f"Conexión establecida con: {addr}")

####################################### BUCLE DE COMUNICACIÓN #####################################

# Bucle infinito para recibir y enviar mensajes entre cliente y servidor
while True:
    # Recibo un mensaje del cliente (máximo 1024 bytes) y lo decodifico
    message = client_socket.recv(1024).decode("utf-8")
    
    # Si no hay mensaje (cliente cerró la conexión), salgo del bucle
    if not message:
        print("El cliente ha cerrado la conexión.")
        break
    
    # Imprimo el mensaje recibido desde el cliente
    print(f"Mensaje recibido del cliente: {message}")
    
    # Envío una respuesta al cliente
    respuesta = "Hola desde el servidor"
     # Codifico y envío el mensaje al cliente
    client_socket.send(respuesta.encode('utf-8')) 

# Cierro la conexión con el cliente cuando termina la comunicación
client_socket.close()
