#esto es un modelo de vasados en objetos
# la informacion esta guardada en clases y las clases se convierten en objetos
import mysql.connector

class Persona:
    def __init__(self,nuevonombre,nuevosapellidos,nuevaedad):
        self.nombre = nuevonombre
        self.apelldios = nuevosapellidos
        self.edad = nuevaedad

persona1 = Persona("Carme", "Fuentes Tarragona", 50)
persona2 = Persona("Carlos", "Cifuentes Gonzalez" ,30)

conexion = mysql.connector.connect(
    host='localhost',
    database = 'accesoadatos',
    user = 'accesoadatos',
    password ='accesoadatos'
)

cursor = conexion.cursor()

peticion = f"""INSERT INTO personas VALUES (NULL,'{persona1.nombre}','{persona1.apelldios}',{persona1.edad});"""
cursor.execute(peticion)
conexion.commit()