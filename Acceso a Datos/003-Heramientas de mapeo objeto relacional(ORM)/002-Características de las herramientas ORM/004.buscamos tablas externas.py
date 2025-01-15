import mysql.connector

# Definimos la clase Producto que tendrá los atributos correspondientes.
class Producto:
    def __init__(self):
        self.nombre = None
        self.descripcion = None
        self.precio = None
        self.categorias = None

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

productos = []
peticion = "SELECT * FROM "+clase
cursor.execute(peticion)
filas = cursor.fetchall()
for fila in filas:
    producto = Producto()
    for clave, valor in fila.items():
        setattr(producto,clave,valor)
    productos.append(producto)
    ### ahora buscamos si hay tablas externa
    for clave, valor in vars(producto).items():
        if valor == None:
            print("hay una tabla externa en :",clave)

print(vars(productos[0]))
personas = []
conexion.commit()