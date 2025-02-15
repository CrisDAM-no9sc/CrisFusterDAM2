import subprocess
import time

def ejecutar_script():
    
    ### Ejecuta un script en un bucle infinito con una pausa de 1 segundo entre ejecuciones.
    ### Se detiene si el usuario presiona Ctrl+C o si hay un error en la ejecución.
    
    ruta_script = "tomato.py"  # Nombre del script que se ejecutará

    try:
        while True:
            # Ejecutar el script con Python
            subprocess.run(["python", ruta_script], check=True)
            time.sleep(1)  # Esperar 1 segundo antes de la siguiente ejecución
    except KeyboardInterrupt:
        print("Ejecución detenida por el usuario.")
    except subprocess.CalledProcessError as error:
        print(f"⚠ Error en la ejecución del script: {error}")

if __name__ == "__main__":
    ejecutar_script()
