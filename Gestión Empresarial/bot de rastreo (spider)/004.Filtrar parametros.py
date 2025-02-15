import requests
from bs4 import BeautifulSoup
import sqlite3
from urllib.parse import urlparse, urlunparse


################################## RECIBIR URL SIN PARAMETROS DE CONULTA #############################
## Utiliza las funciones de 'urlparse' y 'urlunparse' para analizar y recomponer la URL.

def limpiar_parametros_url(url):
    # Descomponemos la URL en sus partes (esquema, dominio, ruta, etc.)
    partes_url = urlparse(url)
    # Reconstruimos la URL sin los parámetros de consulta (query)
    url_limpia = urlunparse((partes_url.scheme, partes_url.netloc, partes_url.path, '', '', ''))
    return url_limpia

# URL de la página que queremos analizar
url = 'https://www.paginasamarillas.es/search/informatica/all-ma/valencia/all-is/valencia/all-ba/all-pu/all-nc/1?what=informatica&where=Valencia'

# Definimos cabeceras para simular un navegador Chrome en Windows
cabeceras = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
}

# Enviamos una petición GET a la URL usando las cabeceras personalizadas
respuesta = requests.get(url, headers=cabeceras)

# Verificamos si la respuesta ha sido exitosa (código 200)
if respuesta.status_code == 200:
    # Analizamos el contenido HTML con BeautifulSoup
    sopa = BeautifulSoup(respuesta.content, 'html.parser')
    
    # Buscamos todas las etiquetas <a> que tengan la clase "web"
    etiquetas_a = sopa.find_all('a', class_='web')
    
    # Extraemos el atributo "href" de cada etiqueta <a> encontrada
    objetivos = [etiqueta.get('href') for etiqueta in etiquetas_a]
    
    # Conectamos a la base de datos SQLite (o la creamos si no existe)
    conexion = sqlite3.connect('targets.db')
    cursor = conexion.cursor()
    
    # Creamos la tabla 'target_attributes' si no existe
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS target_attributes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target TEXT NOT NULL
        )
    ''')
    
    # Recorremos cada enlace obtenido, le quitamos los parámetros y lo insertamos en la tabla
    for objetivo in objetivos:
        url_sin_parametros = limpiar_parametros_url(objetivo)
        cursor.execute('INSERT INTO target_attributes (target) VALUES (?)', (url_sin_parametros,))
    
    # Guardamos los cambios y cerramos la conexión a la base de datos
    conexion.commit()
    conexion.close()
    
    print(f"Se han guardado correctamente {len(objetivos)} enlaces en la base de datos (sin parámetros).")
else:
    print(f"No se pudo obtener la página. Código de estado: {respuesta.status_code}")
