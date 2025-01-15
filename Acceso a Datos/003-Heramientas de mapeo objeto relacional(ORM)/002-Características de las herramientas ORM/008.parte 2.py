import mysql.connector

############################# CREO UNA CLASE QUE ES EL MODELO DE DATOS #############################
class Curso:
    def __init__(self):
        self.nombre = None
        self.descripcion = None
        self.temas = None   # Lista de temas del curso

clase = "Curso"

##################################### CONEXIÓN CON EL SERVIDOR  #####################################
conexion = mysql.connector.connect(
    host='localhost',  
    database='python', 
    user='crismon1',  
    password='crismon1'  
)

cursor = conexion.cursor(dictionary=True)

##################### Realizar una consulta para obtener los cursos  ####################
cursos = []
## eliminamos la tabla si ya existe 
peticion = "SELECT * FROM "+clase   
cursor.execute(peticion)

## recupera todos los registros de la tabla como una lista de diccionarios
filas = cursor.fetchall()
# procesamos cada fila de dtaos
for fila in filas:
    curso = Curso()
    #iteramos sobre cada clave y valor del diccionario fila 
    for clave, valor in fila.items():
        ## asignamos dinamicamente eñ valor de cada columna a los atributos 
        setattr(curso, clave, valor)

    # devuelve el diccionario con todos los atributos del objeto, y luego iteramos sobre ellos
    for clave, valor in vars(curso).items():
        # si tienen el valor nonen significa que el valor no esta en la base de datos 
        if valor == None:
            # si es none asignamos la lista vacia a ese atributo 
            setattr(curso, clave, [])
            print("Hay una tabla externa:", clave)
            
            peticion2 = "SELECT "+clave+" FROM "+clave+" WHERE FK = "+str(curso.Identificador)

            cursor.execute(peticion2)
            filas2 = cursor.fetchall()
            for fila2 in filas2:
                print(fila2)
                getattr(curso,clave).append(fila2.get(clave))

    cursos.append(curso)

print(vars(cursos[0]))

cursos = []
conexion.commit() 