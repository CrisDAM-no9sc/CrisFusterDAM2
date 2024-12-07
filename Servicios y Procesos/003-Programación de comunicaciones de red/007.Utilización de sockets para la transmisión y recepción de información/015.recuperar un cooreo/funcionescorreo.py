import imaplib
import email
from email.header import decode_header
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Configuración de la cuenta
username = "dam2pruebasp@gmail.com"  # Tu correo
password = "kitj wvum xpwt kzod"  # Contraseña de aplicación de Gmail
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

def recibir(limite=50):  # Se añade un parámetro para limitar los correos
    try:
        # Conectar al servidor IMAP
        mail = imaplib.IMAP4_SSL(imap_server)
        mail.login(username, password)

        # Seleccionar el buzón (INBOX por defecto)
        mail.select("inbox")

        # Buscar todos los correos electrónicos
        status, messages = mail.search(None, "ALL")
        if status != "OK":
            return {"mensaje": "No se pudieron recuperar los correos"}

        # Obtener los IDs y limitar la cantidad
        mail_ids = messages[0].split()[-limite:]  # Limitamos los correos a la cantidad indicada
        mensajes = []

        # Iterar sobre los correos
        for mail_id in mail_ids:
            # Recuperar el correo por ID
            status, msg_data = mail.fetch(mail_id, "(RFC822)")
            if status != "OK":
                continue

            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    mensaje = {"mail_id": mail_id.decode()}

                    # Decodificar asunto
                    subject, encoding = decode_header(msg.get("Subject"))[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8", errors="replace")
                    mensaje["Asunto"] = subject or "(Sin asunto)"

                    # Decodificar remitente
                    from_ = msg.get("From")
                    mensaje["De"] = from_ or "(Sin remitente)"

                    # Decodificar fecha
                    mensaje["Fecha"] = msg.get("Date")

                    # Decodificar cuerpo
                    cuerpo = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain" and "attachment" not in str(part.get("Content-Disposition", "")):
                                cuerpo = part.get_payload(decode=True).decode("utf-8", errors="replace")
                                break
                    else:
                        cuerpo = msg.get_payload(decode=True).decode("utf-8", errors="replace")
                    mensaje["Cuerpo"] = cuerpo or "(Sin contenido)"

                    mensajes.append(mensaje)

        # Cerrar conexión
        mail.close()
        mail.logout()
        return mensajes
    except Exception as e:
        return {"mensaje": f"Error inesperado: {e}"}

def recibir_individual(mail_id):
    # Recibe un correo específico por ID
    try:
        mail = imaplib.IMAP4_SSL(imap_server)
        mail.login(username, password)

        # Seleccionar el buzón
        mail.select("inbox")

        # Buscar el correo por ID
        status, msg_data = mail.fetch(mail_id, "(RFC822)")
        if status != "OK":
            return {"mensaje": f"Correo con ID {mail_id} no encontrado"}

        # Decodificar el correo
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                mensaje = {"mail_id": mail_id}

                # Decodificar asunto
                subject, encoding = decode_header(msg.get("Subject"))[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding if encoding else "utf-8", errors="replace")
                mensaje["Asunto"] = subject or "(Sin asunto)"

                # Decodificar remitente
                from_ = msg.get("From")
                mensaje["De"] = from_ or "(Sin remitente)"

                # Decodificar fecha
                mensaje["Fecha"] = msg.get("Date")

                # Decodificar cuerpo
                cuerpo = ""
                if msg.is_multipart():
                    for part in msg.walk():
                        if part.get_content_type() == "text/plain" and "attachment" not in str(part.get("Content-Disposition", "")):
                            cuerpo = part.get_payload(decode=True).decode("utf-8", errors="replace")
                            break
                else:
                    cuerpo = msg.get_payload(decode=True).decode("utf-8", errors="replace")
                mensaje["Cuerpo"] = cuerpo or "(Sin contenido)"

                mail.close()
                mail.logout()
                return mensaje

    except Exception as e:
        return {"mensaje": f"Error inesperado: {e}"}
