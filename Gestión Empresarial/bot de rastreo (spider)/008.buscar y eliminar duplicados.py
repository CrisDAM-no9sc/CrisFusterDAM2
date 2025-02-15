import sqlite3

# Nombre del archivo de base de datos
BASE_DE_DATOS = 'targets.db'


############################### FUNCION ELIMINAR DUPLICADOS EN LA TABLA #########################
### Borra todas las demás filas con el mismo correo (rowid != primer_id
### Muestra por pantalla cuántos registros duplicados se han eliminado.

def buscar_y_eliminar_duplicados(conexion):
    cursor = conexion.cursor()

    # Paso 1: Buscar correos duplicados
    print("Buscando correos duplicados...")
    cursor.execute('''
        SELECT email, COUNT(*) as conteo
        FROM emails
        GROUP BY email
        HAVING conteo > 1
    ''')
    duplicados = cursor.fetchall()

    if not duplicados:
        print("No se han encontrado correos duplicados.")
        return

    print(f"Se han encontrado {len(duplicados)} correos con duplicados.")

    # Paso 2: Eliminar duplicados, manteniendo solo una ocurrencia
    for email, conteo in duplicados:
        print(f"Procesando correo: {email} (aparece {conteo} veces)")

        # Buscamos la primera ocurrencia de este correo
        cursor.execute('''
            SELECT MIN(rowid)
            FROM emails
            WHERE email = ?
        ''', (email,))
        primer_id = cursor.fetchone()[0]

        # Eliminamos todas las demás ocurrencias del mismo correo
        cursor.execute('''
            DELETE FROM emails
            WHERE email = ? AND rowid != ?
        ''', (email, primer_id))

        print(f"Se han eliminado {conteo - 1} duplicado(s) para el correo: {email}")

    # Confirmamos los cambios en la base de datos
    conexion.commit()
    print("Eliminación de duplicados completada.")

def main():
    # Conectamos a la base de datos
    conexion = sqlite3.connect(BASE_DE_DATOS)

    # Ejecutamos la función para buscar y eliminar duplicados
    buscar_y_eliminar_duplicados(conexion)

    # Cerramos la conexión con la base de datos
    conexion.close()
    print("Conexión a la base de datos cerrada.")

if __name__ == "__main__":
    main()
