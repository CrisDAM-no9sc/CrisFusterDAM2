import psutil

def obtener_puertos_abiertos():
    puertos_abiertos = []

    # Iterar sobre todas las conexiones activas
    for conn in psutil.net_connections(kind='inet'):
        if conn.status == 'LISTEN':
            puertos_abiertos.append((conn.laddr.ip, conn.laddr.port))
    
    return puertos_abiertos

if __name__ == "__main__":
    puertos = obtener_puertos_abiertos()
    print("Puertos abiertos:")

    for ip, puerto in puertos:
        ## convertimos el numero de puerto en una cadena para ser concatenada con la direccion ip
        print(ip+"::"+str(puerto))
        ## con la f no es necesario hacer la conversion 
        ##print(f"{ip}:{puerto}")
