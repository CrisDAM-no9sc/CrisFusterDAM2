from pymongo import MongoClient

cliente = MongoClient("mongodb://localhost:27017")    
basededatos = cliente["miempresa"]                       
coleccion = basededatos["clientes"]                 

resultado = coleccion.find_one({"nombre": "Maria"})     

if resultado:
    print("Documento encontrado:", resultado)
else:
    print("No se encontró ningún documento que coincida con el criterio.")