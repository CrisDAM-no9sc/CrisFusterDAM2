import socket
import json
import os
import sys
import tkinter as tk
from tkinter import ttk, messagebox

TOKEN_SECRETO = "clave_segura"
CONFIG_PATH = "client_config.json"

def cargar_configuracion():
    if not os.path.exists(CONFIG_PATH):
        messagebox.showerror("Error", f"Archivo de configuración '{CONFIG_PATH}' no encontrado.")
        sys.exit(1)
    try:
        with open(CONFIG_PATH, 'r') as archivo:
            config = json.load(archivo)
            return config
    except json.JSONDecodeError as e:
        messagebox.showerror("Error", f"Error en la configuración: {e}")
        sys.exit(1)

def enviar_datos(accion, usuario=None, correo=None):
    config = cargar_configuracion()
    HOST = config['servidor_host']
    PUERTO = config['servidor_puerto']
    
    datos = {"accion": accion, "token": TOKEN_SECRETO}
    if usuario and correo:
        datos.update({"usuario": usuario, "correo": correo})
    
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as cliente:
            cliente.connect((HOST, PUERTO))
            cliente.sendall(json.dumps(datos).encode('utf-8'))
            respuesta = json.loads(cliente.recv(4096).decode('utf-8'))
            return respuesta
    except Exception as e:
        messagebox.showerror("Error", f"Error de conexión: {e}")
        return None

def registrar_usuario():
    usuario = entry_usuario.get().strip()
    correo = entry_correo.get().strip()
    
    if not usuario or not correo:
        messagebox.showwarning("Advertencia", "Por favor ingresa todos los datos.")
        return
    
    respuesta = enviar_datos("registrar", usuario, correo)
    if respuesta and respuesta.get("estado") == "exito":
        messagebox.showinfo("Registro", respuesta.get("mensaje"))
        entry_usuario.delete(0, tk.END)
        entry_correo.delete(0, tk.END)
    else:
        messagebox.showerror("Error", respuesta.get("mensaje"))

def listar_usuarios():
    respuesta = enviar_datos("listar")
    if respuesta and respuesta.get("estado") == "exito":
        registros_text.set("\n".join(respuesta.get("datos", [])))
    else:
        messagebox.showerror("Error", respuesta.get("mensaje"))

# Configurar la interfaz gráfica
root = tk.Tk()
root.title("Registro de Usuario")
root.geometry("400x300")
root.configure(bg="#f0f0f0")

frame_form = tk.Frame(root, bg="#f0f0f0")
frame_form.pack(pady=10)

label_usuario = tk.Label(frame_form, text="Usuario:", bg="#f0f0f0")
label_usuario.grid(row=0, column=0, sticky=tk.E, padx=5, pady=5)
entry_usuario = ttk.Entry(frame_form, width=30)
entry_usuario.grid(row=0, column=1, padx=5, pady=5)

label_correo = tk.Label(frame_form, text="Correo:", bg="#f0f0f0")
label_correo.grid(row=1, column=0, sticky=tk.E, padx=5, pady=5)
entry_correo = ttk.Entry(frame_form, width=30)
entry_correo.grid(row=1, column=1, padx=5, pady=5)

btn_registrar = ttk.Button(root, text="Registrar", command=registrar_usuario)
btn_registrar.pack(pady=5)

btn_listar = ttk.Button(root, text="Listar Usuarios", command=listar_usuarios)
btn_listar.pack(pady=5)

registros_text = tk.StringVar()
label_registros = tk.Label(root, textvariable=registros_text, bg="#f0f0f0", wraplength=380, justify="left")
label_registros.pack(pady=5)

root.mainloop()