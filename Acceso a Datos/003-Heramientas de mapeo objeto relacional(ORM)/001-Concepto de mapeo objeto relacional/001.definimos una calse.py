#esto es un modelo de vasados en objetos
# la informacion esta guardada en clases y las clases se convierten en objetos

class Persona:
    def __init__(self,nuevonombre,nuevosapellidos,nuevaedad):
        self.nombre = nuevonombre
        self.apelldios = nuevosapellidos
        self.edad = nuevaedad

persona1 = Persona("Carme", "Fuentes Tarragona", 50)
persona2 = Persona("Carlos", "Cifuentes Gonzalez" ,30)

print(persona1)