import tkinter as tk
from tkinter import filedialog

ventana = tk.Tk()

marco = tk.Frame(ventana)
marco.pack(padx=10,pady=10)
#definir una vvariable para almacenar el valor del ancho 
anchura = tk.IntVar()
##funcion para seleccionar un archivo
def seleccionaEntrada():
    ruta = filedialog.askopenfilename()
    print("La ruta de tu video es:",ruta)

selector_video_entrada = tk.Button(
    marco,
    text="Selecciona el video de entrada",
    command=seleccionaEntrada
    )

selector_video_entrada.pack(padx=50,pady=20);
##aqui hacemos una etiqueta para quye el usuariuo seleccione la anchura de salida 
tk.Label(
    marco,
    text="Indica la anchura de salida que quieres"
    ).pack(padx=50,pady=20);
##campo para la entrada al valor de la anchura 
#try.entry es el widget de entrada de texto
tk.Entry(
    marco,
    ##aqui se guaradara la variable anchura que es un InVar 
    #Cualquier campo se actualizara automaticamente anchura
    textvariable=anchura).pack(padx=50,pady=20);

ventana.mainloop()