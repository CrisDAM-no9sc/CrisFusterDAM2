# Archivo: sockets.py
import asyncio
import websockets
import json

# Creamos un conjunto de clientes conectados
connected_clients = set()

# Cuando un cliente se conecta
async def handle_client(websocket, path):
    # Añadimos el cliente a la lista
    connected_clients.add(websocket)
    try:
        # Para cada mensaje recibido en el socket
        async for message in websocket:
            ##envia el mensaje a los otros clientes, es donde vamos a rrecorrer todos los clientes conectados 
            for client in connected_clients:
                #si el cliente actual no es el que envio el mensaje
                if client != websocket:
                    #enviamos el mensaje a todos los demas 
                    await client.send(message)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Removemos el cliente que se desconectó
        connected_clients.remove(websocket)

# Iniciamos el servidor en el puerto 3000 sin SSL
start_server = websockets.serve(handle_client, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
