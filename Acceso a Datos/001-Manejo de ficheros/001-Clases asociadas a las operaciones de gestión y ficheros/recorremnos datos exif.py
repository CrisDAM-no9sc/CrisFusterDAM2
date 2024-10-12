import os
import PIL.Image

# Listamos todos los archivos en el directorio "fotoscuqui"
lista = os.listdir("fotoscuqui")

# Iteramos sobre cada archivo en la lista de archivos obtenida
for archivo in lista:
    # Verificamos si el archivo es una imagen
    if archivo.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
        print(archivo)  # Imprimimos el nombre del archivo actual
        try:
            # Abrimos la imagen
            imagen = PIL.Image.open('fotoscuqui/' + archivo)

            # Obtenemos los datos EXIF
            datosexit = imagen._getexif()

            # Comprobamos si hay datos EXIF
            if datosexit is not None:
                print(datosexit)  # Imprimimos los datos EXIF
            else:
                print("No se encontraron datos EXIF para esta imagen.")  # Mensaje alternativo si no hay EXIF

        except Exception as e:
            print(f"Error al procesar el archivo {archivo}: {e}")
