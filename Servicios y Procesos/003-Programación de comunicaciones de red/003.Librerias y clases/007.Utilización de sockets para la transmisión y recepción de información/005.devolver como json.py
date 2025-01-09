import imaplib
import email
from email.header import decode_header

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Configuración de la cuenta
username = 'dam2pruebasp@gmail.com'  # Tu correo
password = 'kitj wvum xpwt kzod'  # Contraseña de aplicación de Gmail
imap_server = "imap.gmail.com"  # Servidor IMAP de Gmail
smtp_server = "smtp.gmail.com"  # Servidor SMTP de Gmail
smtp_port = 587  # Puerto para SMTP con TLS

def enviar(desde, para, asunto, mensaje):
    # Crear el mensaje
    msg = MIMEMultipart()
    msg['From'] = desde
    msg['To'] = para
    msg['Subject'] = asunto
    # Cuerpo del mensaje
    body = mensaje
    msg.attach(MIMEText(body, "plain"))

    # Enviar el mensaje
    try:
        # Conectar al servidor SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Iniciar la conexión segura
        server.login(username, password)

        # Enviar el correo
        server.sendmail(msg['From'], msg['To'], msg.as_string())
        return {"mensaje": "Correo enviado correctamente"}
    except Exception as e:
        return {"mensaje": f"Error: {e}"}
    finally:
        server.quit()  # Cerrar la conexión

def recibir():
    # Conectar al servidor IMAP
    mail = imaplib.IMAP4_SSL(imap_server)
    try:
        mail.login(username, password)
        mail.select("inbox")

        # Buscar todos los correos (puedes usar "UNSEEN" para correos no leídos)
        status, messages = mail.search(None, "ALL")
        mail_ids = messages[0].split()

        mensajes = []
        for mail_id in mail_ids:
            # Obtener el correo completo en formato RFC822
            status, msg_data = mail.fetch(mail_id, "(RFC822)")
            
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    mensaje = {}
                    msg = email.message_from_bytes(response_part[1])
                    # Decodificar el asunto
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8")
                    mensaje["Asunto"] = subject

                    # Decodificar el remitente
                    from_ = msg.get("From")
                    mensaje["De"] = from_

                    # Procesar el cuerpo del mensaje
                    if msg.is_multipart():
                        for part in msg.walk():
                            content_type = part.get_content_type()
                            content_disposition = str(part.get("Content-Disposition"))
                            if content_type == "text/plain" and "attachment" not in content_disposition:
                                body = part.get_payload(decode=True).decode("utf-8")
                                mensaje["Cuerpo"] = body
                    else:
                        body = msg.get_payload(decode=True).decode("utf-8")
                        mensaje["Cuerpo"] = body

                    # Almacenar el mensaje procesado
                    mensajes.append(mensaje)

        print(mensajes)
    except Exception as e:
        print(f"Error al recibir correos: {e}")
    finally:
        # Cerrar la conexión
        mail.close()
        mail.logout()

# Llamar a la función para recibir los correos
recibir()
