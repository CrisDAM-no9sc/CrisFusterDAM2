
import pickle
# definimos la clase para representar a una persona 
#esto convierte cada persona en un objeto que encapsula su informacion 
class Persona:
    def __init__(self, nuevonombre, nuevosapellidos, nuevaedad, nuevosemails):
        # Inicializamos los atributos de la clase
        self.nombre = nuevonombre
        self.apellidos = nuevosapellidos
        self.edad = nuevaedad
        self.emails = nuevosemails

# Creamos una lista de personas
personas = []
#creamos una lista que va a contener objetos
# creamos una estructura de datos mas compleja para modelar los correos de una persona  
correoscarlos = [
    {'tipo': 'personal','valor':'cifuentesiso@gamil.com'},
    {'tipo': 'trabajo','valor':['carlos@correo.com', 'correooffice@gmail.com']}
]

# aqui estamos añadiendo objetos de la clase persona a la lista
# con el append lo que estamos haciendo es añadir el objeto eprosna a la lista recien creada de personas 
personas.append(Persona("Carlos", "Cifuentes Gonzalez", 30, correoscarlos))

#podemos poner la extension que queramos 
archivo = open('binario.bin', 'wb')
pickle.dump(personas, archivo)
archivo.close()