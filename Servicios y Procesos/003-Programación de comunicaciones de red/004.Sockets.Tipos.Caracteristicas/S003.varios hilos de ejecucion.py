import socket  # Importo la librería de sockets para manejar conexiones de red
import threading  # Importo threading para manejar múltiples clientes de forma concurrente

###################################### FUNCIÓN PARA MANEJAR CLIENTES #####################################

# Función que maneja la conexión con un cliente
def handle_client(client_socket, addr):
    # Imprime que la conexión fue exitosa
    print(f"Conexión establecida con: {addr}")  

    # Bucle infinito para manejar la comunicación con el cliente
    while True:  
        try:
            # Recibo el mensaje del cliente (máximo 1024 bytes)
            message = client_socket.recv(1024).decode('utf-8')
            
            # Si no hay mensaje (el cliente cerró la conexión)
            if not message:
                # Indico que el cliente se ha desconectado
                print(f"El cliente {addr} ha cerrado la conexión.")  
                break  # Rompo el bucle para detener la comunicación

            # Imprimo el mensaje recibido del cliente
            print(f"Mensaje recibido del cliente {addr}: {message}")
            
            # Envío una respuesta al cliente
            respuesta = "Hola desde el servidor"
            # Codifico la respuesta en UTF-8 y la envío
            client_socket.send(respuesta.encode('utf-8'))  
        
        # Manejo la excepción si el cliente cierra la conexión de forma inesperada
        except ConnectionResetError:
            print(f"El cliente {addr} ha cerrado la conexión inesperadamente.")
            break  # Rompo el bucle y detengo la comunicación
    
    # Cierro la conexión del cliente
    client_socket.close()

###################################### CONFIGURACIÓN DEL SERVIDOR #####################################

# Creo un socket para el servidor usando IPv4 y TCP
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Asocio el servidor a la dirección 'localhost' y al puerto 8888
server.bind(('localhost', 8888))

# Pongo el servidor en modo de escucha con capacidad para 5 conexiones pendientes
server.listen(5)

print("El servidor está escuchando en el puerto: 8888...")

############################## BUCLE PRINCIPAL DEL SERVIDOR #####################################

# Bucle infinito para aceptar conexiones entrantes de clientes
while True:

    # Acepto la conexión de un cliente
    client_socket, addr = server.accept()
    
    # Creo un nuevo hilo para manejar a cada cliente de forma concurrente
    client_thread = threading.Thread(target=handle_client, args=(client_socket, addr))
    # Inicio el hilo
    client_thread.start()  
