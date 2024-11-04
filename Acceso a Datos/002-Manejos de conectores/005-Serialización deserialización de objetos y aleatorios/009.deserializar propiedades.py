import random
import math
 
#  generar datos aleatorios o hacer operaciones matemáticas.

# Declaramos una clase Npc con tres propiedades: x, y y angulo.
class Npc:
    # El constructor __init__ inicializa las propiedades x, y y angulo con los valores que se pasan como parámetros.
    def __init__(self, nuevax, nuevay, nuevoangulo):
        self.x = nuevax        # Asigna el valor de nuevax a la propiedad x del NPC.
        self.y = nuevay        # Asigna el valor de nuevay a la propiedad y del NPC.
        self.angulo = nuevoangulo  # Asigna el valor de nuevoangulo a la propiedad angulo del NPC.

# Creamos una lista vacía llamada npcs que almacenará los NPCs.
npcs = []

# Abrimos el archivo "basededatos.txt" en modo lectura ("r").
archivo = open("basededatos.txt", "r")

# Leemos todo el contenido del archivo y lo almacenamos en la variable `contenido`.
contenido = archivo.read()

# Imprimimos el contenido leído para verificar lo que hemos obtenido.
print(contenido)

# Dividimos el contenido en una lista de objetos utilizando el carácter "|" como separador.
# Cada objeto representa los datos de un NPC.
objetos = contenido.split("|")

# Recorremos la lista de objetos.
for objeto in objetos:
    try:
        # Para cada objeto, lo dividimos en una lista de propiedades (x, y, angulo) usando la coma (",") como separador.
        propiedades = objeto.split(",")

        # Imprimimos las propiedades (x, y, angulo) de cada NPC para verificar que los datos se han separado correctamente.
        print(propiedades)

        # Creamos una instancia de Npc utilizando las propiedades extraídas y la añadimos a la lista `npcs`.
        # Convertimos las propiedades a los tipos adecuados (enteros o flotantes según sea necesario).
        npcs.append(Npc(propiedades[0], propiedades[1], propiedades[2]))
    except:
        
        print("Hay un error")

# Recorremos la lista de NPCs creada para verificar que se han añadido correctamente.
for npc in npcs:
    # Imprimimos las propiedades de cada NPC (x, y, angulo) para confirmar que todo funciona.
    print(npc.x, npc.y, npc.angulo)
