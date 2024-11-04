import json
import os
# Importamos errno para manejar errores relacionados con el sistema de archivos
import errno
import tkinter as tk



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

carpeta = "basededatos"
# Variable para controlar si continuamos o no
continuas = True
try:
    os.makedirs(carpeta)
except OSError as e:
    if e.errno == errno.EEXIST:
        print(f"La carpeta ya existe")
    elif e.errno == errno.EACCES:
        continuas = False
        print("Error de permisos en la carpeta - no puedo guardar")
    else:
        print("")

ventana = tk.Tk()
marco = tk.Frame(ventana,padx=20,pady=20)
marco.pack(padx=20,pady=20)

tk.Label(marco,text="Id cliente").pack(padx=10,pady=10)
tk.Entry(marco).pack(padx=10,pady=10)

tk.Label(marco,text="Nombre").pack(padx=10,pady=10)
tk.Entry(marco).pack(padx=10,pady=10)

tk.Label(marco,text="Apellidos").pack(padx=10,pady=10)
tk.Entry(marco).pack(padx=10,pady=10)

tk.Label(marco,text="Email Perosnal").pack(padx=10,pady=10)
tk.Entry(marco).pack(padx=10,pady=10)

tk.Label(marco,text="Email Profesional").pack(padx=10,pady=10)
tk.Entry(marco).pack(padx=10,pady=10)

tk.Button(marco,text="Guadar cliente",command=guardarCliente).pack(padx=10,pady=10)
tk.Button(marco,text="Guadar todos los cliente a base de datos",command=guardarDB).pack(padx=10,pady=10)
ventana.mainloop()

##for cliente in clientes:
##    archivo = open(carpeta+"/"+cliente.idcliente+".json", 'w')
##    json.dump(cliente.to_dict(),archivo, indent=4)
##    archivo archivo.close() 
