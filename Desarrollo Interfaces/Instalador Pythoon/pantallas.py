import json
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk
import os
import shutil

# Variable global para almacenar la configuración cargada
configuracion = None

######################################### DEFINICIÓN DE ESTILOS ##############################################
def configurar_estilos():
    estilo = ttk.Style()
    estilo.theme_use("clam")
    # Actualizamos el estilo para botones personalizados usando nuestros colores:
    estilo.configure("Custom.TButton",
                     font=("Helvetica", 12, "bold"),
                     foreground="#575f5e",  # color de texto
                     background="#d0e8e4",  # fondo externo
                     padding=6)
    estilo.map("Custom.TButton",
               background=[("active", "#bdd0cd")])
    # Actualizar etiquetas personalizadas (si las usas con ttk)
    estilo.configure("Custom.TLabel",
                     font=("Helvetica", 12),
                     foreground="#575f5e",
                     background="#d0e8e4")

######################################### CONFIGURAR INTERFAZ ##############################################
def configurar_interfaz(root):
    # Establecer fondo general y tamaño
    root.title("Instalador de Aplicación")
    root.geometry("800x600")
    root.resizable(False, False)
    root.configure(bg="#d0e8e4")  # Fondo general
       
    # Cargar y colocar la imagen de fondo (redimensionada)
    try:
        ruta_imagen = configuracion["welcome"]["image"]
        imagen = Image.open(ruta_imagen).resize((800, 600), Image.LANCZOS)
        imagen_tk = ImageTk.PhotoImage(imagen)
        fondo = tk.Label(root, image=imagen_tk)
        fondo.image = imagen_tk  # Conservar referencia
        fondo.place(x=0, y=0, relwidth=1, relheight=1)
    except Exception as e:
        print(f"Error al cargar la imagen de fondo: {e}")
        # Si falla, dejar el fondo general establecido

    # Creamos un contenedor para el contenido que tendrá el mismo fondo para armonizar
    contenedor = tk.Frame(root, bg="#d0e8e4")
    contenedor.place(relx=0, rely=0, relwidth=1, relheight=1)
    return contenedor

######################################### CARGA DEL ARCHIVO JSON ##############################################
def cargar_configuracion():
    global configuracion
    try:
        with open("configuracion.json", "r", encoding="utf-8") as f:
            configuracion = json.load(f)
        print("Configuración cargada:", configuracion)
    except Exception as e:
        print("Error al cargar la configuración:", e)
        configuracion = {}

######################################### PANTALLA BIENVENIDA ##############################################
def mostrar_bienvenida(root):
    cargar_configuracion()  # Cargar la configuración
    contenedor = configurar_interfaz(root)
    configurar_estilos()
    # Limpiar el contenedor (sin borrar el fondo)
    for widget in contenedor.winfo_children():
        widget.destroy()
    
    # Título de bienvenida
    etiqueta_titulo = tk.Label(contenedor, text=configuracion["welcome"]["title"],
                               font=("Helvetica", 24, "bold"),
                               bg="#d0e8e4", fg="#575f5e")
    etiqueta_titulo.place(relx=0.5, rely=0.15, anchor="center")
    
    # Imagen de bienvenida (puedes ajustar el tamaño según desees)
    try:
        ruta_imagen = configuracion["welcome"]["image"]
        imagen = Image.open(ruta_imagen).resize((700, 350), Image.LANCZOS)
        imagen_tk = ImageTk.PhotoImage(imagen)
        etiqueta_imagen = tk.Label(contenedor, image=imagen_tk, bd=2, relief="groove")
        etiqueta_imagen.image = imagen_tk
        etiqueta_imagen.place(relx=0.5, rely=0.45, anchor="center")
    except Exception as e:
        etiqueta_error = tk.Label(contenedor, text=f"Error al cargar la imagen: {e}",
                                  bg="#d0e8e4", fg="red")
        etiqueta_error.place(relx=0.5, rely=0.45, anchor="center")
    
    # Texto de bienvenida
    etiqueta_texto = tk.Label(contenedor, text=configuracion["welcome"]["text"],
                              wraplength=700, font=("Helvetica", 16),
                              bg="#d0e8e4", fg="#575f5e")
    etiqueta_texto.place(relx=0.5, rely=0.7, anchor="center")
    
    # Botón Siguiente con estilo personalizado
    boton_siguiente = ttk.Button(contenedor, text="Siguiente", style="Custom.TButton",
                                 command=lambda: mostrar_licencia(root))
    boton_siguiente.place(relx=0.5, rely=0.85, anchor="center")

