# Archivo: sockets.py
#permite la ejecucion del codigo de forma asincronica
import asyncio
#nos va a proporcionar las herramientas para crear un servidor
import websockets
#permite codificar y decodificar datos en formato JSON , es el formato que vamos a utilizar para enviar y rebir
#mensjaes entre servidor y clientes
import json

# va a guardar todas las conexiones de clientes activos
#nos permitira ver cuantos clienets estan conectados
connected_clients = set()

#definimos una funcion asincronica , para manejar a comunicacion con cadda cliente que se conecte al sevridor 
##coje dos paramentros 
async def handle_client(websocket, path):
    # Añadimos el cliente a la lista
    connected_clients.add(websocket)
    
    try:
        #Empezamos con un bucle que va a iterar cada vez que el servidor reciba el mensaje del cliente(websocket)
        async for message in websocket:
            # Creamos una lista vacia de mensajes
            #lo vamos a usar para alamacenar temporalmente los mensajes 
            messages = []
            # Para cada cliente conectado
            for client in connected_clients:
                # Añadimos el mensaje a la lista
                messages.append(message)
                # Enviamos los mensajes en formato JSON
                if messages:
                    #si la lista continene algun mensjae los convierte en json
                    await websocket.send(json.dumps(messages))
    except Exception as e:
        print(f"Error: {e}")
    #elimina la cnoexion cuando el cliente se desconecta o ocurre algun error
    #esto asegura que la lista este actualizada y no tenga clientes inactivos
    finally:
        connected_clients.remove(websocket)

# Iniciamos el servidor en el puerto 3000 sin SSL
start_server = websockets.serve(handle_client, "localhost", 3000)
##ejecuta el servidor hasta que este completamente iniciado y listo para las conexiones
asyncio.get_event_loop().run_until_complete(start_server)
#para mantener el servidor ejecutandose indefinidamente
asyncio.get_event_loop().run_forever()
