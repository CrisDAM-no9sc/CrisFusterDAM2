class cliente:
    def __init__(self):
        self.nombre = None
        self.apellidos = None
        #self.email es un diccionario que tiene dos claves: "personal" y "profesional"
        #Cada una apunta a una lista vacía ([]).
        self.email = {"personanl":[],"profesional":[]}


class Producto:
    def __init__(self):
        self.nombre = None
        self.precio = None
        self.cantidad = None
        self.dimensiones = {"x":None,"y":None,"z":None}

