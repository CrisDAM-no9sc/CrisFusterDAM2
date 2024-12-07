import mysql.connector
################## PREPARAMOS CREAMOS CLASE QUE VA A SER EL MODELO DE DATOS ############## 

# definimos la clase para representar a una persona 
#esto convierte cada persona en un objeto que encapsula su informacion 
class Persona:
    def __init__(self, nuevonombre, nuevosapellidos, nuevaedad, nuevoemail, nuevadireccion, nuevostelefonos):
        # Inicializamos los atributos de la clase
        self.nombre = nuevonombre
        self.apellidos = nuevosapellidos
        self.edad = nuevaedad
        self.email = nuevoemail
        self.direccion = nuevadireccion
        self.telefonos = nuevostelefonos

###################### PREPARAMOS LA CONEXION CON EL SERVIDOR ######################      
  
conexion = mysql.connector.connect(
    host='localhost',
    database = 'accesoadatos',
    user = 'accesoadatos',
    password ='accesoadatos'
)
cursor = conexion.cursor()

################## CREAMOS UNA LISTA DE PERSONAS  ########################### 
# Creamos una lista de personas
personas = []

# con el append lo que estamos haciendo es añadir el objeto eprosna a la lista recien creada de personas 
personas.append(Persona("Carlos","Cifuentes Gonzalez",30,'carlos@correo.com','Calle carlos 1',[6158,2349]))
personas.append(Persona("Manolo","Solis García",28,'manolo@solis.com','Avenida manuel 16',[8458,2388]))

################## BORRAMOS LA TABLA ANTERIOR  ########################### 

peticion = "DROP TABLE Persona"
cursor.execute(peticion)

################## PREPARAMOS CREACIÓN DINAMICA DE LA TABLA  ########################### 
##si ya esta creada la tabla, le podemos poner para que no nos salga fallo IF NOT EXISTS
peticion = "CREATE TABLE IF NOT EXISTS Persona ("
#para listar los atributos de la clase
atributos = [
    attr for attr in dir(personas[0]) 
    if not callable(getattr(personas[0], attr)) and not attr.startswith("__")
]

#para cada uno de los atributos 
for atributo in atributos:
    #lo encadenamos a la peticion
    #peticion += f"{atributo} VARCHAR(255) NOT NULL,"
    peticion += atributo+" VARCHAR(255) NOT NULL,"

## si no ponemos esto se quedara la ultima coma y nos dara error
peticion = peticion[:-1]
#crerramos el parentesis de la peticion
peticion += ")"
print(peticion)
#creamos un cursor 
cursor = conexion.cursor()
#ejecutamos la peticion
cursor.execute(peticion)  

############## INSERCION DINAMICA DE REGISTROS EN LA TABLA DE LA BASE DE DATOS  ############### 
# para cada una de las personas hacemos un insert
for persona in personas:
    peticion = "INSERT INTO Persona VALUES("
    #y para cdaa uno de los atributos 
    for atributo in atributos:
        # Accedemos dinámicamente al valor de cada atributo de la persona.
        peticion += f"'{getattr(persona, atributo)}',"
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