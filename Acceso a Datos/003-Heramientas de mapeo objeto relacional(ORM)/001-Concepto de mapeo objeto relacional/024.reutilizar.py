##vamos a relacionar el identificador de la tabla Persona con el de telefonos para saber a quien corresponde 
import mysql.connector
################## PREPARAMOS CREAMOS CLASE QUE VA A SER EL MODELO DE DATOS ############## 

# definimos la clase para representar a una persona 
#esto convierte cada persona en un objeto que encapsula su informacion 
class Producto:
    def __init__(self, nuevonombre, nuevadescripcion, nuevoprecio, nuevascategorias):
        # Inicializamos los atributos de la clase
        self.nombre = nuevonombre
        self.descripcion = nuevadescripcion
        self.precio = nuevoprecio
        self.categorias = nuevascategorias

clase = "Producto"

###################### PREPARAMOS LA CONEXION CON EL SERVIDOR ######################      
  
conexion = mysql.connector.connect(
    host='localhost',
    database = 'accesoadatos',
    user = 'crismon1',
    password ='crismon1'
)
cursor = conexion.cursor()

################## CREAMOS UNA LISTA DE PERSONAS  ########################### 
# Creamos una lista de personas
personas = []

# con el append lo que estamos haciendo es añadir el objeto eprosna a la lista recien creada de personas 
personas.append(Producto("camiseta","de lana con mangas largas, ideal para ir a la nieve",28.32,['Ropa','Invierno']))
personas.append(Producto("Bolso Nevera","Nevera con suficientes bosillos, y con una capacidad de 30 litros",60.28,['Complemento','Verano']))

################## BORRAMOS LA TABLA ANTERIOR  ########################### 

peticion = "DROP TABLE IF EXISTS "+clase
cursor.execute(peticion)

################## PREPARAMOS CREACIÓN DINAMICA DE LA TABLA  ########################### 
##si ya esta creada la tabla, le podemos poner para que no nos salga fallo IF NOT EXISTS
peticion = "CREATE TABLE IF NOT EXISTS "+clase+" (Identificador INT NOT NULL AUTO_INCREMENT,"
#extraemos los nombre de los atributos de la primera persona de la lista
atributos = [
    attr for attr in dir(personas[0])               # recorremos todos los nombres de atributos y métodos del objeto
    if not callable(getattr(personas[0], attr))     # filtramos los metodos y funciones 
    and not attr.startswith("__")                   #escluimos los elementos internos de python que comiencen por __
]

#para cada uno de los atributos 
for atributo in atributos:
    #si el atributo no es una lista se creara una columna en la tabla producto
    if not isinstance(getattr(personas[0], atributo), list):
        #lo encadenamos a la peticion
        # los atributos simples se añaden como columna de tipo varchar
        peticion += atributo+" VARCHAR(255) NOT NULL,"
    else:
        # Si es una lista se creara una tabla secundaria 
        peticion2 = "DROP TABLE IF EXISTS "+atributo+""
        cursor.execute(peticion2)
        ## le metemos FK porque la clave forania es FOREY KEY
        peticion2 = "CREATE TABLE IF NOT EXISTS "+atributo+" (Identificador INT NOT NULL AUTO_INCREMENT,FK INT(255),"+atributo+" VARCHAR(255),PRIMARY KEY (Identificador))"
        cursor.execute(peticion2)
        
#crerramos el parentesis de la peticion
peticion += "PRIMARY KEY (Identificador))"
print(peticion)
#creamos un cursor 
cursor = conexion.cursor()
#ejecutamos la peticion
cursor.execute(peticion)  

############## INSERCION DINAMICA DE REGISTROS EN LA TABLA DE LA BASE DE DATOS  ############### 
# para cada una de las personas hacemos un insert
for indice, persona in enumerate(personas):
    peticion = "INSERT INTO "+clase+" VALUES(NULL,"
    #y para cdaa uno de los atributos 
    for atributo in atributos:
        if not isinstance(getattr(persona, atributo), list):
            # Accedemos dinámicamente al valor de cada atributo de la persona.
            peticion += "'"+str(getattr(persona, atributo))+"',"
        else:
            # es cada categoría individual
            for elemento in getattr(persona, atributo):
                # el valor de indice+1 se utiliza para la clave foranea para asociar esta actegoria con el producto que tiene este identificador en la taba principal 
                peticion2 = "INSERT INTO "+atributo+" VALUES(NULL,"+str(indice+1)+",'"+str(elemento)+"')"
                cursor.execute(peticion2) 


    # Quitamos la última coma.
    peticion = peticion[:-1]  
    peticion += ");"
    # Debug para verificar la consulta.
    print("Consulta de inserción:", peticion)  
    
    # Ejecutamos la consulta de inserción para cada persona.
    cursor.execute(peticion)


 

conexion.commit()
# Cerramos la conexión a la base de datos.
conexion.close()