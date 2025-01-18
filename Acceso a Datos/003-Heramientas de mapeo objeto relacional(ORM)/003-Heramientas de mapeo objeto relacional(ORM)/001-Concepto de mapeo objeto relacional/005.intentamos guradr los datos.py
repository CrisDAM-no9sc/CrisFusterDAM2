#esto es un modelo de vasados en objetos
# la informacion esta guardada en clases y las clases se convierten en objetos
import mysql.connector

class Persona:
    def __init__(self,nuevonombre,nuevosapellidos,nuevaedad, nuevosemails):
        self.nombre = nuevonombre
        self.apellidos = nuevosapellidos
        self.edad = nuevaedad
        self.emails = nuevosemails


#creamos una lista de personas 
personas = []
personas.append (Persona("Carme", "Fuentes Tarragona", 50, ['camwela@gamil.com','correoelectroniso@gamil.com']))
personas.append (Persona("Carlos", "Cifuentes Gonzalez" ,30, ['cifuentesiso@gamil.com', 'carlos@correo.com']))

conexion = mysql.connector.connect(
    host='localhost',
    database = 'accesoadatos',
    user = 'accesoadatos',
    password ='accesoadatos'
)

cursor = conexion.cursor()

for persona in personas:
    peticion = f"""
    INSERT INTO personas VALUES (
    NULL,
    '{persona.nombre}',
    '{persona.apellidos}',
    {persona.edad},
    {personas.emails}
    );
    """
    cursor.execute(peticion)

conexion.commit()