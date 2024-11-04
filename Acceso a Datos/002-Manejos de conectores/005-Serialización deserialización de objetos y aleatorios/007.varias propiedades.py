import random
import math
#declaramos una clas Npc y le ponemos dos sencillas propiedades
class Npc:
    def __init__(self):
        self.x = random.randint(0,512)
        self.y = random.randint(0,512)
        self.angulo = random.random()*math.pi*2
#creamos una lista de 50 npc
npcs = []
numero = 50
#recorreoms la lista y a cada elemento le ponemos una instancia
for i in range(0,numero):
    npcs.append(Npc())
    
for i in range(0,numero):
    print(npcs[i].x,npcs[i].y,npcs[i].angulo)
