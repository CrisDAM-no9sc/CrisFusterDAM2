import os
import PIL.Image

lista = os.listdir("cuqui")

for archivo in lista:
    print(archivo)
    imagen = PIL.Image.open('cuqui/'+archivo)
    datosexif = imagen._getexif()
    ##formateamos la cadena 
    cadena = datosexif[306].replace(":","-").replace(" ","_")
    print(cadena)
    #renombramos la imagen con la nueva cadena mantemniendo la extension .jpg
    os.rename('cuqui/'+archivo,'cuqui/'+cadena+'.jpg')
