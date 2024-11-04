import random
import math
import json

#declaramos una clas Npc y le ponemos dos sencillas propiedades
class Npc:
    #El constructor __init__ inicializa estas propiedades para cada instancia de Npc.
    def __init__(self,nuevax,nuevay,nuevoangulo):
        self.x = nuevax
        self.y = nuevay
        self.angulo = nuevoangulo
#creamos una lista de 50 npc
        
npcs = []


#leemos del json
# Abrimos el archivo `basededatos.json` en modo lectura ('r') usando `with open`.
# `with` se asegura de que el archivo se cierra automáticamente después de que se haya leído.
with open('basededatos.json','r') as archivo:
    # Usamos `json.load` para leer y convertir el contenido del archivo JSON en una lista de diccionarios de Python.
    datos = json.load(archivo)


#convertimos la lsita de objetos en instancias de Npc
for elemento in datos:
    npcs.append(Npc(elemento['x'],elemento['y'],elemento['angulo']))
    #print(elemento)

#comprobamos que esta bien echo y funciona correctamente
for npc in npcs:
    print(npc.x,npc.y,npc.angulo)

#Este código es un buen ejemplo de deserialización: toma datos que estaban almacenados en un archivo JSON
#y los convierte en objetos Npc dentro del programa, para poder usarlos como si hubieran sido creados originalmente en el código.
