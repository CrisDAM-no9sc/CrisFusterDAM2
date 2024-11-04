import json                             #lo importamos como libreria para automatizar cosas como el guardado
import os
import errno                            #gestiona y captura los diferentes tipos de errores
import tkinter as tk                    #libreria para generar una interfaz de usuario



class Cliente: 
    #utilizamos un constructor con parametros para creacion abreviada
    def __init__(self,idcliente, nuevonombre, nuevoapellidos, listapersonal, listaprofesional):
        ##asignamos los parametros a propiedad
        self.idcliente = idcliente
        self.nombre = nuevonombre
        self.apellidos = nuevoapellidos
        # self.email es un diccionario que tiene dos claves: "personal" y "profesional"
        self.email = {"personal": listapersonal, "profesional": listaprofesional}

    # Método to_dict: Convierte los atributos de la instancia de Cliente en un diccionario
    def to_dict(self):
        return {
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "email": self.email
        }


######  variables globales ########
#aqui tenemos el nombre de la carpeta donde se guardan los datos
carpeta = "basededatos" 
#se crea una lista vacia original de clientes    
clientes = []               

### realizamos un intento
try:
    ##de crear la carpeta por si no existe
    os.makedirs(carpeta)
##si no se puede capturamos el error
except OSError as e:
    ##si la carpeta existe
    if e.errno == errno.EEXIST:
        print(f"La carpeta ya existe")
    ##si el error es que no tenemos acceso a la carpeta
    elif e.errno == errno.EACCES:
        print("Error de permisos en la carpeta - no puedo guardar")
    else:
        print("")

#Aqui creamos las funciones
## con esta funcion guardamos al cliente cuando damos al boton 1
def guardarCliente():
    global clientes                             #metemos la función la variable de clientes (hay que ponerlo cuando queremos escribir)                                    
    clientes.append(
        Cliente(
            idcliente.get(),
            nombre.get(),
            apellidos.get(),
            personal.get(),
            profesional.get()
            )
        )
##Guardar los clientes en formato json en la carpeta 
def guardarDB():
    for cliente in clientes:
        archivo = open(carpeta+"/"+cliente.idcliente+".json", 'w')#abre un archivo y los llama por el idcliente 
        json.dump(cliente.to_dict(),archivo, indent=4)
        archivo.close() 

#### Aqui creamos la interfaz de usuario #####
ventana = tk.Tk()
marco = tk.Frame(ventana,padx=20,pady=20)           #aqui creamos unmarco para agrupar los elementos de la interfaz
marco.pack(padx=20,pady=20)                         #empaquetamos el marco a la ventana 

### VARIABLES ESPECIFICAS PARA ALMACENAR LA INFORMACIÓN #####
nombre = tk.StringVar()
apellidos = tk.StringVar()
idcliente = tk.StringVar()
personal = tk.StringVar()
profesional = tk.StringVar()

### AQUI TENEMOS CAMPOS Y ETIQUETAS PARA RECOJER LA INFORMACIÓN ###

tk.Label(marco,text="Id cliente").pack(padx=10,pady=10)
#campo que recojemos de idcliente 
tk.Entry(marco,textvariable = idcliente).pack(padx=10,pady=10)

tk.Label(marco,text="Nombre").pack(padx=10,pady=10)
#campo donde recojemos el nombre
tk.Entry(marco,textvariable = nombre).pack(padx=10,pady=10)

tk.Label(marco,text="Apellidos").pack(padx=10,pady=10)
tk.Entry(marco,textvariable = apellidos).pack(padx=10,pady=10)

tk.Label(marco,text="Email Perosnal").pack(padx=10,pady=10)
tk.Entry(marco,textvariable = personal).pack(padx=10,pady=10)

tk.Label(marco,text="Email Profesional").pack(padx=10,pady=10)
tk.Entry(marco,textvariable = profesional).pack(padx=10,pady=10)

###   aqui tenemos los botones ###
#boton para guardar al cliente
tk.Button(marco,text="Guadar cliente",command=guardarCliente).pack(padx=10,pady=10)
#para guarada a todos los clientes 
tk.Button(marco,text="Guadar todos los cliente a base de datos",command=guardarDB).pack(padx=10,pady=10)
ventana.mainloop()

