import subprocess

def shutdown_machine():
    try:
        # Apagar la máquina inmediatamente (con el comando 'shutdown now')
        subprocess.run([
            "shutdown",                         ## comando para apagar y reiniciar
            "/s",                               ## indica que el sistema debe apagarse 
            "/t","0"],                          ## especifica el tiempo de espera en segundos
            check=True)
        print("Shutting down the machine...")
    except subprocess.CalledProcessError as e:
        print(f"Failed to shut down the machine: {e}")

if __name__ == "__main__":
    shutdown_machine()