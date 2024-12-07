import asyncio
import websockets
import json

connected_clients = set()

async def handler(websocket, path):
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            print("Mensaje recibido:", message)  
            # Reenviar los datos a todos los clientes conectados
            for client in connected_clients:
                if client != websocket:  # No enviar a sí mismo
                    await client.send(message)
    finally:
        connected_clients.remove(websocket)

start_server = websockets.serve(handler, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
print("Servidor WebSocket iniciado en ws://localhost:3000")
asyncio.get_event_loop().run_forever()
