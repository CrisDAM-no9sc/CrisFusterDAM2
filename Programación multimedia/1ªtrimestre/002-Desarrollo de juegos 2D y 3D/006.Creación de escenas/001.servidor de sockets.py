import asyncio
import websockets
import ssl
import json

##cremaos unn conjunto de clientes vacios
connected_clients  = set()

##cuando un cliente se conecte
async def handle_client(websocket, path):
    ##lo añadimos a la lista 
    connected_clients.add(websocket)
    try:
        ##para cada uno de los clientes 
        async for message in websocket:
            ##creamos una lista de mensajes en el socket
            messages = []
            #para cada cliente conectado
            for client in connected_clients:
                ##añadimos el mensaje a la lista de mensajes
                messages.append(message)
                ##y en el caso de que haya mensajes en la lista
                if messages:
                    ##convertimos los mensajes en json antes de enviarlo
                    await websocket.send(json.dumps(messages))
    except Exception as e:
        print(f"Error: {e}")
    finally:
        ##y finalmemte quita el cliente que se a desconectado
        connected_clients.remove(websocket)

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
## introducimos los certificados de protocolo seguro
ssl_context.load_cert_chain("www.jotauve.es_ssl_certificate.cer","www.jotauve.es_private_key.key")
##haceos la conexion
start_server = websockets.serve(handle_client, "", 3000, ssl=ssl_context)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()