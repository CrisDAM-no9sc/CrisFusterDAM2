import os
#para trabajar con imagenes
import PIL.Image
#listamos los archivos de la carpeta
lista = os.listdir("fotoscuqui")
#iteramos sobre cada archico
for archivo in lista:
    #imprimimos el nombre
    print(archivo)
    #abrimos la imagen usando la ruta completa (directorios+nombre archivo)
    imagen = PIL.Image.open('fotoscuqui/'+archivo)
    #obtenemos los datos EXIF de la imagen (atometads)
    datosexit = imagen._getexif()
    #imprimos los datos EXIF
    print(datosexit)
