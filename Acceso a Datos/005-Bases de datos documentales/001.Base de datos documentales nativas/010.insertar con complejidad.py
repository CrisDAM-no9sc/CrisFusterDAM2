from pymongo import MongoClient

cliente = MongoClient("mongodb://localhost:27017")          
basededatos = cliente["miempresa"]                          
coleccion = basededatos["clientes"]                         

cliente = {
    "nombre": "Gomzalo", 
    "apellidos": "Maria Jesus",
    "email" : ['gon@personal.com', 'gon@empresa.com']
    }
 
resultado = coleccion.insert_one(cliente)   

if resultado:
    print("Resultado:", resultado)
else:
    print("Nada que mostrar")