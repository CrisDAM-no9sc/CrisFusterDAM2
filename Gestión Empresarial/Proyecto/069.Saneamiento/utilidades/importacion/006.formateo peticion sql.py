import pandas as pd
##leemos el archivo de eexcel
contenido = pd.read_excel(r"C:\xampp\htdocs\Gestión Empresarial\Proyecto\022.Utilidades\utilidades\importacion\clientes.xlsx")
##lo convertimos a diccionario de python
diccionario = contenido.to_dict()
print(diccionario)
##comprobamos que podemos acceder a los datos 
print(diccionario['nombre'][0])

peticion = "INSERT INTO clientes VALUES (NULL,)"

##repasamos clave a clave el diccionario
for clave in diccionario:
    ##y lo sacamops por pantalla
    print(clave,diccionario[clave][0])
    peticion += clave+"='"+str(diccionario[clave][0])+"',"

peticion += ")"
print(peticion)