######################################### PANTALLA LICENCIA ##############################################
def mostrar_licencia(root):
    contenedor = configurar_interfaz(root)
    for widget in contenedor.winfo_children():
        widget.destroy()
    
    # Contenedor con fondo secundario para la licencia
    frame_licencia = tk.Frame(contenedor, bg="#bdd0cd")
    frame_licencia.place(relx=0.5, rely=0.5, anchor="center", width=700, height=400)
    
    texto_licencia = tk.Text(frame_licencia, wrap="word", height=10, width=70,
                             font=("Helvetica", 12), bg="white", fg="#575f5e")
    texto_licencia.insert("1.0", configuracion["license"]["text"])
    texto_licencia.config(state="disabled")
    texto_licencia.pack(pady=20)
    
    variable_aceptacion = tk.IntVar()
    check_aceptacion = tk.Checkbutton(frame_licencia, text="Acepto los términos",
                                      variable=variable_aceptacion,
                                      font=("Helvetica", 12),
                                      bg="#bdd0cd", fg="#575f5e",
                                      activebackground="#bdd0cd", activeforeground="#575f5e")
    check_aceptacion.pack(pady=10)
    
    boton_siguiente = tk.Button(frame_licencia, text="Siguiente", state="disabled",
                                font=("Helvetica", 12, "bold"),
                                bg="#d0e8e4", fg="#575f5e",
                                command=lambda: mostrar_seleccion_componentes(root))
    boton_siguiente.pack(pady=20)
    
    def verificar_aceptacion(*args):
        if variable_aceptacion.get():
            boton_siguiente.config(state="normal")
        else:
            boton_siguiente.config(state="disabled")
    
    variable_aceptacion.trace("w", verificar_aceptacion)

######################################### PANTALLA SELECCIÓN DE COMPONENTES ##############################################
def mostrar_seleccion_componentes(root):
    contenedor = configurar_interfaz(root)
    for widget in contenedor.winfo_children():
        widget.destroy()
    
    etiqueta = tk.Label(contenedor, text="Seleccione los componentes a instalar:",
                        font=("Helvetica", 16, "bold"),
                        bg="#d0e8e4", fg="#575f5e")
    etiqueta.place(relx=0.5, rely=0.3, anchor="center")
    
    var_comp1 = tk.IntVar(value=1)
    var_comp2 = tk.IntVar(value=1)
    
    check1 = tk.Checkbutton(contenedor, text="Componente 1", variable=var_comp1,
                            font=("Helvetica", 14),
                            bg="#d0e8e4", fg="#575f5e",
                            activebackground="#d0e8e4", activeforeground="#575f5e")
    check1.place(relx=0.5, rely=0.4, anchor="center")
    
    check2 = tk.Checkbutton(contenedor, text="Componente 2", variable=var_comp2,
                            font=("Helvetica", 14),
                            bg="#d0e8e4", fg="#575f5e",
                            activebackground="#d0e8e4", activeforeground="#575f5e")
    check2.place(relx=0.5, rely=0.45, anchor="center")
    
    boton_siguiente = tk.Button(contenedor, text="Siguiente",
                                font=("Helvetica", 14, "bold"),
                                bg="#d0e8e4", fg="#575f5e",
                                command=lambda: mostrar_carpeta_instalacion(root))
    boton_siguiente.place(relx=0.5, rely=0.55, anchor="center")

