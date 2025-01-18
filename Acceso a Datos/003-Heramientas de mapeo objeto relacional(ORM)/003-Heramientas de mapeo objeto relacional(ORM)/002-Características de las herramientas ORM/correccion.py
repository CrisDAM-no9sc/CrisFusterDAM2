import mysql.connector

############################# CREO UNA CLASE QUE ES EL MODELO DE DATOS #############################
class Curso:
    def __init__(self):
        self.nombre = None
        self.descripcion = None
        self.temas = None  # Lista de temas del curso

clase = "Curso"

##################################### CONEXIÓN CON EL SERVIDOR  #####################################
conexion = mysql.connector.connect(
    host='localhost',  
    database='accesoadatos', 
    user='crismon1',  
    password='crismon1'  
)

cursor = conexion.cursor(dictionary=True)

##################### BORRAMOS LA TABLA ANTERIOR POR SI ACASO HAY DATOS ANTERIORES  ####################
cursos = []

# Recuperamos los cursos de la base de datos
peticion = "SELECT * FROM " + clase
cursor.execute(peticion)

# Recuperación de datos de cursos
filas = cursor.fetchall()

for fila in filas:
    curso = Curso()
    for clave, valor in fila.items():
        setattr(curso, clave, valor)

    # Recuperación de los temas asociados a este curso
    peticion2 = f"SELECT tema FROM Temas WHERE FK = {curso.Identificador}"
    cursor.execute(peticion2)
    temas = cursor.fetchall()

    # Asignar los temas al curso
    curso.temas = [tema['tema'] for tema in temas]

    cursos.append(curso)

# Mostrar los resultados
for curso in cursos:
    print(f"Curso: {curso.nombre}, Descripción: {curso.descripcion}")
    for tema in curso.temas:
        print(f"    Tema: {tema}")

conexion.close()
