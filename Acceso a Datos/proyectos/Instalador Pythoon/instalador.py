import tkinter as tk
from pantallas import cargar_configuracion, mostrar_bienvenida, configurar_estilos

def main():
    root = tk.Tk()
    root.title("Instalador")
    root.geometry("800x600")  # Ajustar al tamaño usado en la interfaz
    configurar_estilos()
    cargar_configuracion()
    mostrar_bienvenida(root)  # Llama a la pantalla de bienvenida
    root.mainloop()

if __name__ == '__main__':
    main()
