import tkinter as tk                    
from tkinter import filedialog 
 # Permite ejecutar comandos del sistema (como FFmpeg)         
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
    command = "ffmpeg -i '"+entrada+"' -vf scale="+anchura.get()+":"+altura.get()+" '"+salida+"'"
    print(command)
    try:
        result = subprocess.run(command, capture_output=True, text=True)
        print("FFmpeg output:", result.stdout)
        print("FFmpeg error (if any):", result.stderr)
        
        if result.returncode == 0:
            print("Video procesado con éxito")
        else:
            print("Error en el procesamiento del video")
    except Exception as e:
        print("Error ejecutando el comando:", e)

# Función para seleccionar el archivo de video de entrada
def seleccionaEntrada():
    global entrada
    ##seleccionar un archivo que esta en el ordenador
    entrada = filedialog.askopenfilename() 

# Función para seleccionar la ubicación y nombre del archivo de salida
def seleccionaSalida():
    global salida
    ##seleccionar donde guaradar el video
    salida = filedialog.asksaveasfilename() 

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
     # Enlaza con la variable anchura
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
    # Enlaza con la variable altura
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
