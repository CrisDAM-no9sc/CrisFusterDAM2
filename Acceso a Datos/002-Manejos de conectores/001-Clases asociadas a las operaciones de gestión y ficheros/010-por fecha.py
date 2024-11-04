import os
import PIL.Image

lista = os.listdir("cuqui")

for archivo in lista:
    print(archivo)
    imagen = PIL.Image.open('cuqui/'+archivo)
    datosexif = imagen._getexif()
    ##formateamos la cadena 
    #el indice 306 corresponde a la fecha 
    ##y lo reemplazamos para crear un nombre de archivo valido 
    cadena = datosexif[306].replace(":","-").replace(" ","_")
    print(cadena)
