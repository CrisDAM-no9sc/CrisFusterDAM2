import sqlite3
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin
import time

# Nombre del archivo de base de datos
BASE_DE_DATOS = 'targets.db'

# Expresión regular para detectar correos electrónicos
REGEX_CORREO = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'

# Número máximo de páginas internas a rastrear por cada sitio
PAGINAS_MAXIMAS_POR_SITIO = 20

def crear_tabla_emails(conexion):

    cursor = conexion.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS emails (
            url TEXT,
            email TEXT
        )
    ''')
    conexion.commit()
    print("Se ha creado o verificado la tabla 'emails' en la base de datos.")

####################################### FUNCION EXTRAER CORREOS #################################
### expresión regular REGEX_CORREO, que busca patrones de correo en el texto completo
### Devuelve un conjunto (set) de correos únicos.

def extraer_correos_de_pagina(url, sopa):

    correos = set(re.findall(REGEX_CORREO, sopa.get_text()))
    print(f"Se han encontrado {len(correos)} correo(s) en {url}")
    return correos

################################### FUNCION PARA RASTREAR ########################################
### Utiliza dos estructuras principales: visitados (url ya visitadas) por_visitar (lista URL pendientes)
### solo añade los enlaces que empiecen por la misma URL inicial

def rastrear_sitio(url_inicial, conexion):
    visitados = set()
    por_visitar = [url_inicial]
    contador_paginas = 0  # Lleva el recuento de páginas visitadas

    print(f"\nIniciando rastreo del sitio: {url_inicial}")

    while por_visitar and contador_paginas < PAGINAS_MAXIMAS_POR_SITIO:
        url_actual = por_visitar.pop(0)

        # Saltamos si ya se ha visitado esta URL
        if url_actual in visitados:
            print(f"Saltando página ya visitada: {url_actual}")
            continue

        print(f"\nVisitando página número {contador_paginas + 1}: {url_actual}")

        try:
            # Hacemos la petición GET a la URL
            respuesta = requests.get(url_actual)
            # Si la respuesta no es exitosa, se genera una excepción
            respuesta.raise_for_status()

            # Analizamos el HTML con BeautifulSoup
            sopa = BeautifulSoup(respuesta.text, 'html.parser')

            # Extraemos los correos electrónicos de esta página
            correos = extraer_correos_de_pagina(url_actual, sopa)
            guardar_correos_en_bd(conexion, url_actual, correos)

            # Buscamos todos los enlaces <a> y construimos su URL absoluta
            for enlace in sopa.find_all('a', href=True):
                url_completa = urljoin(url_actual, enlace['href'])
                # Añadimos la nueva URL si pertenece al mismo dominio (empieza igual que url_inicial)
                # y si aún no ha sido visitada
                if url_completa.startswith(url_inicial) and url_completa not in visitados:
                    por_visitar.append(url_completa)
                    print(f"Se ha añadido una nueva página a rastrear: {url_completa}")

            # Marcamos la URL actual como visitada
            visitados.add(url_actual)
            contador_paginas += 1

            # Esperamos unos segundos antes de la siguiente petición para evitar saturar el sitio
            print("Esperando 1 segundo antes de la siguiente petición...")
            time.sleep(5)  # Aquí son 5 segundos en vez de 1 (se puede ajustar)

        except requests.RequestException as e:
            print(f"No se ha podido acceder a {url_actual}: {e}")

    print(f"\nFinalizado el rastreo de {url_inicial}. Se han visitado {contador_paginas} páginas.")

###################### GUARDAR CORREOS ELECTRONICOS EN BASE DE DATOS ###############################
## guarda correos extraidos en la tabla 
## cada registro tendra url origen y correo localizado

def guardar_correos_en_bd(conexion, url, lista_correos):

    cursor = conexion.cursor()
    for correo in lista_correos:
        cursor.execute('INSERT INTO emails (url, email) VALUES (?, ?)', (url, correo))
    conexion.commit()
    print(f"Se han guardado {len(lista_correos)} correo(s) de {url} en la base de datos.")

def main():
    # Conectamos a la base de datos (o la creamos si no existe)
    conexion = sqlite3.connect(BASE_DE_DATOS)
    crear_tabla_emails(conexion)

    # Leemos las URLs de la tabla 'target_attributes'
    cursor = conexion.cursor()
    cursor.execute('SELECT target FROM target_attributes')
    urls = [fila[0] for fila in cursor.fetchall()]

    print(f"Se han encontrado {len(urls)} URLs en la base de datos para rastrear.")

    # Para cada URL en la lista, rastreamos el sitio y extraemos los correos electrónicos
    for url in urls:
        rastrear_sitio(url, conexion)

    # Cerramos la conexión a la base de datos
    conexion.close()
    print("\nConexión a la base de datos cerrada. Rastreos finalizados.")

if __name__ == "__main__":
    main()
