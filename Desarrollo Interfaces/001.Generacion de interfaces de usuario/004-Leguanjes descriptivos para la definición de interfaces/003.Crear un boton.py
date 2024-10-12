import tkinter as tk 

ventana = tk.Tk()
##creamos un boton
##5x5 es el interior y el 20x20 es el exterior
tk.Button(ventana,text="Pulsame",padx=5, pady=5).pack(padx=20, pady=20)
ventana.mainloop()