import csv
##creamos un diccionario 
diccionario = {}
##abrimos el csv en modo lectura
archivo = open('C:\\xampp\\htdocs\\Gestión Empresarial\\Proyecto\\022.Utilidades\\utilidades\\importacion\\mapeado.csv', mode='r')
##cargamos sobre el diccionario el contenido 
lectorcsv = csv.DictReader(archivo)
##creamos una lista vacia
mapeado = []
##para cada una de las dilas del csv
for fila in lectorcsv:
    ##añadimos el dicccionario a la lista
    mapeado.append(fila)

print(mapeado)