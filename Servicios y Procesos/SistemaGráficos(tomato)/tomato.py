import matplotlib.pyplot as plt
import psutil
import time
import os
from datetime import datetime

###################### Rutas adaptadas para Windows (XAMPP htdocs) ################################
rutas_datos = {
    "hora": r"C:\xampp\htdocs\SistemaGráficos\carga_hora.txt",
}

rutas_graficos = {
    "hora": r"C:\xampp\htdocs\SistemaGráficos\img\hora",
}

################################# Crear carpetas si no existen  ################################
for carpeta in rutas_graficos.values():
    os.makedirs(carpeta, exist_ok=True)

################### Función para obtener temperaturas en Windows  ################################
def obtener_temperaturas():
    ## Devuelve la temperatura del procesador si está disponible en Windows
    try:
        temperaturas = psutil.sensors_temperatures()
        if "coretemp" in temperaturas:
            return [t.current for t in temperaturas["coretemp"]]
        return []
    except AttributeError:
        return []  # Si no está disponible en Windows

################################# Cargar datos guardados  ################################
def cargar_datos(archivo):
    ## Lee y devuelve los datos almacenados en un archivo de texto 
    try:
        with open(archivo, 'r', newline='') as f:
            return [
                (datetime.fromisoformat(fila[0]), *map(float, fila[1:]))
                for fila in (linea.strip().split(',') for linea in f if linea.strip())
            ]
    except FileNotFoundError:
        return []

################################# Guardar datos en Windows  ################################
def guardar_datos(archivo, datos):
    ## Guarda los datos en un archivo de texto 
    with open(archivo, 'w', newline='') as f:
        for fila in datos:
            f.write(','.join(map(str, [fila[0].isoformat()] + list(fila[1:]))) + '\n')

################################# Medir métricas del sistema ################################
def medir_metricas():
    ## Obtiene información del sistema como CPU, RAM, disco y red 
    uso_cpu = psutil.cpu_percent(interval=1)  # Uso de CPU en porcentaje
    uso_ram = psutil.virtual_memory().percent  # Uso de RAM en porcentaje
    uso_disco = psutil.disk_usage('C:\\').percent  # Uso del disco en porcentaje

    # Medir velocidad de red (subida y bajada)
    datos_inicio = psutil.net_io_counters()
    time.sleep(1)  # Esperar un segundo para medir el tráfico
    datos_final = psutil.net_io_counters()
    descarga_mbps = (datos_final.bytes_recv - datos_inicio.bytes_recv) / (1024 * 1024)
    subida_mbps = (datos_final.bytes_sent - datos_inicio.bytes_sent) / (1024 * 1024)

    # Contar conexiones de red activas
    num_conexiones = len(psutil.net_connections())

    ######################  Obtener temperatura del procesador  ################################
    temperaturas = obtener_temperaturas()
    temperatura_promedio = sum(temperaturas) / len(temperaturas) if temperaturas else 0

    return (
        datetime.now(),  # Hora actual
        uso_cpu,
        uso_ram,
        uso_disco,
        descarga_mbps,
        subida_mbps,
        temperatura_promedio,
        num_conexiones,
    )

#############################  Cargar datos actuales ################################
buffers_datos = {clave: cargar_datos(ruta) for clave, ruta in rutas_datos.items()}
nueva_entrada = medir_metricas()
buffers_datos["hora"].append(nueva_entrada)

####################### Guardar datos actualizados ################################
for clave, ruta in rutas_datos.items():
    guardar_datos(ruta, buffers_datos[clave])

################################# Generar gráficas ###############################
def generar_grafico(datos, indice, titulo, etiqueta_y, ruta_guardado, limite_y=None):
    ## Genera y guarda un gráfico basado en los datos proporcionados 
    if not datos:
        print(f"No hay datos para {titulo}.")
        return

    tiempos = [fila[0] for fila in datos]
    valores = [fila[indice] for fila in datos]

    plt.figure(figsize=(10, 6))
    plt.plot(tiempos, valores, label=titulo, marker='o')
    plt.grid(True)
    if limite_y:
        plt.ylim(limite_y)
    plt.title(titulo)
    plt.xlabel('Tiempo')
    plt.ylabel(etiqueta_y)
    plt.legend()
    plt.tight_layout()
    plt.savefig(ruta_guardado)
    plt.close()

################################# Configuración de los gráficos  ################################
config_graficos = [
    (1, 'Uso de CPU', 'Porcentaje de Uso', (0, 100)),
    (2, 'Uso de RAM', 'Porcentaje de Uso', (0, 100)),
    (3, 'Uso de Disco', 'Porcentaje de Uso', (0, 100)),
    (4, 'Descarga', 'Mbps', None),
    (5, 'Subida', 'Mbps', None),
    (6, 'Temperatura', 'Temperatura (°C)', None),
    (7, 'Conexiones Activas', 'Conexiones', None),
]

#################################  Generar gráficos  ################################
for indice, titulo, etiqueta_y, limite_y in config_graficos:
    generar_grafico(
        buffers_datos["hora"],
        indice,
        f'{titulo} (Última Hora)',
        etiqueta_y,
        os.path.join(rutas_graficos["hora"], f'{titulo.lower().replace(" ", "_")}_hora.jpg'),
        limite_y,
    )

print(" Métricas actualizadas y gráficas generadas correctamente en Windows.")
