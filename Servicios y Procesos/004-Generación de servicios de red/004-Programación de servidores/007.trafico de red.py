import psutil
import time

## este script nos va a enseñar el trafico de red a cada segundo 
# utilizamos pustill.net_io_counters para obtneer los bytes enciados y recibidos 
def obtener_trafico_red():
    # Obtiene las estadísticas de tráfico de red
    trafico = psutil.net_io_counters()
    
    # Bytes enviados y recibidos
    bytes_recibidos = trafico.bytes_recv            ## refleja los datos que descargamos al visitar una pagina web o la descarga de un archvio 
    bytes_enviados = trafico.bytes_sent             ## los que subimos (ej.enviar solicitud a la web o cragar una archivo)
    
    return bytes_recibidos, bytes_enviados

def mostrar_trafico():
    print("Monitoreando el tráfico de red...")
    print("Tiempo transcurrido | Bytes Recibidos | Bytes Enviados")
    
    while True:
        # Obtiene los bytes de tráfico de red en este momento
        bytes_recibidos_inicial, bytes_enviados_inicial = obtener_trafico_red()
        
        # Espera 1 segundo
        time.sleep(1)
        
        # Obtiene el tráfico de red después de 1 segundo
        bytes_recibidos_final, bytes_enviados_final = obtener_trafico_red()
        
        # Calcula el tráfico en 1 segundo
        bytes_recibidos_segundo = bytes_recibidos_final - bytes_recibidos_inicial
        bytes_enviados_segundo = bytes_enviados_final - bytes_enviados_inicial
        
        # imprimmos la cantidad de bytes enseñandolos resultados en timepo real conla marca de timepo de cada medicion
        print(f"{time.strftime('%H:%M:%S')} | {bytes_recibidos_segundo} bytes recibidos | {bytes_enviados_segundo} bytes enviados")

if __name__ == "__main__":
    mostrar_trafico()
