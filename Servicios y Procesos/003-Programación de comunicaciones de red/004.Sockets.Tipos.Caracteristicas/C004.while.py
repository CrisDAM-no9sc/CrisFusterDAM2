import socket  #  para la comunicación de red
import os      # Importo la librería de operaciones del sistema para limpiar la pantalla

def clear_screen():
    # Verifico el sistema operativo y llamo al comando apropiado
    if os.name == 'nt':  # Para Windows
        os.system('cls')  # Limpia la pantalla
    else: 
         # Para macOS o Linux
         # Limpia la pantalla
        os.system('clear') 

# Creo un socket para el cliente usando IPv4 y TCP
cliente = socket.socket(socket.AF_INET, socket.SOCK_STREAM)                    

# Me conecto a la dirección 'localhost' y al puerto 8888 donde hay un servidor escuchando
cliente.connect(('localhost', 8888))                                            

# Comienza un bucle infinito para permitir múltiples envíos de mensajes
while True:
    # atrapamos la entrada de ususario                                                                    
    mimensaje = input("Dime tu mensaje: ")  

    # Envío el mensaje codificado en formato UTF-8 al servidor
    cliente.send(mimensaje.encode('utf-8'))                                    

    # cuando reciba una respuesta por parte del servidor 
    respuesta = cliente.recv(1024).decode('utf-8') 
    # Limpio la pantalla                             
    clear_screen()  
    # Muestro la respuesta del servidor
    print(f"{respuesta}")  

    # Si el usuario escribe "salir" (en cualquier combinación de mayúsculas o minúsculas)
    if mimensaje.lower() == 'salir':   
        # Imprimo un mensaje de cierre                                        
        print("Cerrando la conexión con el servidor.")  
        break  # Salgo del bucle y cierro la conexión

# Cierro el socket del cliente después de salir del bucle
cliente.close()  
