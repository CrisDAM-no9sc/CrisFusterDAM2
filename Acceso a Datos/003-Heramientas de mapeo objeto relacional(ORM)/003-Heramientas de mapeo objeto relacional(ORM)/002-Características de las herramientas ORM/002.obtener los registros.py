import mysql.connector

# Definimos la clase Producto que tendrá los atributos correspondientes.
class Producto:
    def __init__(self, nuevonombre, nuevadescripcion, nuevoprecio, nuevascategorias):
        self.nombre = nuevonombre
        self.descripcion = nuevadescripcion
        self.precio = nuevoprecio
        self.categorias = nuevascategorias

# Nombre de la clase para crear la tabla
clase = "Producto"

# Establecemos la conexión a la base de datos MySQL
conexion = mysql.connector.connect(
    host='localhost',
    database='accesoadatos',  # Corregido el error de nombre de base de datos
    user='crismon1',
    password='crismon1'
)

cursor = conexion.cursor(dictionary=True)

##################################### CREO UNA LISTA DE PRODUCTOS DE LA BASE DE DATOS

peticion = "SELECT * FROM "+clase
cursor.execute(peticion)

filas = cursor.fetchall()
for fila in filas:
    print(fila)

personas = []
conexion.commit() 