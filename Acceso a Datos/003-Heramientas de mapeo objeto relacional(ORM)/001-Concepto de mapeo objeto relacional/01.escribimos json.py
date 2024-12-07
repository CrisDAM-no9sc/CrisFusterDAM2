
import json
# definimos la clase para representar a una persona 
#esto convierte cada persona en un objeto que encapsula su informacion 
class Persona:
    def __init__(self, nuevonombre, nuevosapellidos, nuevaedad, nuevosemails):
        # Inicializamos los atributos de la clase
        self.nombre = nuevonombre
        self.apellidos = nuevosapellidos
        self.edad = nuevaedad
        self.emails = nuevosemails
    #utilizamos este metodo para convertir unobjeto en un diccionario
    def to_dict(self):
        return{
            'nombre': self.nombre,
            'apellidos': self.apellidos,
            'edad': self.edad,
            'emails': self.emails,
        }

# Creamos una lista de personas
personas = []
#definimos una lista de diccionarios que va a modelar los correos con un tipo y un valor 
# creamos una estructura de datos mas compleja para modelar los correos de una persona  
correoscarlos = [
    {'tipo': 'personal','valor':'cifuentesiso@gamil.com'},
    {'tipo': 'trabajo','valor':['carlos@correo.com', 'correooffice@gmail.com']}
]

# aqui estamos añadiendo objetos de la clase persona a la lista
# con el append lo que estamos haciendo es añadir el objeto eprosna a la lista recien creada de personas 
personas.append(Persona("Carlos", "Cifuentes Gonzalez", 30, correoscarlos))

#recorremos cada objeto en la lista de personas y lo convertimpos en un diccionario usando el metodo to_dict
#convertimos cada objeto 'Persona' a la lista de personas incluyendo los correos como estructura
diccionario = [persona.to_dict() for persona in personas]

# Abrimos un archivo llamado `personas.json` en modo escritura (`w`) con codificación UTF-8.
archivo = open('personas.json', 'w', encoding='utf-8')
#guardamos la lista de diccionario en un  archivo con fomato de indentado
json.dump(diccionario,archivo, ensure_ascii=False, indent=4)
archivo.close()