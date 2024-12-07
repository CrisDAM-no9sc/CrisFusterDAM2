
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

#podemos poner la extension que queramos 
# reb significa que queremos leer el archivo binario
archivo = open('binario.bin', 'rb')
personas = pickle.load(archivo)
archivo.close()

print(personas)