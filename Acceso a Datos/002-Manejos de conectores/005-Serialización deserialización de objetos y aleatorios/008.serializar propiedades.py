import random
# Importamos el módulo math para utilizar funciones matemáticas
import math
#declaramos una clas Npc y le ponemos dos sencillas propiedades
class Npc:
    #El constructor __init__ inicializa estas propiedades para cada instancia de Npc.
    def __init__(self):
        self.x = random.randint(0,512)
        self.y = random.randint(0,512)
        self.angulo = random.random()*math.pi*2
#creamos una lista de 50 npc
#creamos una lista vacia que se llama npcs/ el 50 representa la cantidad de personajes no jugables        
npcs = []
numero = 50
#recorreoms la lista y a cada elemento le ponemos una instancia
for i in range(0,numero):
    npcs.append(Npc())

cadena=""
#aqui lo que estamos haciendo es convertir a cadena de texto las posiciones de y,x y angulo separadas al final por barras verticales   
for i in range(0,numero):
    # Aquí lo que estamos haciendo es convertir a cadena de texto las posiciones de x, y y ángulo,
    # separadas al final por barras verticales
    cadena += str(npcs[i].x)+","+str(npcs[i].y)+","+str(npcs[i].angulo)+"|"

print(cadena)
#aqui creamos un archivo donde escribimos y guardamos las posiciones de ncp
mibasedatos = open("basededatos.txt","w")
mibasedatos.write(cadena)
mibasedatos.close()
