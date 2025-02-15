import ipaddress
import json
import os
import logging
import time

# Configuración del logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

# Configuración global para entorno local
LOCAL_COUNTRY_DB = 'local_country_db.json'
ACCESS_LOG = 'access.log'
HTACCESS_FILE = 'htaccess.local'
NON_DESIRED_COUNTRIES = ["China", "Ukraine", "Singapore"]

# Configuración para bloqueos temporales
TEMP_BLOCK_FILE = 'temp_blocks.json'
TEMP_BLOCK_THRESHOLD = 2      # Umbral: si una IP aparece >= 2 veces, se bloquea temporalmente
TEMP_BLOCK_DURATION = 3600    # Duración del bloqueo en segundos (3600 = 1 hora)
# Para pruebas puedes poner, por ejemplo, 30 segundos

### Funciones existentes ###

def load_local_country_db(db_path=LOCAL_COUNTRY_DB):
    """
    Carga la base de datos local en formato JSON que mapea IP a país.
    """
    if not os.path.exists(db_path):
        logging.error("No se encontró el archivo de la base de datos local: %s", db_path)
        return {}
    try:
        with open(db_path, 'r') as f:
            db = json.load(f)
            logging.info("Se cargó la base de datos local con %d entradas.", len(db))
            return db
    except Exception as e:
        logging.error("Error al leer la base de datos local: %s", e)
        return {}

def get_country(ip, country_db):
    """
    Obtiene el país para la IP consultando la base de datos local.
    Si no se encuentra, devuelve "Unknown".
    """
    return country_db.get(ip, "Unknown")

def backup_file(file_path, suffix=".backup"):
    """
    Crea una copia de respaldo del archivo especificado.
    """
    if os.path.exists(file_path):
        backup_path = file_path + suffix
        try:
            with open(file_path, 'r') as original, open(backup_path, 'w') as backup:
                backup.write(original.read())
            logging.info("Respaldo de %s creado en %s", file_path, backup_path)
        except Exception as e:
            logging.error("Error al crear respaldo de %s: %s", file_path, e)

def update_htaccess(blacklisted_ips, section_marker):
    """
    Actualiza el archivo htaccess (HTACCESS_FILE) añadiendo las reglas de bloqueo
    para las IPs proporcionadas dentro de la sección definida por section_marker.
    
    section_marker: Tupla (start_marker, end_marker)
    """
    start_marker, end_marker = section_marker

    # Leer el contenido existente
    if os.path.exists(HTACCESS_FILE):
        with open(HTACCESS_FILE, 'r') as f:
            lines = f.readlines()
    else:
        lines = []

    existing_ips = set()
    within_block = False
    block_start_index = None
    block_end_index = None

    # Buscar sección existente
    for index, line in enumerate(lines):
        if line.strip() == start_marker:
            within_block = True
            block_start_index = index
            continue
        if line.strip() == end_marker:
            within_block = False
            block_end_index = index
            break
        if within_block and line.strip().startswith("    Require not ip"):
            ip_val = line.strip().split("Require not ip")[-1].strip()
            existing_ips.add(ip_val)

    new_ips = set(blacklisted_ips) - existing_ips
    if not new_ips:
        logging.info("No hay nuevas IPs para agregar en la sección: %s", start_marker)
        return

    block_rules = []
    if block_start_index is not None and block_end_index is not None:
        # Insertar nuevas reglas antes de la marca de fin
        for ip in new_ips:
            block_rules.append(f"    Require not ip {ip}\n")
        new_lines = lines[:block_end_index] + block_rules + lines[block_end_index:]
        logging.info("Agregadas %d nuevas IPs a la sección existente: %s", len(new_ips), start_marker)
    else:
        # Crear la sección completa si no existe
        block_rules = [
            start_marker + "\n",
            "<RequireAll>\n",
            "    Require all granted\n"
        ]
        for ip in new_ips:
            block_rules.append(f"    Require not ip {ip}\n")
        block_rules.extend([
            "</RequireAll>\n",
            end_marker + "\n"
        ])
        new_lines = lines + ["\n"] + block_rules
        logging.info("Creada nueva sección %s con %d IPs", start_marker, len(new_ips))

    try:
        with open(HTACCESS_FILE, 'w') as f:
            f.writelines(new_lines)
        logging.info("Archivo %s actualizado correctamente.", HTACCESS_FILE)
    except Exception as e:
        logging.error("Error al escribir en %s: %s", HTACCESS_FILE, e)

### Funcionalidad de Bloqueo Temporal ###

def load_temp_blocks(file_path=TEMP_BLOCK_FILE):
    """
    Carga el archivo JSON que contiene los bloqueos temporales.
    """
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                blocks = json.load(f)
        except Exception as e:
            logging.error("Error al leer el archivo de bloqueos temporales: %s", e)
            blocks = {}
    else:
        blocks = {}
    return blocks

def save_temp_blocks(blocks, file_path=TEMP_BLOCK_FILE):
    """
    Guarda la información de bloqueos temporales en un archivo JSON.
    """
    try:
        with open(file_path, 'w') as f:
            json.dump(blocks, f)
    except Exception as e:
        logging.error("Error al guardar bloqueos temporales: %s", e)

