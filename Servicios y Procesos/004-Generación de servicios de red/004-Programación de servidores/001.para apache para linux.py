# permite ejecutar comandos del sistema operativo como si los estuvieramos escribiendo directamente en el terminal
#es util para interactuar con el sitema desde python
import subprocess

def stop_apache():
    try:
        subprocess.run([
            "sudo",                 ## comando para ejecutar el siguiente con privilegios de superusuario
            "systemctl",            ## herramienta que controla los servicios del sistema 
            "stop",                 ## le indicamo que queremos detener el servicio
            "apache2"],             ## y le indicamos el nombre del servicio
            check=True)             ## lanzar una excepcion si el comando falla (codigo de salida distino a 0)
        
        print("El servidor Apache se detuvo exitosamente.")

    except subprocess.CalledProcessError: 
        print("No se pudo detener el servidor Apache.")


if __name__ == "__main__":
    stop_apache()