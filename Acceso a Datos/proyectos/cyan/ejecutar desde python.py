#!/usr/bin/env python3

import subprocess  # Importamos el módulo para ejecutar comandos externos

def main():
    """
    Este programa ejecuta un sistema externo (cyan.out) que maneja una base de datos en archivos JSON.
    Primero inserta un cliente en la tabla "clientes" y luego recupera todos los registros.
    """

    # Datos en formato JSON que queremos insertar
    json_data = '{"nombre":"Lavadora","precio":250,"marca":"Samsung"}'  # Cambiado a español

    print("Insertando datos en la base de datos...")

    # Ejecutar el comando para insertar datos en la tabla 'clientes'
    insert_proc = subprocess.run(
        [r"C:\xampp\htdocs\Acceso a Datos\cyan\miPrograma.exe", "productos", "insertar", json_data], 
        capture_output=True,  # Captura la salida del proceso
        text=True  # Convierte la salida a texto en lugar de bytes
    )

    # Verificar si la inserción fue exitosa
    if insert_proc.returncode != 0:
        print("Error al insertar datos:", insert_proc.stderr)  # Mostrar error en caso de fallo
        return
    else:
        print(insert_proc.stdout)  # Mostrar mensaje de éxito

    print("\nRecuperando datos de la base de datos...")

    # Ejecutar el comando para seleccionar (listar) los datos de la tabla 'clientes'
    select_proc = subprocess.run(
        ["C:/xampp/htdocs/Acceso a Datos/cyan/miPrograma.exe", "productos", "seleccionar"], 
        capture_output=True,  # Captura la salida del proceso
        text=True  # Convierte la salida a texto
    )

    # Verificar si la recuperación fue exitosa
    if select_proc.returncode != 0:
        print("Error al recuperar datos:", select_proc.stderr)  # Mostrar error en caso de fallo
        return
    else:
        print(select_proc.stdout)  # Mostrar los datos recuperados

# Punto de entrada del programa
if __name__ == "__main__":
    main()
