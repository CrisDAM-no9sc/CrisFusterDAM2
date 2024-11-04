##asignamos una cadena de texto 
variable1= "hola"
variable2 = "que tal"
##abrimos un aerchivo en modo escritura
#y si ya exsite se sobreescribira
archivo = open("archivo.txt",'w')
##ecribimos la variable 1 y 2
##se concatenaran pero sin espacios
archivo.write(variable1+variable2)
archivo.close()
