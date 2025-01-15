import mysql.connector

# Definimos la clase Producto que tendrá los atributos correspondientes.
class Producto:
    def __init__(self):
        self.nombre = None
        self.descripcion = None
        self.precio = None
        self.categorias = []

# Nombre de la clase para crear la tabla
clase = "Producto"

# Establecemos la conexión a la base de datos MySQL
conexion = mysql.connector.connect(
    host='localhost',
    database='accesoadatos',
    user='crismon1',
    password='crismon1'
)

cursor = conexion.cursor(dictionary=True)

productos = []

# Realizamos una consulta con JOIN para obtener productos y categorías
peticion = """
SELECT p.Identificador, p.nombre, p.descripcion, p.precio, c.categorias
FROM Producto p
LEFT JOIN categorias c ON p.Identificador = c.FK
"""
cursor.execute(peticion)
filas = cursor.fetchall()

# Creamos los objetos Producto y asignamos las categorías correctamente
producto_actual = None
for fila in filas:
    if producto_actual is None or producto_actual.Identificador != fila['Identificador']:
        # Creamos un nuevo producto
        producto_actual = Producto()
        producto_actual.Identificador = fila['Identificador']
        producto_actual.nombre = fila['nombre']
        producto_actual.descripcion = fila['descripcion']
        producto_actual.precio = fila['precio']
        productos.append(producto_actual)
    
    # Añadimos la categoría a la lista de categorías del producto
    if fila['categorias'] is not None:
        producto_actual.categorias.append(fila['categorias'])

# Imprimimos el resultado
for producto in productos:
    print(vars(producto))

conexion.commit()
