import requests
from bs4 import BeautifulSoup
import sqlite3
from urllib.parse import urlparse, urlunparse
import time
import random


################################## RECIBIR URL SIN PARAMETROS DE CONULTA #############################

def limpiar_parametros_url(url):
    # Analizamos la URL en partes (esquema, dominio, ruta, etc.)
    partes = urlparse(url)
    # Reconstruimos la URL sin la parte de query (parámetros)
    url_limpia = urlunparse((partes.scheme, partes.netloc, partes.path, '', '', ''))
    return url_limpia

## Lista de criterios de búsqueda a utilizar en Páginas Amarillas
## cada uno se usara para armar la url de la pagina a consultar (paginas amarillas)
criterios = [
    'web',
    'diseño-web',
    'programacion',
    'html',
    'informática',
    'ordenadores',
    'marketing',
    'aplicaciones',
    'informatico',
    'aplicaciones',
    'desarrollo',
    'soporte-informatico'
]

# Recorremos cada criterio de búsqueda
for criterio in criterios:
    pagina = 1
    # Repetimos hasta 5 páginas por cada criterio (puedes ajustar este valor)
    while pagina < 5:
        
        # Construimos la URL en base al criterio y el número de página
        url = (
            'https://www.paginasamarillas.es/search/'
            + criterio
            + '/all-ma/valencia/all-is/valencia/all-ba/all-pu/all-nc/'
            + str(pagina)
            + '?what=' + criterio
            + '&where=Valencia'
        )

        # Definimos cabeceras para simular un navegador Chrome en Windows
        cabeceras = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                          'AppleWebKit/537.36 (KHTML, like Gecko) '
                          'Chrome/118.0.0.0 Safari/537.36'
        }

        # Realizamos la petición GET con las cabeceras personalizadas
        respuesta = requests.get(url, headers=cabeceras)

        # Comprobamos si la respuesta ha sido exitosa
        if respuesta.status_code == 200:
            # Analizamos el contenido HTML con BeautifulSoup
            sopa = BeautifulSoup(respuesta.content, 'html.parser')
            
            # Buscamos todas las etiquetas <a> con la clase "web"
            enlaces_web = sopa.find_all('a', class_='web')
            
            # Extraemos la URL (atributo 'href') de cada enlace
            objetivos = [enlace.get('href') for enlace in enlaces_web]
            
            # Conectamos (o creamos) la base de datos SQLite
            conexion = sqlite3.connect('targets.db')
            cursor = conexion.cursor()
            
            # Creamos la tabla si no existe
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS target_attributes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    target TEXT NOT NULL
                )
            ''')
            
            # Insertamos cada enlace en la tabla, limpiando los parámetros de cada URL
            for obj in objetivos:
                url_sin_parametros = limpiar_parametros_url(obj)
                cursor.execute(
                    'INSERT INTO target_attributes (target) VALUES (?)',
                    (url_sin_parametros,)
                )
            
            # Guardamos los cambios y cerramos la conexión
            conexion.commit()
            conexion.close()
            
            print(f"Se han guardado correctamente {len(objetivos)} enlaces para el criterio '{criterio}' (página {pagina}).")
        
        else:
            print(f"No se pudo obtener la página. Código de estado: {respuesta.status_code}")
        
        # Hacemos una pausa aleatoria entre 2 y 5 segundos antes de la siguiente página
        time.sleep(random.randint(2, 5))
        
        # Pasamos a la siguiente página
        pagina += 1
