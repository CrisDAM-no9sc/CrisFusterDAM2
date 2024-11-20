import csv
import pandas as pd
import mysql.connector

############################### NOS CONECTAMOS A LA BASE DE DATOS DE MYSQL #################################################

conexion = mysql.connector.connect(
    host="localhost",
    database="crismon1",
    user="crismon1",
    password="crismon1"  
)

cursor = conexion.cursor()

contenidoglobal = pd.read_excel(r"C:\xampp\htdocs\Gestión Empresarial\Proyecto\022.Utilidades\utilidades\importacion\clientes.xlsx")
lineas = len(contenidoglobal)           ##para saber cunatas lineas tenemos que importar
##hacemos un bucle for para asegursrnos de que pònemos tantas lineas que sean necesarias 
for i in range(0,lineas):

    peticion = "INSERT INTO clientes (Identificador) VALUES (NULL)"
    print(peticion)
    cursor.execute(peticion)
    conexion.commit()
    ##que nos de el ultimo id que acabamos de meter
    peticion = "SELECT Identificador FROM clientes ORDER BY Identificador DESC LIMIT 1"
    ##ejecutamos la peticion
    cursor.execute(peticion)
    #obtenemos el relustado
    resultado = cursor.fetchall()
    ## Creamos un identificador 
    identificador = resultado [0][0]

################################# NOS CONECTAMOS A LA BASE DE DATOS DE  MYSQL ##############################################
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


##################################### CARGAMOS EL MAPEADO DE EXCEL A MYSQL #################################################
    print("-------------------------------------------------")
############################################# LEEMOS EL EXCEL ##############################################################

    contenido = pd.read_excel(r"C:\xampp\htdocs\Gestión Empresarial\Proyecto\022.Utilidades\utilidades\importacion\clientes.xlsx")
    diccionario = contenido.to_dict()
    ##para cada clave del diccionario
    for clave in diccionario:

        print("-------------------------------------------------")
        peticion = "UPDATE clientes SET "+str(mapeado[clave])+" = '"+str(diccionario[clave][i])+"' WHERE Identificador = "+str(identificador)+";"

        print(peticion)
        cursor.execute(peticion)                                            
        conexion.commit()      
############################################# LEEMOS EL EXCEL ##############################################################