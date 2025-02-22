import csv
import pandas as pd

##################################### CARGAMOS EL MAPEADO DE EXCEL A MYSQL #################################################
##creamos un diccionario 
diccionario = {}
##abrimos el csv en modo lectura
archivo = open('C:\\xampp\\htdocs\\Gestión Empresarial\\Proyecto\\022.Utilidades\\utilidades\\importacion\\mapeado.csv', mode='r')
##cargamos sobre el diccionario el contenido 
lectorcsv = csv.DictReader(archivo)
##creamos un diccionario vacio
mapeado = {}
##para cada una de las dilas del csv
for fila in lectorcsv:
    ##añadimos el diccionario en la lista
    mapeado[fila['excel']] = fila['mysql']

print(mapeado)
##################################### CARGAMOS EL MAPEADO DE EXCEL A MYSQL #################################################
print("-------------------------------------------------")
############################################# LEEMOS EL EXCEL ##############################################################

contenido = pd.read_excel(r"C:\xampp\htdocs\Gestión Empresarial\Proyecto\022.Utilidades\utilidades\importacion\clientes.xlsx")
diccionario = contenido.to_dict()
print(diccionario)
##para cada clave del diccionario
for clave in diccionario:
    ##imprimimos la clave del excel 
    print("clave excel:",clave)
    ##imprimmimos el contenido 
    print("valor de esa clave:",diccionario[clave][0])
    ##imprimimos la columna de mysql corresondiente
    print("La columna de Mysql es:",mapeado[clave])
    print("-------------------------------------------------")

############################################# LEEMOS EL EXCEL ##############################################################