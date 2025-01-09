import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuración de la cuenta
username = 'dam2pruebasp@gmail.com'
password = 'kitj wvum xpwt kzod'

# Crear el correo
subject = "Prueba de envío desde Python"
body = "Hola, este es un correo de prueba enviado desde un script en Python con SMTP."
to_email = "cristinafg4631@gmail.com"

# Crear un objeto de mensaje
msg = MIMEMultipart()
msg["From"] = username
msg["To"] = to_email
msg["Subject"] = subject
msg.attach(MIMEText(body, "plain"))

# Conectar al servidor SMTP de Gmail y enviar el correo
try:
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()  # Iniciar conexión segura
        server.login(username, password)
        server.sendmail(username, to_email, msg.as_string())
        print("Correo enviado con éxito.")
except Exception as e:
    print(f"Error al enviar correo: {e}")
