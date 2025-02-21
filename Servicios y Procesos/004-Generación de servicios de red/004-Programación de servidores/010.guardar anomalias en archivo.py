import psutil                                       # Para medir el tráfico de red
import time                                         # Para gestionar los intervalos
import smtplib                                      # Para enviar correos
from email.mime.text import MIMEText                # Para crear correos en formato texto
from email.mime.multipart import MIMEMultipart      # Para correos con múltiples partes

################# Configuración de la cuenta de correo  #####################
username = "dam2pruebasp@gmail.com"
password = "kitj wvum xpwt kzod"
smtp_server = "smtp.gmail.com"
smtp_port = 587

############### Configuración inicial ######################
intervalo = 1               # Intervalo de medición en segundos
multiplicador_anomalia = 5  # Factor para detectar anomalías

def medir_trafico(intervalo):
    # OBTENEOS LA ESTADISTICAS INICIALES
    io_inicial = psutil.net_io_counters()
    # PAUSAMOS LA EJECUCION DURANTE EL INTERVALO ESPECIFICADO
    time.sleep(intervalo)
    # OBTENEMOS LAS ESTADISTICASD ESPUES DEL INTERVALO
    io_actual = psutil.net_io_counters()
    # CALCULAMOS TANTO LA SUBIDA COMO LA BAJADA 
    subida = (io_actual.bytes_sent - io_inicial.bytes_sent) / intervalo
    bajada = (io_actual.bytes_recv - io_inicial.bytes_recv) / intervalo
    return subida, bajada   #DEVOLVEMOS LAS TASAS DE BAJADA Y SUBIDA

def enviar_correo(asunto, mensaje):
    try:
        ################ CREAMOS EL CUERPO DEL MENSAJE ##################
        msg = MIMEMultipart()                           # creamos un nuevo objeto para el correo
        msg["From"] = username
        msg["To"] = username 
        msg["Subject"] = asunto
        msg.attach(MIMEText(mensaje, "plain"))          # adjuntamos el mansaje en formato plano al correo

        ############## CONFIGURAMOS LA CONEXION CON LE SERVIDOR SMTP ###################
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()                                       # Iniciar cifrado STARTTLS
            server.login(username, password)                        # Iniciar sesión
            server.sendmail(username, username, msg.as_string())    # Enviar correo

        print(f"Correo enviado: {asunto}")

    except Exception as e:
        print(f"Error al enviar correo: {e}")

###### CREAMOS LA FUNCION QUE SE VA A ENCARGAR DE GUARDAR LAS ANOMALIAS EN UN ARCHIVO DE TEXTO ##########
def guardar_anomalia(mensaje):
    with open("anomalias.txt", "a", encoding="utf-8") as archivo:
        archivo.write(mensaje + "\n\n")

# varible para acumular el trafico 
total_subida = 0
total_bajada = 0

print("Calculando el promedio inicial de tráfico (10 segundos)...")
#realizamos 10 mediciones en intervalos de 1s
for _ in range(10):
    subida, bajada = medir_trafico(intervalo)
    total_subida += subida
    total_bajada += bajada
#calculamos el proemdio del trafico
promedio_subida = total_subida / 10
promedio_bajada = total_bajada / 10

print(f"Promedio inicial - Subida: {promedio_subida:.2f} bytes/s, Bajada: {promedio_bajada:.2f} bytes/s")

#Monitorizar tráfico en tiempo real para detectar anomalías
print("Monitorizando tráfico en tiempo real...")

while True:
    nueva_subida, nueva_bajada = medir_trafico(intervalo)
    # Si el tráfico actual supera el umbral permitido
    if nueva_subida > promedio_subida * multiplicador_anomalia or nueva_bajada > promedio_bajada * multiplicador_anomalia:
        # generamos un mensaje de alerta 
        mensaje = (
            f"⚠️ Anomalía detectada ⚠️\n\n"
            f"Tráfico de subida: {nueva_subida:.2f} bytes/s\n"
            f"Tráfico de bajada: {nueva_bajada:.2f} bytes/s\n\n"
            f"Umbral permitido:\n"
            f"Promedio de subida: {promedio_subida:.2f} bytes/s\n"
            f"Promedio de bajada: {promedio_bajada:.2f} bytes/s\n\n"
            f"Se recomienda investigar el origen del tráfico."
        )
        print(mensaje)
        enviar_correo("Anomalía detectada en el tráfico de red", mensaje)
        # Guardar la anomalía en un archivo
        guardar_anomalia(mensaje)  
    else:
        print(f"Tráfico normal - Subida: {nueva_subida:.2f} bytes/s, Bajada: {nueva_bajada:.2f} bytes/s")