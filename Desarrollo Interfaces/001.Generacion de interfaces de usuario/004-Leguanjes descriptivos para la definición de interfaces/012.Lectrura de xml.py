import xml.etree.ElementTree as ET


arbol = ET.parsearbol = ET.parse("C:/xampp/htdocs/Desarrollo Interfaces/001.Generacion de interfaces de usuario/004-Leguanjes descriptivos para la definición de interfaces/011.Interfaz.xml")
raiz = arbol.getroot()

print(raiz)

for elemento in raiz:
    print(elemento)