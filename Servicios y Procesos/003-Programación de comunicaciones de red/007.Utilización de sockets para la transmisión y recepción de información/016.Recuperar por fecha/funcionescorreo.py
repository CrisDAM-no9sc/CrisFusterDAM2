import imaplib                                          ## cONECTARSE AL SERVIDOR imap para acceder a correos electronicos desde el buzon
import email                                            ## PManeja los mensajes y decodifica su contenido 
from email.header import decode_header                  ## Decodificar encabezados como "Asunto" o "Remitente".
import smtplib                                          ## Enviar correos electrónicos (SMTP).
from email.mime.multipart import MIMEMultipart          ## Construir correos con varias partes (texto + adjuntos).
from email.mime.text import MIMEText                    ## Crear contenido textual (texto plano o HTML) para los correos.

################# CONFIGURACION DE PARAMETROS PRINCIPALES ##################

username = "dam2pruebasp@gmail.com"
password = "kitj wvum xpwt kzod"
imap_server = "imap.gmail.com"                   ## Utilizado para recibir correos electrónicos.
imap_port = 993  # IMAP SSL
smtp_server = "smtp.gmail.com"                   ## Utilizado para enviar correos electrónicos.
smtp_port = 587  # SMTP STARTTLS
smtp_ssl_port = 465  # SMTP SSL
#993 = recepcion de correos
#587 = envio de correo (STARTTLS) 

############################### FUNCIÓN PARA ENVIAR CORREOS ####################

def enviar(desde, para, asunto, mensaje):
    # nos va a permitir combinar varias partes, como texto y adjuntos 
    msg = MIMEMultipart()
    msg['From'] = desde
    msg['To'] = para
    msg['Subject'] = asunto
    # Cuerpo del mensaje
    body = mensaje
    msg.attach(MIMEText(body, "plain"))

    ##### CONEXION Y ENVIO #####
    try:
        # conexion al servidor SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()                   ## Iniciar la conexión segura
        server.login(username, password)    ## inicia sesion con credenciales 
        
        # Enviar el correo
        server.sendmail(msg['From'], msg['To'], msg.as_string())
        return {"mensaje": "Correo enviado correctamente"}
    except Exception as e:
        return {"mensaje": f"Error: {e}"}
    finally:
        server.quit()  # Cerrar la conexión

############################### FUNCIÓN PARA ENVIAR CORREOS ####################
def recibir():
    # Conectar al servidor IMAP usando SSL.
    mail = imaplib.IMAP4_SSL(imap_server,993)
    mail.login(username, password)
    ## seleccionamos el buzon de entrada 
    mail.select("inbox")

    ## Busca todos los correos.
    status, messages = mail.search(None, "ALL")

    ## Obtiene una lista de IDs de los correos.
    mail_ids = messages[0].split()

    mensajes = []

    # Iterar sobre los correos
    for mail_id in mail_ids:
        # Recuperar el correo por ID
        status, msg_data = mail.fetch(mail_id, "(RFC822)")
        
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                mensaje = {}
                # Decodificar el mensaje de correo
                msg = email.message_from_bytes(response_part[1])
                
                # Obtener el asunto (Subject)
                subject, encoding = decode_header(msg["Subject"])[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding if encoding else "utf-8")
                mensaje["Asunto"] = subject
                
                # Obtener el remitente (From)
                from_ = msg.get("From")
                mensaje["De"] = from_

                # Obtener la fecha (Date)
                date = msg.get("Date")
                mensaje["Fecha"] = date

                # Procesar el contenido del mensaje
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        
                        if content_type == "text/plain" and "attachment" not in content_disposition:
                            # Obtener el cuerpo del correo
                            body = part.get_payload(decode=True).decode("utf-8")
                            mensaje["Cuerpo"] = body
                else:
                    body = msg.get_payload(decode=True).decode("utf-8")
                    mensaje["Cuerpo"] = body
                
                mensajes.append(mensaje)

    # Cerrar conexión
    mail.close()
    mail.logout()
    return mensajes


def recibir_por_fecha(fecha_objetivo):
    # Conectar al servidor IMAP
    mail = imaplib.IMAP4_SSL(imap_server)
    mail.login(username, password)

    # Seleccionar el buzón (INBOX por defecto)
    mail.select("inbox")

    # Buscar todos los correos electrónicos
    status, messages = mail.search(None, "ALL")
    mail_ids = messages[0].split()

    # itera sobre cada id de los correos 
    for mail_id in mail_ids:
        # Recuperar el correo por ID
        status, msg_data = mail.fetch(mail_id, "(RFC822)")
        ##recuepra todo el contenido completo ; (RFC822)  le indicamos que querremos todo el contenido del cuerpo del mesnaje 
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                mensaje = {}
                # Decodificar el mensaje de correo
                msg = email.message_from_bytes(response_part[1])
                
                # Obtener la fecha (Date)
                date = msg.get("Date")
                
                # Comparar la fecha del correo con la fecha objetivo
                if date == fecha_objetivo:
                    # Obtener el asunto (Subject)
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8")
                    mensaje["Asunto"] = subject
                    
                    # Obtener el remitente (From)
                    from_ = msg.get("From")
                    mensaje["De"] = from_

                    mensaje["Fecha"] = date

                    # Procesar el contenido del mensaje
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

                    mail.close()
                    mail.logout()
                    return mensaje

    # Cerrar conexión si no se encontró la fecha
    mail.close()
    mail.logout()
    return {"mensaje": "Correo no encontrado para la fecha especificada"}