import sqlite3
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin
import time  # Para hacer pausas entre cada petición

# Nombre del archivo de la base de datos
BASE_DATOS = 'targets.db'

# Expresión regular para buscar direcciones de correo
REGEX_EMAIL = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'


############################### CREAR TABLA EMAIL CON DOS COLUMNAS (url, email) ########################

def crear_tabla_emails(conexion):
    cursor = conexion.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS emails (
            url TEXT,
            email TEXT
        )
    ''')
    conexion.commit()

############################ BUSCAMOS EN EL TEXTO DE LA PAGINA LOSPATRONES QUE COINCIDAN ######################

## Extrae todas las direcciones de correo de la página actual.
## Utiliza la expresión regular REGEX_EMAIL para buscar en el texto completo.
## Devuelve un conjunto (set) de correos sin duplicados.

def extraer_emails_de_pagina(url, sopa):

    correos = set(re.findall(REGEX_EMAIL, sopa.get_text()))
    return correos

################################### FUNCION PARA RASTREAR ########################################
## extrae los correos electrónicos.
## utilizamos una lsita de enlaces por visita para evitar procesar la misma URL dos veces

def rastrear_sitio(url_inicial, conexion):

    visitados = set()
    por_visitar = [url_inicial]

    while por_visitar:
        url_actual = por_visitar.pop(0)
        # Si la URL actual ya fue visitada, pasamos a la siguiente
        if url_actual in visitados:
            continue
        try:
            # Petición HTTP a la URL
            respuesta = requests.get(url_actual)
            respuesta.raise_for_status()
            
            # Analizamos el HTML con BeautifulSoup
            sopa = BeautifulSoup(respuesta.text, 'html.parser')

            # Extraemos los correos encontrados en esta página
            correos_encontrados = extraer_emails_de_pagina(url_actual, sopa)
            guardar_correos_en_bd(conexion, url_actual, correos_encontrados)

            # Buscamos todos los enlaces <a> de la página
            # y si pertenecen al mismo dominio inicial, los añadimos a la lista por visitar
            for enlace in sopa.find_all('a', href=True):
                url_completa = urljoin(url_actual, enlace['href'])
                if url_completa.startswith(url_inicial) and url_completa not in visitados:
                    por_visitar.append(url_completa)

            # Marcamos esta URL como visitada
            visitados.add(url_actual)

            # Hacemos una pausa de 1 segundo para no saturar el servidor
            time.sleep(1)

        except requests.RequestException as e:
            print(f"No se pudo acceder a {url_actual}: {e}")


###################### GUARDAR CORREOS ELECTRONICOS EN BASE DE DATOS ###############################
### Cada registro contiene la URL de origen y la dirección de correo.

def guardar_correos_en_bd(conexion, url, lista_correos):

    cursor = conexion.cursor()
    for correo in lista_correos:
        cursor.execute(
            'INSERT INTO emails (url, email) VALUES (?, ?)',
            (url, correo)
        )
    conexion.commit()

def main():
    # Conectamos (o creamos si no existe) la base de datos
    conexion = sqlite3.connect(BASE_DATOS)
    crear_tabla_emails(conexion)

    # Obtenemos las URLs de la tabla 'target_attributes'
    cursor = conexion.cursor()
    cursor.execute('SELECT target FROM target_attributes')
    urls = [fila[0] for fila in cursor.fetchall()]

    # Para cada URL obtenida, rastreamos el sitio y extraemos correos
    for url in urls:
        rastrear_sitio(url, conexion)

    # Cerramos la conexión con la base de datos
    conexion.close()

if __name__ == "__main__":
    main()
