
import matplotlib
matplotlib.use('Agg')

import sqlite3
from openpyxl import Workbook

# Exportar datos a un archivo Excel
def exportar_a_excel():
    conexion = sqlite3.connect('libros.db')
    cursor = conexion.cursor()
    cursor.execute('SELECT titulo, precio, disponibilidad FROM libros')
    registros = cursor.fetchall()

    wb = Workbook()
    ws = wb.active
    ws.title = "Libros"

    # Encabezado
    ws.append(["ID", "Título", "Precio", "Disponibilidad"])

    for idx, row in enumerate(registros, 1):
        ws.append([idx, row[0], row[1], row[2]])

    wb.save("reporte_libros.xlsx")
    print("Reporte generado exitosamente en Excel.")

if __name__ == "__main__":
    exportar_a_excel()