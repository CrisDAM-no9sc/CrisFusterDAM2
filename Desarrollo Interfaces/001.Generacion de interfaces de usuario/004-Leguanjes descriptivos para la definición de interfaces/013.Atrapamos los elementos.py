import xml.etree.ElementTree as ET


arbol = ET.parsearbol = ET.parse("C:/xampp/htdocs/Desarrollo Interfaces/001.Generacion de interfaces de usuario/004-Leguanjes descriptivos para la definición de interfaces/011.Interfaz.xml")
raiz = arbol.getroot()

for elemento in raiz:
    if elemento.tag == "boton":
        print("tienes un boton")
    elif elemento.tag == "texto":
        print("tienes un texto")
    elif elemento.tag == "entrada":
        print("tienes una entrada")