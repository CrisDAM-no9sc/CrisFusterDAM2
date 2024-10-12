import json

class Clientes:
    def __init__(self):
        self.idcliente = None
        self.nombre = None
        self.apellidos = None
        #self.email es un diccionario que tiene dos claves: "personal" y "profesional"
        #Cada una apunta a una lista vacía ([]).
        self.email = {"personal":[],"profesional":[]}
    # Método to_dict: Convierte los atributos de la instancia de Clientes en un diccionario    
    def to_dict(self):
        return{
            "nombre":self.nombre,
            "apellidos":self.apellidos,
            "email": self.email
        }


class Producto:
    def __init__(self):
        self.nombre = None
        self.precio = None
        self.cantidad = None
        self.dimensiones = {"x":None,"y":None,"z":None}

clientes = []
clientes.append(Clientes())
# acceder a elementos desde el final de una lista
clientes[-1].idcliente = "0001"
clientes[-1].nombre = "Manuel"
clientes[-1].apellidos = "Gorrion García"

clientes[-1].email['profesional'].append("Manuelempresa@gmail.com")
clientes[-1].email['profesional'].append("empresa2@gmail.com")
clientes[-1].email['personal'].append("manuelgorrion@gmail.com")

print(clientes[-1].email)


archivo = open(clientes[-1].idcliente+".json",'w')
#aqui estamos guardando en un archivo json la informacion de un cliente
# Usamos el método to_dict para convertir el cliente en un diccionario
json.dump(clientes[-1].to_dict(),archivo,indent=4)
archivo.close()
