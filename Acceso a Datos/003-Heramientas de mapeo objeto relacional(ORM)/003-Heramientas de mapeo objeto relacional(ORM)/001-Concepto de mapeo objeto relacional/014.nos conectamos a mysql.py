import mysql.connector
# definimos la clase para representar a una persona 
#esto convierte cada persona en un objeto que encapsula su informacion 
class Persona:
    def __init__(self, nuevonombre, nuevosapellidos, nuevaedad, nuevoemail):
        # Inicializamos los atributos de la clase
        self.nombre = nuevonombre
        self.apellidos = nuevosapellidos
        self.edad = nuevaedad
        self.email = nuevoemail
        
conexion = mysql.connector.connect(
    host='localhost',
    database = 'accesoadatos',
    user = 'accesoadatos',
    password ='accesoadatos'
)

# Creamos una lista de personas
personas = []

# con el append lo que estamos haciendo es añadir el objeto eprosna a la lista recien creada de personas 
personas.append(Persona("Carlos", "Cifuentes Gonzalez", 30, 'carlos@correo.com'))
personas.append(Persona("Manolo", "Solis García", 28, 'manolo@solis.com'))


##si ya esta creada la tabla, le podemos poner para que no nos salga fallo IF NOT EXISTS
peticion = "CREATE TABLE IF NOT EXISTS Persona ("
atributos =[attr for attr in dir(personas[0]) if not callable(personas[0]) and not attr.startswith("__")]

for atributo in atributos:
    peticion += atributo+" VARCHAR(255) NOT NULL,"

peticion = peticion[:-1]
peticion += ")"
print(peticion)

cursor = conexion.cursor()
cursor.execute(peticion)
conexion.commit()