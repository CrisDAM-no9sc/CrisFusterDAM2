import socket  # para manejar conexiones de red (cliente y servidor )
import threading  # Importo threading para manejar múltiples clientes de forma concurrente

###################################### FUNCIÓN PARA MANEJAR CLIENTES #####################################

contador = 1 ##creamos un contador global
mensajes = []

# Esta funcion se ejecuta cada vez que el cliente dice algo 
def handle_client(client_socket, addr):
    global mensajes ## metemos la variable dentro de la funcion
    # Imprime que la conexión fue exitosa
    print(f"Conexión establecida con: {addr}")  

    # Bucle infinito para manejar la comunicación con el cliente
    while True:  
        try:
            # Recibo el mensaje del cliente (máximo 1024 bytes)
            message = client_socket.recv(1024).decode('utf-8')
            mensajes.append(message)
            # Si no hay mensaje (el cliente cerró la conexión)
            if not message:
                # Indico que el cliente se ha desconectado
                print(f"El cliente {addr} ha cerrado la conexión.")  
                break  # Rompo el bucle para detener la comunicación

            # Imprimo el mensaje recibido del cliente
            print(f"Mensaje recibido del cliente {addr}: {message}")
            ## Le sumamos uno al contador para demostrar el estado del servidor 
            respuesta = ""
            for mensaje in mensajes:
                respuesta += mensaje+"\n"
            
            # Codifico la respuesta en UTF-8 y la envío
            client_socket.send(respuesta.encode('utf-8'))  
        
        # Manejo la excepción si el cliente cierra la conexión de forma inesperada
        except ConnectionResetError:
            print(f"El cliente {addr} ha cerrado la conexión inesperadamente.")
            break  # Rompo el bucle y detengo la comunicación
    
    # Cierro la conexión del cliente
    client_socket.close()

###################################### CONFIGURACIÓN DEL SERVIDOR #####################################

# Creo un nuevo servidor de sockets
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Especificamos ruta de puerto y escucha
server.bind(('localhost', 8888))

# Pongo el servidor en modo de escucha con capacidad para 5 conexiones pendientes
server.listen(5)

print("El servidor está escuchando en el puerto: 8888...")

############################## BUCLE PRINCIPAL DEL SERVIDOR #####################################

# Bucle infinito para aceptar conexiones entrantes de clientes
while True:

    # Acepto la conexión de nuevos clientes
    client_socket, addr = server.accept()
    
    # Para cada cliente arrancamos un nuevo hilo de ejecucion
    client_thread = threading.Thread(target=handle_client, args=(client_socket, addr))
    # Inicio el hilo
    client_thread.start()  
