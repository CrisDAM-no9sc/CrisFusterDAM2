import requests
from bs4 import BeautifulSoup
import sqlite3

def conectar_base_datos():
    conexion = sqlite3.connect('libros.db')
    cursor = conexion.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS libros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT UNIQUE,
            precio TEXT,
            disponibilidad TEXT
        )
    ''')
    conexion.commit()
    return conexion

def insertar_libro(conexion, titulo, precio, disponibilidad):
    cursor = conexion.cursor()
    try:
        cursor.execute('INSERT INTO libros (titulo, precio, disponibilidad) VALUES (?, ?, ?)',
                       (titulo, precio, disponibilidad))
        conexion.commit()
        print(f"Insertado: {titulo}")
    except sqlite3.IntegrityError:
        print(f"Duplicado encontrado: {titulo}")

def extraer_libros(conexion):
    url = "http://books.toscrape.com/"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        libros = soup.find_all('article', class_='product_pod')

        for libro in libros:
            titulo = libro.h3.a['title']
            precio = libro.find('p', class_='price_color').text
            disponibilidad = libro.find('p', class_='instock availability').text.strip()
            insertar_libro(conexion, titulo, precio, disponibilidad)
    else:
        print(f"Error al acceder a la página: {response.status_code}")

def eliminar_duplicados(conexion):
    cursor = conexion.cursor()
    cursor.execute('''
        DELETE FROM libros
        WHERE id NOT IN (
            SELECT MIN(id)
            FROM libros
            GROUP BY titulo
        )
    ''')
    conexion.commit()

def main():
    conexion = conectar_base_datos()
    extraer_libros(conexion)
    eliminar_duplicados(conexion)
    conexion.close()
    print("Proceso completado correctamente.")

if __name__ == "__main__":
    main()
