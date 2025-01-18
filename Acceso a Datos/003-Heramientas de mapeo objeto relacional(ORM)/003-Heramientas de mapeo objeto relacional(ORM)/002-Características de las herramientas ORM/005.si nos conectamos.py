import mysql.connector

# Definimos la clase Producto que tendrá los atributos correspondientes.
class Producto:
    def __init__(self):
        self.nombre = None
        self.descripcion = None
        self.precio = None
        self.categorias =  None

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
peticion = "SLEECT * FROM"+clase
cursor.execute(peticion)
filas = cursor.fetchall()

for fila in filas:
    producto = Producto()
    for clave, valor in fila.items():
        if valor == None:
            print("parece que hay una clave externa",clave)
            peticion2 = "SELECT "+clave+" FROM "+clave+ "WHERE FK = "+str(producto.Identificador)
            cursor.execute(peticion2)
            filas2= cursor.fetchall()
            for fila2 in fila2:
                print(fila2)

print(vars(producto[0]))
personas = []
conexion.commit()