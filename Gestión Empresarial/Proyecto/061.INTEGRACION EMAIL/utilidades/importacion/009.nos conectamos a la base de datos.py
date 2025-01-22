import pandas as pd
import mysql.connector

# Conexión a la base de datos
conexion = mysql.connector.connect(
    host="localhost",
    database="crismon1",
    user="crismon1",
    password="crismon1"  
)

cursor = conexion.cursor()

# Leemos el archivo de Excel
contenido = pd.read_excel(r"C:\xampp\htdocs\Gestión Empresarial\Proyecto\022.Utilidades\utilidades\importacion\clientes.xlsx")

# Lo convertimos a diccionario de Python
diccionario = contenido.to_dict()
# Mostrar el diccionario
print(diccionario)  
# Verificar acceso a los datos
print(diccionario['nombre'][0])  

# Iterar sobre cada fila
# Cambiar 0,2 a la longitud del diccionario
for i in range(len(diccionario['nombre'])):  
    # Crear el inicio de la petición de insert
    peticion = 'INSERT INTO clientes VALUES (NULL,'  
    # Recorrer las claves del diccionario
    for clave in diccionario:  
        # Mostrar contenido
        print(clave, diccionario[clave][i])  
        # Añadir al insert
        peticion += '"' + str(diccionario[clave][i]) + '",'  
    # Quitar la última coma
    peticion = peticion[:-1] 
    # Cerrar la petición 
    peticion += ')'  
    # Imprimir el error
    print(f"Inserting values: {peticion}")  
    try:
        # Ejecutar la consulta
        cursor.execute(peticion) 
        # Confirmar cambios 
        conexion.commit()  
    except mysql.connector.Error as err:
        # Imprimir el error
        print(f"Error: {err}")  

# Cerrar la conexión
cursor.close()
conexion.close()
