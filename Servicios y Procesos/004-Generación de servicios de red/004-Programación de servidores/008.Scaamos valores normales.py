import psutil
import time

# Configuración
intervalo = 1  # Intervalo de medición en segundos
multiplicador_anomalia = 5  # Factor para detectar anomalías (5x el promedio)

def obtener_trafico(intervalo):
    # obtenemos laas estadisticas de red inicales
    io_inicial = psutil.net_io_counters()
    ##espera el tiempo que le hemos indicado en intervalo 
    time.sleep(intervalo)
    #y obtenemos las estadisticas despeus del intervalo
    io_actual = psutil.net_io_counters()

    # Calculamos la cantidad de datos enviados y recibidos 
    subida = (io_actual.bytes_sent - io_inicial.bytes_sent) / intervalo
    descarga = (io_actual.bytes_recv - io_inicial.bytes_recv) / intervalo
    return subida, descarga

# Calcular el promedio inicial (10 segundos)
total_subida = 0                    # acumulamos el valor para el trafico de subida 
total_descarga = 0                  # para el de bajada

# calculamos el promedio inicial basados en esos 10s
for _ in range(10):
    subida, descarga = obtener_trafico(intervalo)
    total_subida += subida
    total_descarga += descarga

# Calculamos el promedio de subida y bajada
promedio_subida = total_subida / 10
promedio_descarga = total_descarga / 10

print(f"Promedio inicial - Subida: {promedio_subida:.2f} bytes/s, Descarga: {promedio_descarga:.2f} bytes/s")

## monitoreamos el trafico y detectamos anomalias basadas en elpromedio que hemos calculado en el primer bucle 
while True:
    # Calcular tráfico actual
    nuevasubida, nuevadescarga = obtener_trafico(intervalo)
    
    # Detectar anomalías
    if nuevasubida > promedio_subida * multiplicador_anomalia or nuevadescarga > promedio_descarga * multiplicador_anomalia:
        print(f"⚠️ Anomalía detectada: Subida {nuevasubida:.2f} bytes/s, Descarga {nuevadescarga:.2f} bytes/s")
    else:
        print(f"Tráfico normal - Subida: {nuevasubida:.2f} bytes/s, Descarga: {nuevadescarga:.2f} bytes/s")
