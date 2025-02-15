
"""
Ejemplo de extracción y guardado de información en un archivo CSV.
"""

import requests
from bs4 import BeautifulSoup
import csv

# URL del sitio que deseas analizar
url = 'https://www.paginasamarillas.es/search/informatica/all-ma/valencia/all-is/valencia/all-ba/all-pu/all-nc/1?what=informatica&where=Valencia'

response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    enlaces_web = soup.find_all('a', class_='web')

    # Extraemos la URL del enlace (href) y el target para ver ejemplos
    resultados = []
    for enlace in enlaces_web:
        enlace_href = enlace.get('href')
        enlace_target = enlace.get('target')
        
        # Guardamos los resultados en una lista de tuplas o diccionarios
        resultados.append({
            'href': enlace_href,
            'target': enlace_target
        })
    
    # Guardamos los resultados en un archivo CSV
    with open('resultado_enlaces.csv', mode='w', newline='', encoding='utf-8') as archivo_csv:
        campos = ['href', 'target']
        writer = csv.DictWriter(archivo_csv, fieldnames=campos)
        
        # Escribimos la cabecera del CSV
        writer.writeheader()
        
        # Escribimos cada fila con la información
        for item in resultados:
            writer.writerow(item)
    
    print("Enlaces guardados en 'resultado_enlaces.csv'.")
else:
    print(f"No se pudo obtener la página. Código de estado: {response.status_code}")
