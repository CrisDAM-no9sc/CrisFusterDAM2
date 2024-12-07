
# definimos la clase para representar a una persona 
#esto convierte cada persona en un objeto que encapsula su informacion 
class Persona:
    def __init__(self, nuevonombre, nuevosapellidos, nuevaedad):
        # Inicializamos los atributos de la clase
        self.nombre = nuevonombre
        self.apellidos = nuevosapellidos
        self.edad = nuevaedad
        


# Creamos una lista de personas
personas = []

# con el append lo que estamos haciendo es añadir el objeto eprosna a la lista recien creada de personas 
personas.append(Persona("Carlos", "Cifuentes Gonzalez", 30))
personas.append(Persona("Manolo", "Solis García", 28))

atributos =[attr for attr in dir(personas[0]) if not callable(personas[0], attr) and not attr.startswith("__")]
print(atributos)