def temporary_blocking(ip_counts):
    """
    Revisa las IPs en ip_counts y, si superan el umbral, las añade a la lista de bloqueos temporales.
    Además, elimina los bloqueos expirados.
    """
    temp_blocks = load_temp_blocks()
    now = time.time()

    # Eliminar bloqueos expirados
    expired_ips = [ip for ip, exp in temp_blocks.items() if exp < now]
    for ip in expired_ips:
        logging.info("El bloqueo temporal para %s ha expirado.", ip)
        del temp_blocks[ip]

    # Agregar nuevos bloqueos temporales
    for ip, count in ip_counts.items():
        if count >= TEMP_BLOCK_THRESHOLD:
            if ip not in temp_blocks:
                expiration = now + TEMP_BLOCK_DURATION
                temp_blocks[ip] = expiration
                logging.info("La IP %s supera el umbral (%d) y se bloquea temporalmente hasta %s.",
                             ip, TEMP_BLOCK_THRESHOLD, time.ctime(expiration))

    save_temp_blocks(temp_blocks)
    return list(temp_blocks.keys())

def temporary_block_htaccess(temp_block_ips):
    """
    Actualiza el htaccess con la sección de bloqueos temporales.
    """
    section_marker = ("# BEGIN Temporary Blocked IPs", "# END Temporary Blocked IPs")
    backup_file(HTACCESS_FILE, suffix=".backup_temp")
    update_htaccess(temp_block_ips, section_marker)

def temporary_block():
    """
    Procesa el archivo de log para identificar IPs que superan el umbral y se bloquean temporalmente.
    """
    logging.info("Iniciando bloqueo temporal...")
    if not os.path.exists(ACCESS_LOG):
        logging.error("No se encontró el archivo de log: %s", ACCESS_LOG)
        return

    try:
        with open(ACCESS_LOG, 'r') as f:
            lines = f.readlines()
    except Exception as e:
        logging.error("Error al leer el archivo de log: %s", e)
        return

    # Contar ocurrencias de cada IP
    ip_counts = {}
    for line in lines:
        tokens = line.split()
        if tokens:
            ip = tokens[0]
            try:
                ipaddress.IPv4Address(ip)
                ip_counts[ip] = ip_counts.get(ip, 0) + 1
            except ipaddress.AddressValueError:
                continue

    temp_block_ips = temporary_blocking(ip_counts)
    logging.info("IPs bloqueadas temporalmente: %s", temp_block_ips)
    temporary_block_htaccess(temp_block_ips)

### Funciones existentes de bloqueo por país y por User Agent (como ejemplo) ###

def country_based_block():
    """
    Procesa el archivo de log para bloquear IPs basadas en el país (según la base de datos local).
    """
    logging.info("Iniciando bloqueo por país...")
    country_db = load_local_country_db()
    if not country_db:
        logging.error("La base de datos de países está vacía. Abortando el bloqueo por país.")
        return

    if not os.path.exists(ACCESS_LOG):
        logging.error("No se encontró el archivo de log: %s", ACCESS_LOG)
        return

    try:
        with open(ACCESS_LOG, 'r') as f:
            lines = f.readlines()
    except Exception as e:
        logging.error("Error al leer el archivo de log: %s", e)
        return

    ip_counts = {}
    for line in lines:
        tokens = line.split()
        if tokens:
            ip = tokens[0]
            try:
                ipaddress.IPv4Address(ip)
                ip_counts[ip] = ip_counts.get(ip, 0) + 1
            except ipaddress.AddressValueError:
                continue

    blacklisted_ips = {}
    for ip, count in ip_counts.items():
        country = get_country(ip, country_db)
        if country in NON_DESIRED_COUNTRIES:
            blacklisted_ips[ip] = count

    logging.info("IPs bloqueadas por país: %s", blacklisted_ips)
    backup_file(HTACCESS_FILE, suffix=".backup_country")
    update_htaccess(blacklisted_ips.keys(), ("# BEGIN Blocked IPs by Country", "# END Blocked IPs by Country"))

def user_agent_based_block():
    """
    Procesa el archivo de log para bloquear IPs basadas en un user agent inexistente ("-").
    """
    logging.info("Iniciando bloqueo por User Agent...")
    if not os.path.exists(ACCESS_LOG):
        logging.error("No se encontró el archivo de log: %s", ACCESS_LOG)
        return

    try:
        with open(ACCESS_LOG, 'r') as f:
            lines = f.readlines()
    except Exception as e:
        logging.error("Error al leer el archivo de log: %s", e)
        return

    blacklisted_ips = set()
    for line in lines:
        parts = line.split('"')
        if len(parts) >= 6:
            user_agent = parts[5].strip()
            if user_agent == "-":
                ip = line.split()[0]
                try:
                    ipaddress.IPv4Address(ip)
                    blacklisted_ips.add(ip)
                except ipaddress.AddressValueError:
                    continue

    logging.info("IPs bloqueadas por user agent: %s", sorted(blacklisted_ips))
    backup_file(HTACCESS_FILE, suffix=".backup_user_agent")
    update_htaccess(blacklisted_ips, ("# BEGIN Blocked IPs by User Agent", "# END Blocked IPs by User Agent"))

### Función principal ###

def main():
    logging.info("Iniciando el proceso de bloqueo de IP en entorno local.")
    country_based_block()
    user_agent_based_block()
    temporary_block()
    logging.info("Proceso de bloqueo completado.")

if __name__ == "__main__":
    main()
