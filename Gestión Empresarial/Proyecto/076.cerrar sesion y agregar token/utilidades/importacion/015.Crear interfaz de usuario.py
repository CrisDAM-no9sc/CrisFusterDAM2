import csv
import pandas as pd
import mysql.connector
import tkinter as tk

############################################# FUNCIONES  ##############################################################
def definir():
    print("Definimos aerchivo de entrada")

def vamos():
    print("Insertando datos")
############################################# FUNCIONES  ##############################################################
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
############################################# LEEMOS EL EXCEL ############################################################
############################################# CREAMOS VENTANA  ###########################################################

ventana = tk.Tk()

nombre_tabla = tk.StringVar()

tk.Label(ventana, text="Carga el aechivo de excel").pack(padx=10,pady=10)
tk.Button(ventana, text="Define el archivo de entrada", command=definir).pack(padx=10,pady=10)
tk.Label(ventana, text="Indica el nombre de la tabla en la que vas a importar").pack(padx=10,pady=10)
tk.Entry(ventana, textvariable=nombre_tabla).pack(padx=10,pady=10)
tk.Label(ventana, text="Ahora ejecutamos").pack(padx=10,pady=10)
tk.Button(ventana, text="Vamos a insertar los valores en la tabla", command=vamos).pack(padx=10,pady=10)

ventana.mainloop()

############################################# CREAMOS VENTANA  ##########################################################