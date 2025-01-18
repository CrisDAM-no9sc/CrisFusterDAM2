import mysql.connector

############################# CREO UNA CLASE QUE ES EL MODELO DE DATOS #############################
class Curso:
    def __init__(self, nombre, descripcion, temas):
        self.nombre = nombre
        self.descripcion = descripcion
        self.temas = temas  # Lista de temas del curso

clase = "Curso"

##################################### CONEXIÓN CON EL SERVIDOR  #####################################
conexion = mysql.connector.connect(
    host='localhost',  
    database='python', 
    user='crismon1',  
    password='crismon1'  
)

cursor = conexion.cursor()

##################################### CREO UNA LISTA DE CURSOS ########################################
cursos = []

cursos.append(Curso("Python Básico", "Curso introductorio de Python", ["Sintaxis", "Condicionales", "Bucles"]))
cursos.append(Curso("Bases de Datos", "Aprender a manejar bases de datos", ["SQL", "Relaciones", "ORMs"]))

##################### BORRAMOS LA TABLA ANTERIOR POR SI ACASO HAY DATOS ANTERIORES  ####################
## eliminamos la tabla si ya existe 
peticion = "DROP TABLE IF EXISTS "+clase
cursor.execute(peticion)

################  CREACIÓN DINÁMICA DE LA TABLA EN LA BASE DE DATOS  ###################################
## iniciamos la creacion de la tabla si no existe y configuramos el campo de identificador como clave primaria
peticion = "CREATE TABLE IF NOT EXISTS  "+clase+" (Identificador INT NOT NULL AUTO_INCREMENT,"
## extraemos inamicamente los atributos de la cala excluyendo metodos y atributos especiales 
atributos = [attr for attr in dir(cursos[0]) if not callable(getattr(cursos[0], attr)) and not attr.startswith("__")]

# para cada atributo de la clase
for atributo in atributos:
    # si no es una lista lo añade como un campo VARCHAR
    if not isinstance(getattr(cursos[0], atributo), list):
        peticion += atributo+" VARCHAR(255) NOT NULL,"
    ## SI ES UNA LISTA 
    else:
        # ELIMINAMOS LA TABLA SECUNDARIA 
        peticion2 = "DROP TABLE IF EXISTS "+atributo+""
        cursor.execute(peticion2)
        # Y CREAMOS UNA NUEVA TABLA CON CALVE PRIMARIA UNICA, CON UNA CLAVE FORANEA QUE SE RELACIONARA EL TEMA CON EL CURSO CORRESOPNDIENTE
        peticion2 = "CREATE TABLE IF NOT EXISTS "+atributo+" (Identificador INT NOT NULL AUTO_INCREMENT,FK INT(255),"+atributo+" VARCHAR(255),PRIMARY KEY (Identificador))"
        cursor.execute(peticion2)
## FINALIZAMOS LA CREACION DE LA TABLA PRINCIPAL 
peticion += " PRIMARY KEY (Identificador))"
print(peticion)
cursor.execute(peticion)

################# INSERCIÓN DINÁMICA DE REGISTROS EN LA BASE DE DATOS #########################################
# se itera sobre la lista de cursos 
# iniciamos una consulata para el ingreso de un registro en la tabla cursos 
for indice, curso in enumerate(cursos):
    peticion = "INSERT INTO "+clase+" VALUES(NULL,"
    ## para acda atributo que no sea una lista 
    for atributo in atributos:
        if not isinstance(getattr(curso, atributo), list):
            peticion += "'"+str(getattr(curso, atributo))+"'," 
        ## y si el atributo es una lista se inserta los elementos en otra tabla asociada con la tabla cursos
        else:
            for tema in getattr(curso, atributo):
                peticion2 = "INSERT INTO "+atributo+" VALUES(NULL, "+str(indice + 1)+", '"+tema+"')"
                cursor.execute(peticion2)

    ## eliminamos la ultima coma y ejecutamos la insercion en la tabla principal
    peticion = peticion[:-1] + ");"
    cursor.execute(peticion)
## confirmamos todas las operaciones en la base de datos asegurando que los cambios sean permanentes
conexion.commit()
