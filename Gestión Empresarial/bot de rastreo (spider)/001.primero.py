
"""
Ejemplo simple de extracción de información (web scraping) usando requests y BeautifulSoup.
En este ejemplo, se obtienen los atributos "target" de los enlaces (<a>) que tengan la clase "web".
"""

import requests
from bs4 import BeautifulSoup

# URL del sitio que deseas analizar
url = 'https://www.paginasamarillas.es/search/informatica/all-ma/valencia/all-is/valencia/all-ba/all-pu/all-nc/1?what=informatica&where=Valencia'

# Realizamos la petición HTTP al servidor
response = requests.get(url)

# Comprobamos si la petición tuvo éxito (código 200)
if response.status_code == 200:
    # Convertimos el contenido de la respuesta en un objeto BeautifulSoup para poder analizarlo
    soup = BeautifulSoup(response.content, 'html.parser')

    # Buscamos todos los enlaces (<a>) que tengan la clase 'web'
    enlaces_web = soup.find_all('a', class_='web')
    
    # De cada enlace, extraemos el atributo "target" (si lo tiene)
    targets = [enlace.get('target') for enlace in enlaces_web]
    
    # Mostramos los valores de 'target' encontrados
    print("Valores del atributo 'target' en los enlaces con clase 'web':")
    for target in targets:
        print(target)
else:
    print(f"No se pudo obtener la página. Código de estado: {response.status_code}")
