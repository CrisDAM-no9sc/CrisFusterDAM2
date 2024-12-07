import socket   # Importo la librería socket para trabajar con sockets
import os       # Importo os para ejecutar comandos del sistema como limpiar la pantalla
import time     # Importo time para introducir pausas en la ejecución del programa

# Defino una función para limpiar la pantalla
def clear_screen():
    # Verifico el sistema operativo y ejecuto el comando adecuado
    if os.name == 'nt':  # Si es Windows
        os.system('cls')  # Limpio pantalla con el comando 'cls'
    else:  # Para sistemas macOS o Linux
        os.system('clear')  # Limpio pantalla con el comando 'clear'

# Creo un cliente TCP/IP
cliente = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Me conecto al servidor que está escuchando en 'localhost' en el puerto 9993
cliente.connect(('localhost', 9993))

# Uso un bloque try-except-finally para manejar la conexión y posibles excepciones
try:
    while True:  # Inicio un bucle que correrá indefinidamente
        # Capturo el mensaje del usuario
        mimensaje = input("Dime tu mensaje (o espera 5 segundos para recibir del servidor): ")

        # Si el usuario introduce un mensaje, lo envío al servidor
        if mimensaje:
            cliente.send(mimensaje.encode('utf-8')) 
             # Si el mensaje es "salir", el cliente cierra la conexión 
            if mimensaje.lower() == 'salir': 
                print("Cerrando la conexión con el servidor.")  
                # Salgo del bucle para cerrar la conexión
                break  

        # Intento recibir la respuesta del servidor
        try:
            # Establezco un tiempo máximo de espera de 5 segundos para la respuesta del servidor
            cliente.settimeout(5)  
            respuesta = cliente.recv(1024).decode('utf-8')  
            # Limpio la pantalla antes de mostrar la respuesta
            clear_screen()  
            print(f"Respuesta del servidor: {respuesta}") 
        # Si pasa más de 5 segundos sin recibir respuesta, se lanza esta excepción
        except socket.timeout:  
            print("Esperando mensajes del servidor...")  

        # Pauso la ejecución durante 5 segundos antes de la siguiente interacción
        time.sleep(5)

# Si el usuario interrumpe el programa con Ctrl+C (KeyboardInterrupt), se maneja la interrupción
except KeyboardInterrupt:
    print("Cerrando la conexión debido a interrupción del teclado.") 

# Finalmente, cierro la conexión con el servidor
finally:
    # Cierro el socket del cliente
    cliente.close()  