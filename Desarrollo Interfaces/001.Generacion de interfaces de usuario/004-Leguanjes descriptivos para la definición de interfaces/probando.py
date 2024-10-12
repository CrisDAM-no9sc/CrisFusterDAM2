import tkinter as tk                    
from tkinter import filedialog
import subprocess                       


ventana = tk.Tk()

# Crea un marco para organizar los widgets dentro de la ventana
marco = tk.Frame(ventana)
marco.pack(padx=10, pady=10)            

# Variables para almacenar anchura, altura, entrada y salida
anchura = tk.StringVar()                 # Variable para la anchura del video de salida
altura = tk.StringVar()                  # Variable para la altura del video de salida
salida = None                            # Ruta del archivo de salida
entrada = None                           # Ruta del archivo de entrada

# Función para procesar el video con FFmpeg
def procesar():
    print("Vamos a por ello")
    command = [
        "C:/ffmpeg/bin/ffmpeg.exe",  # Usando la ruta completa a ffmpeg.exe
        "-i", entrada,
        "-vf", f"scale={anchura.get()}:{altura.get()}",
        salida
    ]
    print("Comando FFmpeg:", command)  # Muestra el comando en la consola

    try:
        # Ejecuta el comando y captura la salida
        result = subprocess.run(command, capture_output=True, text=True)
        print("FFmpeg output:", result.stdout)       # Muestra la salida estándar de FFmpeg
        print("FFmpeg error (if any):", result.stderr) # Muestra errores si los hay

        # Verifica si el comando se ejecutó con éxito
        if result.returncode == 0:
            print("Video procesado con éxito")
        else:
            print("Error en el procesamiento del video")
    except Exception as e:
        print("Error ejecutando el comando:", e)
        
# Función para seleccionar el archivo de video de entrada
def seleccionaEntrada():
    global entrada
    entrada = filedialog.askopenfilename() 
    print("Archivo de entrada seleccionado:", entrada)

# Función para seleccionar la ubicación y nombre del archivo de salida
def seleccionaSalida():
    global salida
    salida = filedialog.asksaveasfilename() 
    print("Archivo de salida seleccionado:", salida)

# Botón para seleccionar el video de entrada
selector_video_entrada = tk.Button(
    marco,
    text="Selecciona el video de entrada",  
    command=seleccionaEntrada               
)
selector_video_entrada.pack(padx=50, pady=20)  

# Etiqueta para la anchura de salida
tk.Label(
    marco,
    text="Indica la anchura de salida que quieres" 
).pack(padx=50, pady=20)

# Campo de entrada para la anchura del video
tk.Entry(
    marco,
    textvariable=anchura                       
).pack(padx=50, pady=20)

# Etiqueta para la altura de salida
tk.Label(
    marco,
    text="Indica la altura de salida que quieres"  
).pack(padx=50, pady=20)

# Campo de entrada para la altura del video
tk.Entry(
    marco,
    textvariable=altura                          
).pack(padx=50, pady=20)

# Botón para seleccionar el archivo de video de salida
selector_video_salida = tk.Button(
    marco,
    text="Selecciona el video de salida",         
    command=seleccionaSalida                     
)
selector_video_salida.pack(padx=50, pady=20)      

# Botón para iniciar el procesamiento del video
tk.Button(
    marco,
    text="Comenzamos",                            
    command=procesar                             
).pack(padx=50, pady=20)


ventana.mainloop()
