import subprocess

def stop_apache():

    try:
        # Ruta al ejecutable de Apache en tu instalación de XAMPP
        apache_bin_path = r"C:\xampp\apache\bin\httpd.exe"
        
        # Ejecuta el comando 'httpd.exe -k stop' para detener el servidor Apache
        subprocess.run(
            [apache_bin_path, "-k", "stop"], 
            check=True  # Lanza una excepción si el comando falla
        )
        
        # Mensaje de éxito si el comando se ejecuta correctamente
        print("Apache server stopped successfully.")
    except subprocess.CalledProcessError:
        # Mensaje de error si el comando falla
        print("Failed to stop Apache server.")

# Si ejecutamos el script directamente, llamamos a la función
if __name__ == "__main__":
    stop_apache()