######################################### PANTALLA SELECCIÓN DE CARPETA ##############################################
def mostrar_carpeta_instalacion(root):
    contenedor = configurar_interfaz(root)
    for widget in contenedor.winfo_children():
        widget.destroy()
    
    etiqueta = tk.Label(contenedor, text="Seleccione la carpeta de instalación:",
                        font=("Helvetica", 16, "bold"),
                        bg="#d0e8e4", fg="#575f5e")
    etiqueta.pack(pady=20)
    
    var_carpeta = tk.StringVar(value="C:/Users/fuste/Instalacion")
    entrada = tk.Entry(contenedor, textvariable=var_carpeta, width=50, font=("Helvetica", 12))
    entrada.pack(pady=10)
    
    def elegir_carpeta():
        carpeta = filedialog.askdirectory(title="Selecciona la carpeta de instalación")
        if carpeta:
            var_carpeta.set(carpeta)
    
    boton_elegir = tk.Button(contenedor, text="Elegir otra carpeta",
                             font=("Helvetica", 12),
                             bg="#d0e8e4", fg="#575f5e",
                             command=elegir_carpeta)
    boton_elegir.pack(pady=5)
    
    boton_siguiente = tk.Button(contenedor, text="Siguiente",
                                font=("Helvetica", 14, "bold"),
                                bg="#d0e8e4", fg="#575f5e",
                                command=lambda: mostrar_preinstalacion(root))
    boton_siguiente.pack(pady=20)

######################################### PANTALLA PRE-INSTALACIÓN ##############################################
def mostrar_preinstalacion(root):
    contenedor = configurar_interfaz(root)
    for widget in contenedor.winfo_children():
        widget.destroy()
    
    etiqueta = tk.Label(contenedor, text="Todo está listo para comenzar la instalación.",
                        font=("Helvetica", 16, "bold"),
                        bg="#d0e8e4", fg="#575f5e")
    etiqueta.pack(pady=20)
    
    boton_iniciar = tk.Button(contenedor, text="Iniciar Instalación",
                              font=("Helvetica", 14, "bold"),
                              bg="#d0e8e4", fg="#575f5e",
                              command=lambda: mostrar_progreso(root))
    boton_iniciar.pack(pady=10)

######################################### COPIAR ARCHIVOS (INSTALACIÓN) ##############################################
def copiar_archivos(origen, destino, barra_progreso, etiqueta_progreso, root):
    # Crear destino final: una subcarpeta con el nombre de "origen" dentro del destino
    destino_final = os.path.join(destino, os.path.basename(os.path.normpath(origen)))
    os.makedirs(destino_final, exist_ok=True)

    total_archivos = sum(len(files) for _, _, files in os.walk(origen))
    archivos_copiados = 0

    def copiar_recursivamente():
        nonlocal archivos_copiados
        for raiz, directorios, archivos in os.walk(origen):
            ruta_relativa = os.path.relpath(raiz, origen)
            destino_dir = os.path.join(destino_final, ruta_relativa)
            os.makedirs(destino_dir, exist_ok=True)
            for archivo in archivos:
                ruta_origen = os.path.join(raiz, archivo)
                ruta_destino = os.path.join(destino_dir, archivo)
                try:
                    shutil.copy2(ruta_origen, ruta_destino)
                    print(f"Copiado {archivo} a {ruta_destino}")
                except Exception as e:
                    print(f"Error copiando {archivo}: {e}")
                archivos_copiados += 1
                progreso = (archivos_copiados / total_archivos) * 100
                barra_progreso["value"] = progreso
                etiqueta_progreso.config(text=f"Copiando {archivo} ({archivos_copiados}/{total_archivos})")
                root.update_idletasks()
        etiqueta_progreso.config(text="Instalación completada.")
        messagebox.showinfo("Instalador", "¡La instalación se ha completado correctamente!")

    root.after(0, copiar_recursivamente)

######################################### PANTALLA DE PROGRESO ##############################################
def mostrar_progreso(root):
    contenedor = configurar_interfaz(root)
    for widget in contenedor.winfo_children():
        widget.destroy()
    
    barra_progreso = ttk.Progressbar(contenedor, orient="horizontal", length=400, mode="determinate")
    barra_progreso.pack(pady=20)
    
    etiqueta_progreso = tk.Label(contenedor, text="Iniciando instalación...", font=("Helvetica", 12),
                                 bg="#d0e8e4", fg="#575f5e")
    etiqueta_progreso.pack(pady=10)
    
    ruta_origen = "origen"
    ruta_destino = "C:/Users/fuste/Instalacion"
    print("Ruta origen:", ruta_origen)
    print("Ruta destino:", ruta_destino)
    copiar_archivos(ruta_origen, ruta_destino, barra_progreso, etiqueta_progreso, root)

######################################### MAIN ##############################################
if __name__ == '__main__':
    root = tk.Tk()
    mostrar_bienvenida(root)
    root.mainloop()
