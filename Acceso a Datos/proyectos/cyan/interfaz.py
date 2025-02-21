import tkinter as tk
from tkinter import messagebox
import subprocess
import json

# Ruta del ejecutable (ajustar si es necesario)
RUTA_PROGRAMA = r"C:\xampp\htdocs\Acceso a Datos\cyan\miPrograma.exe"
NOMBRE_TABLA = "productos"  # Nombre de la tabla


##  Inserta un producto en la base de datos.
def insertar_producto():
    nombre = entrada_nombre.get().strip()
    precio = entrada_precio.get().strip()
    marca = entrada_marca.get().strip()

    if not nombre or not precio or not marca:
        messagebox.showwarning("Error", "Todos los campos son obligatorios.")
        return

    try:
        # Crear un JSON con los datos
        datos_producto = json.dumps({"nombre": nombre, "precio": int(precio), "marca": marca})

        # Ejecutar el programa externo para insertar datos
        resultado = subprocess.run(
            [RUTA_PROGRAMA, NOMBRE_TABLA, "insertar", datos_producto],
            capture_output=True,
            text=True
        )

        if resultado.returncode != 0:
            messagebox.showerror("Error al insertar", resultado.stderr)
        else:
            messagebox.showinfo("Éxito", "Producto insertado correctamente.")
            limpiar_campos()  # Limpiar los campos tras insertar

    except ValueError:
        messagebox.showerror("Error", "El precio debe ser un número.")
    except Exception as e:
        messagebox.showerror("Error", f"Error al ejecutar el programa:\n{e}")

## Recupera todos los productos y los muestra en la interfaz.
def seleccionar_productos():
    try:
        resultado = subprocess.run(
            [RUTA_PROGRAMA, NOMBRE_TABLA, "seleccionar"],
            capture_output=True,
            text=True
        )

        if resultado.returncode != 0:
            messagebox.showerror("Error al recuperar", resultado.stderr)
        else:
            salida_texto.delete("1.0", tk.END)              # Limpiar antes de mostrar nuevos datos
            salida_texto.insert(tk.END, resultado.stdout)   # Mostrar datos

    except Exception as e:
        messagebox.showerror("Error", f"Error al ejecutar el programa:\n{e}")
## Limpia los campos de entrada.
def limpiar_campos():
    entrada_nombre.delete(0, tk.END)
    entrada_precio.delete(0, tk.END)
    entrada_marca.delete(0, tk.END)

# Crear la ventana principal
ventana = tk.Tk()
ventana.title("Gestión de Productos")
ventana.geometry("500x400")

# Etiqueta y campos de entrada
tk.Label(ventana, text="Nombre:", font=("Arial", 10)).pack(pady=2)
entrada_nombre = tk.Entry(ventana, width=40)
entrada_nombre.pack(pady=2)

tk.Label(ventana, text="Precio:", font=("Arial", 10)).pack(pady=2)
entrada_precio = tk.Entry(ventana, width=40)
entrada_precio.pack(pady=2)

tk.Label(ventana, text="Marca:", font=("Arial", 10)).pack(pady=2)
entrada_marca = tk.Entry(ventana, width=40)
entrada_marca.pack(pady=2)

# Botón para insertar producto
boton_insertar = tk.Button(ventana, text="Insertar Producto", command=insertar_producto, bg="green", fg="white")
boton_insertar.pack(pady=5)

# Botón para mostrar productos
boton_seleccionar = tk.Button(ventana, text="Mostrar Productos", command=seleccionar_productos, bg="blue", fg="white")
boton_seleccionar.pack(pady=5)

# Área de salida para mostrar los productos
tk.Label(ventana, text="Lista de Productos:", font=("Arial", 12)).pack(pady=5)
salida_texto = tk.Text(ventana, height=10, width=50, bg="lightgray")
salida_texto.pack(pady=5)

# Ejecutar la interfaz gráfica
ventana.mainloop()
