from pymongo import MongoClient

# Conexión a MongoDB
cliente = MongoClient("mongodb://localhost:27017")

# Acceso a la base de datos y colección
basededatos = cliente["miempresa"]
coleccion = basededatos["clientes"]

# Documento a insertar
cliente = {
    "nombre": "antonio", 
    "apellidos": "Gonzales Casas",
    "email": [
        {
            'tipo': 'personal',
            'email': 'antonio@personal.com'
        },
        {
            'tipo': 'empresa',
            'email': 'antonio@empresa.com'
        } 
    ]
}

# Insertar el documento en la colección
resultado = coleccion.insert_one(cliente)

if resultado:
    print("Resultado: Documento insertado con ID:", resultado.inserted_id)
else:
    print("Nada que mostrar")
