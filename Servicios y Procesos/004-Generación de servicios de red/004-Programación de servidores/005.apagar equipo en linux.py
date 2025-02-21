import subprocess

def shutdown_machine():
    try:
         # Apagar la máquina inmediatamente (con el comando 'shutdown now')
        subprocess.run([
            "sudo",                         ## ejecuta el comando con privilegios de administardor 
            "shutdown",                     ## comando para apagar y reinicar 
            "now"],                         ## especificamos que queremos que el apagado sea inmediato
            check=True)
        
        
        print("Shutting down the machine...")
    except subprocess.CalledProcessError as e:
        print(f"Failed to shut down the machine: {e}")

if __name__ == "__main__":
    shutdown_machine()