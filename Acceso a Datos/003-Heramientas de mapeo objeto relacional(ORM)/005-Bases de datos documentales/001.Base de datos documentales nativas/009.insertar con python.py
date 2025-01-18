from pymongo import MongoClient

cliente = MongoClient("mongodb://localhost:27017")     
basededatos = cliente["miempresa"]                        
coleccion = basededatos["clientes"]                     

cliente = {"nombre": "Carlos", "apellidos": "Maria Jesus"}
 
resultado = coleccion.insert_one(cliente)   

if resultado:
    print("Resultado:", resultado)
else:
    print("No se encontró ningún documento que coincida con el criterio.")