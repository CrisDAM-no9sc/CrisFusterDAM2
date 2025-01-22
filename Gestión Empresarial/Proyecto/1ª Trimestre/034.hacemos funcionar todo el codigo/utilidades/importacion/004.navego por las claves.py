import pandas as pd

contenido = pd.read_excel(r"C:\xampp\htdocs\Gestión Empresarial\Proyecto\022.Utilidades\utilidades\importacion\clientes.xlsx")
diccionario = contenido.to_dict()
print(diccionario)
print(diccionario['nombre'][0])

for clave in diccionario:
    print(clave)