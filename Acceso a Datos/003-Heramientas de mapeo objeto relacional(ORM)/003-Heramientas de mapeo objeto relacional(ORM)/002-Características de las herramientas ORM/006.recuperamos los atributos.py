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
    database='accesoadatos',  
    user='crismon1',
    password='crismon1'
)

cursor = conexion.cursor(dictionary=True)


##################################### CREO UNA LISTA DE PRODUCTOS DE LA BASE DE DATOS

productos = []                                                                                     

peticion = "SELECT * FROM "+clase                                                               
cursor.execute(peticion)                                                                          

filas = cursor.fetchall()                                                                         
for fila in filas:                                                                                
    producto = Producto()                                                                           
    for clave, valor in fila.items():                                                              
        setattr(producto, clave, valor)                                                             

    # Ahora busco si hay tablas externas
    for clave, valor in vars(producto).items():                                                    
        if valor == None:                                                                           
            setattr(producto, clave, [])                                                           
            print("parece que hay una tabla externa en :",clave)                        
            peticion2 = "SELECT "+clave+" FROM "+clave+" WHERE FK = "+str(producto.Identificador)  
            cursor.execute(peticion2)                                                               
            filas2 = cursor.fetchall()                                                           
            for fila2 in filas2:                                                                   
                print(fila2)                                                                      
                # append to property here as a list
                getattr(producto, clave).append(fila2[clave])                                     
    productos.append(producto)                                                                     

print(vars(productos[0]))
personas=[]
conexion.commit()