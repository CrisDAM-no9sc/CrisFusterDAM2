import xml.etree.ElementTree as ET
import tkinter as tk

ventana = tk.Tk()

arbol = ET.parsearbol = ET.parse("C:/xampp/htdocs/Desarrollo Interfaces/001.Generacion de interfaces de usuario/004-Leguanjes descriptivos para la definición de interfaces/011.Interfaz.xml")
raiz = arbol.getroot()

for elemento in raiz:
    if elemento.tag == "boton":
        tk.Button(ventana,text=elemento.text).pack(padx=20,pady=20)
    elif elemento.tag == "texto":
        tk.Label(ventana,text=elemento.text).pack(padx=20,pady=20)
    elif elemento.tag == "entrada":
        tk.Entry(ventana).pack(padx=20,pady=20)

ventana.mainloop()