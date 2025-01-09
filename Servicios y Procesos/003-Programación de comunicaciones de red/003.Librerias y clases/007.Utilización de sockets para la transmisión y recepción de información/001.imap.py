import imaplib
import email
from email.header import decode_header

# Configuración de la cuenta
username = 'dam2pruebasp@gmail.com'
password = 'kitj wvum xpwt kzod'

# Conectar al servidor IMAP de Gmail
imap = imaplib.IMAP4_SSL("imap.gmail.com")

# Autenticarse
try:
    imap.login(username, password)
    print("Conexión exitosa a la cuenta.")
except Exception as e:
    print(f"Error al iniciar sesión: {e}")
    exit()

# Seleccionar la bandeja de entrada (Inbox)
imap.select("inbox")

# Buscar correos no leídos
status, messages = imap.search(None, 'UNSEEN')  # Cambiar "UNSEEN" por "ALL" para buscar todos los correos
mail_ids = messages[0].split()

print(f"Se encontraron {len(mail_ids)} correos no leídos.")

# Leer el último correo
if mail_ids:
    for mail_id in mail_ids[-1:]:  # Puedes cambiar para recorrer más correos
        res, msg = imap.fetch(mail_id, "(RFC822)")
        for response in msg:
            if isinstance(response, tuple):
                # Parsear el mensaje en formato bytes
                msg = email.message_from_bytes(response[1])
                # Obtener la información del correo
                subject, encoding = decode_header(msg["Subject"])[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding if encoding else "utf-8")
                from_ = msg.get("From")
                print(f"De: {from_}")
                print(f"Asunto: {subject}")
                # Si el correo tiene un cuerpo
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        if content_type == "text/plain" and "attachment" not in content_disposition:
                            body = part.get_payload(decode=True).decode()
                            print(f"Cuerpo:\n{body}")
                            break
                else:
                    body = msg.get_payload(decode=True).decode()
                    print(f"Cuerpo:\n{body}")
else:
    print("No hay correos no leídos.")

# Cerrar la conexión
imap.logout()
