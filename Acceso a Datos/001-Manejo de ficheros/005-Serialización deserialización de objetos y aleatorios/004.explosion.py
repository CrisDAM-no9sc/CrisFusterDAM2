archivo = open("archivo.txt",'r')
contenido = archivo.read()
# Imprime el contenido leído del archivo en la consola.
print(contenido)
# Divide el contenido en una lista utilizando el carácter "|" como separador.
#devuelve una lista con las partes del contenido
lista = contenido.split("|")
print(lista)
# Asigna la primera y la segunda parte de la lista a variables separadas.
# 'lista[0]' representa la primera parte y 'lista[1]' representa la segunda parte.
variable1 = lista[0]
variable2 = lista[1]

print(variable1)
print(variable2)
