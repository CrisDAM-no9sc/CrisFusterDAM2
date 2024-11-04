import random
import math
import json

#declaramos una clas Npc y le ponemos dos sencillas propiedades
class Npc:
    #El constructor __init__ inicializa estas propiedades para cada instancia de Npc.
    def __init__(self):
        self.x = random.randint(0,512)
        self.y = random.randint(0,512)
        self.angulo = random.random()*math.pi*2
#creamos una lista de 50 npc
        
npcs = []
numero=50

for i in range(0,numero):
    npcs.append(Npc())

cadena = []

# Recorremos la lista de NPCs para extraer sus propiedades.
for i in range(0,numero):
    # Para cada NPC, creamos un diccionario con sus propiedades (x, y, angulo).
    # Este diccionario será un formato más fácil de convertir a JSON.
    cadena.append({"x":npcs[i].x, "y":npcs[i].y, "angulo":npcs[i].angulo})  


# Convertimos la lista de diccionarios `cadena` en una cadena de texto en formato JSON.
# Usamos `json.dumps` para hacer esto, con `indent=2` para que el JSON esté bien formateado (con sangrías).
json_formatted_str = json.dumps(cadena, indent=2)
print(json_formatted_str)
mibasededatos = open("basededatos.json",'w')
# Escribimos la cadena JSON en el archivo.
mibasededatos.write(json_formatted_str)
mibasededatos.close()
