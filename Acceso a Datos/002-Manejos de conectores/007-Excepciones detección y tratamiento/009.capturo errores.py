import json
import os
# Importamos errno para manejar errores relacionados con el sistema de archivos
import errno

class Cliente: 
    def __init__(self):
        self.idcliente = None
        self.nombre = None
        self.apellidos = None
        # self.email es un diccionario que tiene dos claves: "personal" y "profesional"
        self.email = {"personal": [], "profesional": []}

    # Método to_dict: Convierte los atributos de la instancia de Cliente en un diccionario
    def to_dict(self):
        return {
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "email": self.email
        }

#creamos una carpeta importando os
#para manejar errores
carpeta = "basededatos"
# Variable para controlar si continuamos o no
continuas = True
try:
    os.makedirs(carpeta)
# Captura cualquier error al intentar crear la carpeta
except OSError as e:
    if e.errno == errno.EEXIST:
        print(f"La carpeta ya existe")
    elif e.errno == errno.EACCES:
        continuas = False
        print("Error de permisos en la carpeta - no puedo guardar")
    else:
        print("")
        
        

if continuas:
    # Creamos una lista vacía de clientes
    clientes = []

    # Añadimos un primer cliente
    clientes.append(Cliente())
    clientes[-1].idcliente = "0001"
    clientes[-1].nombre = "Manuel"
    clientes[-1].apellidos = "Gorrion García"
    clientes[-1].email['profesional'].append("Manuelempresa@gmail.com")
    clientes[-1].email['profesional'].append("empresa2@gmail.com")
    clientes[-1].email['personal'].append("manuelgorrion@gmail.com")

    # Añadimos un segundo cliente
    clientes.append(Cliente())
    clientes[-1].idcliente = "0002"
    clientes[-1].nombre = "Cristina"
    clientes[-1].apellidos = "Fuster García"
    clientes[-1].email['profesional'].append("cristinafuster@gmail.com")
    clientes[-1].email['profesional'].append("garciacris@gmail.com")
    clientes[-1].email['personal'].append("cris@gmail.com")


    for cliente in clientes:  
        archivo = open(carpeta+"/"+cliente.idcliente + ".json", 'w')  # Abrimos el archivo usando el id del cliente
        json.dump(cliente.to_dict(), archivo, indent=4)  # Convertimos el cliente a dict y lo guardamos en el archivo
        archivo.close()  # Cerramos el archivo
