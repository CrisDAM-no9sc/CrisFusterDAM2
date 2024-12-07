# Importamos el conector para MySQL
import mysql.connector

# Clase Persona para modelar los datos de cada persona
class Persona:
    def __init__(self, nuevonombre, nuevosapellidos, nuevaedad, nuevosemails):
        # Inicializamos los atributos de la clase
        self.nombre = nuevonombre
        self.apellidos = nuevosapellidos
        self.edad = nuevaedad
        self.emails = nuevosemails

# Creamos una lista de personas
personas = []
# Añadimos personas a la lista con sus datos
personas.append(Persona("Carme", "Fuentes Tarragona", 50, ['camwela@gamil.com', 'correoelectroniso@gamil.com']))
personas.append(Persona("Carlos", "Cifuentes Gonzalez", 30, ['cifuentesiso@gamil.com', 'carlos@correo.com']))

# Conectamos a la base de datos MySQL
conexion = mysql.connector.connect(
    host='localhost',      
    database='accesoadatos',
    user='accesoadatos',     
    password='accesoadatos'  
)

# Creamos un cursor para ejecutar consultas SQL
cursor = conexion.cursor()

# Iteramos sobre cada objeto Persona en la lista personas
for persona in personas:
    # Convertimos la lista de emails en una cadena separada por comas
    correos = ', '.join(persona.emails)
    
    # Creamos la consulta SQL para insertar los datos en la tabla
    peticion = f"""
            INSERT INTO personas VALUES (
            NULL,  -- Identificador autoincremental
            '{persona.nombre}',  -- Nombre de la persona
            '{persona.apellidos}',  -- Apellidos de la persona
            {persona.edad},  -- Edad de la persona
            '{correos}'  -- Emails, concatenados como una cadena
            );
            """
    # Ejecutamos la consulta SQL
    cursor.execute(peticion)

# Confirmamos los cambios en la base de datos
conexion.commit()

# Cerramos la conexión a la base de datos
conexion.close()

# Mensaje de confirmación
print("Datos insertados correctamente.")
