import subprocess

def stop_apache_windows():
    try:
        # Detener el servicio de Apache en Windows
        subprocess.run([
            "sc",                                   ## es el comando para el administrador de servicios
            "stop",                                 ## indicamos que queremos detenerlo
            "Apache2.4"],                           ## nombre tipico del servicio de apache en windows
            check=True,                             ## lanza una excepcion si el comando falla
            shell=True)                             ## es necesario para ejecutar comandos del sistema correctamente
        
        print("Apache server stopped successfully.")
        
    except subprocess.CalledProcessError:
        print("Failed to stop Apache server.")

if __name__ == "__main__":
    stop_apache_windows()