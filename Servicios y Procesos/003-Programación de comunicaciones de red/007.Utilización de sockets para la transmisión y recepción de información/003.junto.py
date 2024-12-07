import imaplib
import email
from email.header import decode_header

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuración de la cuenta
username = 'dam2pruebasp@gmail.com'
password = 'kitj wvum xpwt kzod'
imap = imaplib.IMAP4_SSL("imap.gmail.com")

smtp_server = 'smtp.gmail.com'
smtp_port = 587

def enviar(desde,para,asunto,mensaje):
    # Crear un objeto de mensaje
    msg = MIMEMultipart()
    msg["From"] = desde
    msg["To"] = para
    msg["Subject"] = asunto
    body = mensaje
    msg.attach(MIMEText(body, "plain"))

    # Conectar al servidor SMTP de Gmail y enviar el correo
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Iniciar conexión segura
            server.login(username, password)
            server.sendmail(username, para, msg.as_string())
            print("Correo enviado con éxito.")
    except Exception as e:
        print(f"Error al enviar correo: {e}")
    finally:
        server.quit()

def recibir():
    pass

enviar("dam2pruebasp@gmail.com","cristinafg4631@gmail.com","Probando","Vamos a ver si nos funciona todo bien")