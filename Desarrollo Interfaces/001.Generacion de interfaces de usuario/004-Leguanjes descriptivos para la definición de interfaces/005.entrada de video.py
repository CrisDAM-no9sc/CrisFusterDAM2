import tkinter as tk 
##abre cuadros de dialogo para seleccionar archivos del sistema
from tkinter import filedialog 

ventana = tk.Tk()

marco = tk.Frame(ventana)
marco.pack(padx=10, pady=10)
##funcion de seleccionar un archivo
def seleccionaEntrada():
    ##aqui se almacena en ruta el archivo que hemos metido
    ruta = filedialog.askopenfilename()
    print("La ruta de tu video es:", ruta)

##aqui vamos a poner el boton de seleccionar video o archivos del ordenador 
selector_video_entrada = tk.Button(
    marco,
    text="Selecciona el video de entrada",
    command=seleccionaEntrada
    )
selector_video_entrada.pack(padx=50,pady=50);

ventana.mainloop()