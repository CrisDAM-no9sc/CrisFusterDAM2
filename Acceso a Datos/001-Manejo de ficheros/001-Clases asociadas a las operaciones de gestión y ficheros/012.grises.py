import os
 # Importa las clases Image y ImageOps de la biblioteca PIL para manipular imágenes
from PIL import Image, ImageOps


lista = os.listdir("fotoscuqui")

for archivo in lista:
    print("OK")
    ##aqui abrimos la ruta de la carpeta y el nombre del archivo
    imagen = Image.open(r"fotoscuqui/"+archivo)
    ##convertimos la imgen a grises 
    imagen2 = ImageOps.grayscale(imagen)
    imagen.close()
    ##guardamos la imagen en la carpeta convertidas , sobreescribiendo las originales
    imagen2.save('fotoscuqui/'+archivo)
    imagen2.close()

