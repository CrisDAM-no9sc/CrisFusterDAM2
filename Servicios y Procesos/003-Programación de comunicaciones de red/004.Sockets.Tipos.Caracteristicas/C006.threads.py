import socket  # Importo la librería socket para manejar conexiones de red
import os      # Importo os para ejecutar comandos del sistema, como limpiar pantalla
import threading  # Importo threading para usar hilos (ejecución simultánea)
import time  # Importo time para introducir pausas en la ejecución del programa

# Función para limpiar la pantalla según el sistema operativo
def clear_screen():
    if os.name == 'nt':  # Si el sistema es Windows
        os.system('cls')  # Comando para limpiar pantalla en Windows
    else:  # Para macOS o Linux
        os.system('clear')  # Comando para limpiar pantalla en estos sistemas

# Función para recibir mensajes del servidor
def recibir_mensajes(cliente):
    while True:  # Bucle infinito para recibir mensajes continuamente
        try:
            # Recibo los mensajes del servidor
            respuesta = cliente.recv(1024).decode('utf-8')
            if respuesta:
                clear_screen()  # Limpio la pantalla antes de mostrar la respuesta
                print(f"Respuesta del servidor: {respuesta}")  # Imprimo la respuesta recibida
        except socket.error:
            # Si hay un error en la recepción de mensajes (por ejemplo, no hay mensaje), lo ignoro
            pass
        # Pauso por 5 segundos antes de volver a intentar recibir mensajes
        time.sleep(5)

# Función para enviar mensajes al servidor
def enviar_mensajes(cliente):
    while True:  # Bucle infinito para enviar mensajes continuamente
        mimensaje = input("Dime tu mensaje: ")  # Capturo la entrada del usuario
        cliente.send(mimensaje.encode('utf-8'))  # Envío el mensaje al servidor
        if mimensaje.lower() == 'salir':  # Si el mensaje es "salir", termina la conexión
            print("Cerrando la conexión con el servidor.")
            cliente.close()  # Cierro la conexión con el servidor
            break  # Salgo del bucle para detener el hilo de envío

# Configuración del cliente (creación de socket TCP/IP)
cliente = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Me conecto al servidor en la dirección
cliente.connect(('127.0.0.1', 8888))

# Creo un hilo para recibir mensajes, llamando a la función 'recibir_mensajes'
thread_recibir = threading.Thread(target=recibir_mensajes, args=(cliente,))
# Creo otro hilo para enviar mensajes, llamando a la función 'enviar_mensajes'
thread_enviar = threading.Thread(target=enviar_mensajes, args=(cliente,))

# Inicio ambos hilos
thread_recibir.start()
thread_enviar.start()

# Espero a que ambos hilos terminen antes de finalizar el programa
thread_enviar.join()
thread_recibir.join()
