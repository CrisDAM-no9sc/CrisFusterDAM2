import tkinter as tk 

ventana = tk.Tk()
##creamos un boton
##5x5 es el interior y el 20x20 es el exterior

def diHola():
    print("Hola")
##para hacer click utilizaremos el command llamando a la funcion
tk.Button(ventana,text="Pulsame",padx=15, pady=15,command=diHola).pack(padx=20, pady=20)
ventana.mainloop()