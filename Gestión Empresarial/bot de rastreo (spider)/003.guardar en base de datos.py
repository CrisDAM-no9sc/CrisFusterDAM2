# -*- coding: utf-8 -*-
"""
Ejemplo de extracción y guardado de información en una base de datos SQLite.
"""

import requests
from bs4 import BeautifulSoup
import sqlite3

# Nombre del archivo de la base de datos (se creará si no existe)
DATABASE_NAME = 'enlaces.db'


########################################## CREAR TABLA ENLACES  ############################
def crear_tabla_enlaces(conn):

    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS enlaces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            target TEXT
        )
    ''')
    conn.commit()

################################ INSERTAR REGISTRO ##########################
def guardar_enlace(conn, url, target):

    cursor = conn.cursor()
    cursor.execute('INSERT INTO enlaces (url, target) VALUES (?, ?)', (url, target))
    conn.commit()

def main():
    # Conexión a la base de datos
    conn = sqlite3.connect(DATABASE_NAME)
    crear_tabla_enlaces(conn)
    
    # URL del sitio que deseas analizar
    url = 'https://www.paginasamarillas.es/search/informatica/all-ma/valencia/all-is/valencia/all-ba/all-pu/all-nc/1?what=informatica&where=Valencia'
    
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        enlaces_web = soup.find_all('a', class_='web')

        # Recorremos cada enlace y guardamos en base de datos
        for enlace in enlaces_web:
            enlace_href = enlace.get('href')
            enlace_target = enlace.get('target')
            
            # Guardamos en la base de datos
            guardar_enlace(conn, enlace_href, enlace_target)
        
        print("Datos guardados en la base de datos 'enlaces.db'.")
    else:
        print(f"No se pudo obtener la página. Código de estado: {response.status_code}")
    
    # Cerramos la conexión
    conn.close()

if __name__ == "__main__":
    main()
