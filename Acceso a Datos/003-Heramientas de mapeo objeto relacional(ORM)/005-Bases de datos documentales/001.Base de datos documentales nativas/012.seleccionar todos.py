from pymongo import MongoClient

cliente = MongoClient("mongodb://localhost:27017")          
basededatos = cliente["miempresa"]                          
coleccion = basededatos["clientes"]                         

resultado = coleccion.find()   

for documento in resultado:
    print(documento)