 # Importa la biblioteca tkinter para crear la interfaz gráfica
import tkinter as tk
# Importa el módulo filedialog de tkinter para abrir cuadros de diálogo de selección de archivos                   
from tkinter import filedialog    
# Importa el módulo subprocess para ejecutar comandos del sistema, como 'ffmpeg'
import subprocess                        


ventana = tk.Tk()


marco = tk.Frame(ventana)
marco.pack(padx=10, pady=10)            

# Variables donde se guardan (anchura y altura)
anchura = tk.StringVar()                 
altura = tk.StringVar()                  

# Variables globales para almacenar las rutas de los archivos de entrada y salida
salida = None                            
entrada = None                           

# Función que se ejecuta al presionar el botón "Comenzamos"
def procesar():
    print("Vamos a por ello")            
    #comando ffmpeg utilizando las variables de entrada, salida, anchura y altura
    command = "ffmpeg -i '"+entrada+"' -vf scale="+anchura.get()+":"+altura.get()+" '"+salida+"'"
    print(command)                       # Imprime el comando generado en la consola (solo para verificar)
    # Ejecuta el comando utilizando subprocess
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    # Imprime la salida del comando ffmpeg en la consola (si hay errores o resultados)
    print("Output:", result.stdout)

# Se ejecuta cuando apretemos el boton de seleccionar 
def seleccionaEntrada():
    global entrada                          # Usamos entrada para guardar la ruta
    entrada = filedialog.askopenfilename()  # seleccionar el archivo de entrada (video)

# Función que se ejecuta al prresionar el botón para seleccionar la ubicación del video de salida
def seleccionaSalida():
    global salida                            # Usamos salida para almacenar la ruta seleccionada
    salida = filedialog.asksaveasfilename() # Abre para seleccionar la ubicación y nombre del archivo de salida

# Crea un botón para seleccionar el archivo de video de entrada
selector_video_entrada = tk.Button(
    marco,
    text="Selecciona el video de entrada",  
    command=seleccionaEntrada               
)
selector_video_entrada.pack(padx=50, pady=20)  # Empaqueta el botón dentro del marco con un relleno de 50 píxeles

# Crea una etiqueta que indica al usuario que debe ingresar la anchura de salida
tk.Label(
    marco,
    text="Indica la anchura de salida que quieres"  
).pack(padx=50, pady=20)

# Crea un campo de entrada para ingresar la anchura de salida
tk.Entry(
    marco,
    textvariable=anchura                       # El valor se guaradara en la variable 'anchura'
).pack(padx=50, pady=20)

# Crea una etiqueta ingresar la altura de salida
tk.Label(
    marco,
    text="Indica la altura de salida que quieres" 
).pack(padx=50, pady=20)

# Crea un campo de entrada ingresar la altura de salida
tk.Entry(
    marco,
    textvariable=altura                        # El valor se guarda en la variable 'altura'
).pack(padx=50, pady=20)

# Crea un botón para seleccionar la ubicación y el nombre del archivo de salida
selector_video_salida = tk.Button(
    marco,
    text="Selecciona el video de salida",       
    command=seleccionaSalida                    
)
selector_video_salida.pack(padx=50, pady=20)    

# Crea un botón para iniciar el proceso de redimensionamiento del video
tk.Button(
    marco,
    text="Comenzamos",                          
    command=procesar                           
).pack(padx=50, pady=20)

# Inicia el bucle principal de la ventana, manteniéndola abierta y a la espera de eventos
ventana.mainloop()
