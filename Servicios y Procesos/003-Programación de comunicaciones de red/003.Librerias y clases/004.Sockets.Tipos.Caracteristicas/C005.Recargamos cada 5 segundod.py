# para la comunicación de red
import socket  
# para operaciones del sistema para limpiar la pantalla
import os     
# para tiempo para manejar pausas en la ejecución
import time    

# Función para limpiar la pantalla
def clear_screen():
    # Verifico el sistema operativo y llamo al comando apropiado para limpiar la pantalla
    if os.name == 'nt':  # Para Windows
        os.system('cls')  # Limpia la pantalla
    else:  # Para macOS o Linux
        os.system('clear')  # Limpia la pantalla

###################################### INICIO DEL CLIENTE #####################################

# Creo un socket para el cliente usando IPv4 y TCP
cliente = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Me conecto a la dirección 'localhost' y al puerto 8888 donde hay un servidor escuchando
cliente.connect(('localhost', 8888))

try:
    ###################################### BUCLE PRINCIPAL #####################################

    # Inicio de un bucle infinito para la interacción con el usuario
    while True:  
        # Atrapo la entrada del usuario
        mimensaje = input("Dime tu mensaje (o espera 5 segundos para recibir del servidor): ")

        # Enviar mensaje si el usuario proporciona uno
        if mimensaje:  # Verifico que el mensaje no esté vacío
            # Envio el mensaje al servidor
            cliente.send(mimensaje.encode('utf-8'))  
            # Si el usuario indica "salir"
            if mimensaje.lower() == 'salir':  
                # Imprimo un mensaje
                print("Cerrando la conexión con el servidor.")  
                break  # Salgo del bucle y cierro la conexión

        ############################ RECIBIR RESPUESTA DEL SERVIDOR #####################
        
        # Intento recibir respuesta del servidor
        try:
            # Establezco un tiempo de espera de 5 segundos para la respuesta
            cliente.settimeout(5)  
            # Recibo la respuesta del servidor
            respuesta = cliente.recv(1024).decode('utf-8')  
            # Limpio la pantalla antes de mostrar la respuesta
            clear_screen() 
            # Muestro la respuesta del servidor
            print(f"Respuesta del servidor: {respuesta}") 

        # Manejo la excepción de tiempo de espera 
        except socket.timeout:  
            # Indico que estoy esperando una respuesta
            print("Esperando mensajes del servidor...")  

        # Espero 5 segundos antes de la siguiente interacción
        time.sleep(5)  

###################################### MANEJO DE EXCEPCIONES #####################################

except KeyboardInterrupt:  # Captura de interrupciones del teclado (Ctrl+C)
    print("Cerrando la conexión debido a interrupción del teclado.")

finally:
    cliente.close()  # Cierro la conexión al final
