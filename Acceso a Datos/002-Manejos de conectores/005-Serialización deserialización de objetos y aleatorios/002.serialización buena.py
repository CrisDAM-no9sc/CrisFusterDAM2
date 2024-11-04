variable1 = "hola"
variable2 = "que tal"

archivo = open("archivo.txt",'w')
##aqui le aplicamos el separador 
archivo.write(variable1+"|"+variable2)
archivo.close()
