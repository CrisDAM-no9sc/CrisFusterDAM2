import json

class Clientes:
    def __init__(self):
        self.nombre = None
        self.apellidos = None
        #self.email es un diccionario que tiene dos claves: "personal" y "profesional"
        #Cada una apunta a una lista vacía ([]).
        self.email = {"personal":[],"profesional":[]}


class Producto:
    def __init__(self):
        self.nombre = None
        self.precio = None
        self.cantidad = None
        self.dimensiones = {"x":None,"y":None,"z":None}

clientes = []
clientes.append(Clientes())
# acceder a elementos desde el final de una lista
clientes[-1].nombre = "Manuel"
clientes[-1].apellidos = "Gorrion García"

clientes[-1].email['profesional'].append("Manuelempresa@gmail.com")
clientes[-1].email['profesional'].append("empresa2@gmail.com")
clientes[-1].email['personal'].append("manuelgorrion@gmail.com")

print(clientes[-1].email)
## aqui vamos a trabajar con archivo Json

archivo = open("clientes.json",'w')
json.dump(clientes,archivo,indent=4)##Este parámetro especifica el número de espacios ,aplicar sangrías
archivo.close()
