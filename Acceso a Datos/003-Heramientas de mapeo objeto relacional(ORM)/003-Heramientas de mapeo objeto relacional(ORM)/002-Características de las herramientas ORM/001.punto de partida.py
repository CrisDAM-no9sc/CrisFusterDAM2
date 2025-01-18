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

cursor = conexion.cursor()

# Creamos una lista de productos para agregar a la base de datos
productos = []
productos.append(Producto("Mochila", "Mochila resistente con múltiples compartimentos", 45.99, ['accesorio', 'unisex']))
productos.append(Producto("Silla de Oficina", "Silla ergonómica con respaldo ajustable", 150.00, ['mobiliario', 'oficina']))
productos.append(Producto("Lámpara LED", "Lámpara de escritorio con luz regulable", 25.50, ['iluminación', 'oficina']))

# Borramos la tabla si ya existe
peticion = "DROP TABLE IF EXISTS " + clase
cursor.execute(peticion)

# Construcción dinámica de la creación de la tabla
peticion = "CREATE TABLE IF NOT EXISTS " + clase + " (" \
           "Identificador INT NOT NULL AUTO_INCREMENT,"  # Preparamos el principio de la consulta

# Obtenemos los atributos de la clase Producto para la creación de columnas
atributos = [attr for attr in dir(productos[0]) if not callable(getattr(productos[0], attr)) and not attr.startswith("__")]

# Añadimos los atributos a la consulta de creación de tabla
for atributo in atributos:
    if not isinstance(getattr(productos[0], atributo), list):
        peticion += atributo + " VARCHAR(255) NOT NULL ,"  # Para los atributos no listados
    else:
        # Si el atributo es una lista (como 'categorias'), lo tratamos por separado
        # Eliminamos la tabla anterior si existe
        peticion2 = "DROP TABLE IF EXISTS " + atributo  
        cursor.execute(peticion2)
        peticion2 = "CREATE TABLE IF NOT EXISTS " + atributo + " (" \
                    "Identificador INT NOT NULL AUTO_INCREMENT, FK INT(255), " + atributo + " VARCHAR(255), PRIMARY KEY (Identificador))"
        cursor.execute(peticion2)

# Cerramos la creación de la tabla
peticion += " PRIMARY KEY (Identificador))"
# Ejecutamos la consulta para crear la tabla
cursor.execute(peticion)  

# Inserción dinámica de registros
for indice, producto in enumerate(productos):
    # Empezamos a preparar el INSERT
    peticion = "INSERT INTO " + clase + " VALUES(NULL,"  

    for atributo in atributos:
        if not isinstance(getattr(producto, atributo), list):
            # Añadimos los atributos no listados
            peticion += "'" + str(getattr(producto, atributo)) + "',"  
        else:
            # Para los atributos de tipo lista (como 'categorias'), realizamos inserciones en tablas relacionadas
            for elemento in getattr(producto, atributo):
                peticion2 = "INSERT INTO " + atributo + " VALUES(NULL," + str(indice + 1) + ",'" + str(elemento) + "')"
                # Insertamos los elementos de la lista en su respectiva tabla
                cursor.execute(peticion2)  
    # Quitamos la última coma
    peticion = peticion[:-1] 
    # Cerramos el INSERT
    peticion += ");"  
    # Ejecutamos la consulta de inserción
    cursor.execute(peticion)  

# Confirmamos los cambios realizados en la base de datos
conexion.commit()
