import csv
import pandas as pd

##################################### CARGAMOS EL MAPEADO DE EXCEL A MYSQL #################################################
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
##################################### CARGAMOS EL MAPEADO DE EXCEL A MYSQL #################################################

############################################# LEEMOS EL EXCEL ##############################################################

contenido = pd.read_excel(r"C:\xampp\htdocs\Gestión Empresarial\Proyecto\022.Utilidades\utilidades\importacion\clientes.xlsx")
diccionario = contenido.to_dict()
print(diccionario)

############################################# LEEMOS EL EXCEL ##############################################################