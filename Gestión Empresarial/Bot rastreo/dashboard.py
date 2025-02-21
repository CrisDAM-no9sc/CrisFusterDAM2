from flask import Flask, render_template
import sqlite3
import os
import matplotlib.pyplot as plt

app = Flask(__name__)

# Verificar que la carpeta 'static' exista, si no, crearla
if not os.path.exists('static'):
    os.makedirs('static')

# Obtener estadísticas de la base de datos
def obtener_estadisticas():
    conexion = sqlite3.connect('libros.db')
    cursor = conexion.cursor()

    cursor.execute("SELECT COUNT(*) FROM libros")
    total_libros = cursor.fetchone()[0]

    cursor.execute("SELECT titulo, COUNT(*) FROM libros GROUP BY titulo HAVING COUNT(*) > 1")
    duplicados = len(cursor.fetchall())

    # Ruta absoluta para evitar errores al guardar la imagen
    static_folder = os.path.join(app.root_path, 'static')
    if not os.path.exists(static_folder):
        os.makedirs(static_folder)

    graph_path = os.path.join(static_folder, 'grafico_libros.png')

    # Generar gráfico
    labels = ['Libros Únicos', 'Duplicados']
    valores = [total_libros, duplicados]

    plt.figure(figsize=(6, 4))
    plt.bar(labels, valores, color=['#4CAF50', '#FF5733'])
    plt.title('Estadísticas de Libros')
    plt.savefig(graph_path)
    plt.close()

    conexion.close()
    return total_libros, duplicados

@app.route('/')
def index():
    total_libros, duplicados = obtener_estadisticas()
    return render_template('dashboard.html', total=total_libros, duplicados=duplicados)

if __name__ == "__main__":
    app.run(debug=True)
