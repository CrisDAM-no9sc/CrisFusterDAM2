import os
import re
import threading
import ast
import markdown  # Para convertir Markdown a HTML
from tkinter import Tk, StringVar, filedialog, BOTH
from ttkbootstrap import ttk, Style
from ttkbootstrap.constants import *
from tkhtmlview import HTMLLabel  # Widget para mostrar HTML en Tkinter

####### filtra y elimna los directorios dque empiezan por un punyo #########
def filtrar_directorios(dirs):
    dirs[:] = [d for d in dirs if not d.startswith('.')]

## estructura de directorio Markdown con listas desodernadas
# excluye directorios ocultos
def listar_estructura_markdown(ruta, archivo_salida):
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        f.write("# Estructura del Proyecto\n\n")
        for root, dirs, files in os.walk(ruta):
            filtrar_directorios(dirs)
            relative_path = os.path.relpath(root, ruta)
            level = 0 if relative_path == '.' else relative_path.count(os.sep) + 1
            indent = '    ' * level
            carpeta = os.path.basename(root)
            if carpeta:
                f.write(f"{indent}- **🗀  {carpeta}/**\n")
            for file in files:
                if not file.startswith('.'):
                    file_indent = '    ' * (level + 1)
                    f.write(f"{file_indent}- 🗋  {file}\n")

## estrae comentarios segun su tipo 
def extraer_docstring(file_path):
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    doc = ""
    partes = file_path.split(os.sep)
    if any(part.startswith('.') for part in partes):
        return doc
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if ext == '.py':
            match = re.match(r'^\s*(?:\'\'\'|\"\"\")([\s\S]*?)(?:\'\'\'|\"\"\")', content, re.DOTALL)
            if match:
                doc = match.group(1).strip()
            else:
                comments = []
                for line in content.splitlines():
                    line = line.strip()
                    if line.startswith("#"):
                        comments.append(line.lstrip("#").strip())
                    elif not line:
                        continue
                    else:
                        break
                if comments:
                    doc = "\n".join(comments)
        elif ext in ['.js', '.php', '.css']:
            if ext == '.php':
                content = re.sub(r'<\?php\s*', '', content, flags=re.IGNORECASE)
            multiline_match = re.match(r'^\s*/\*([\s\S]*?)\*/', content, re.DOTALL)
            if multiline_match:
                doc = multiline_match.group(1).strip()
            else:
                comments = []
                for line in content.splitlines():
                    line = line.strip()
                    if line.startswith("//"):
                        comments.append(line.lstrip("//").strip())
                    elif not line:
                        continue
                    else:
                        break
                if comments:
                    doc = "\n".join(comments)
        elif ext == '.html':
            match = re.match(r'^\s*<!--([\s\S]*?)-->', content, re.DOTALL)
            if match:
                doc = match.group(1).strip()
    except Exception as e:
        print(f"Error al procesar el archivo {file_path}: {e}")
    return doc

## agrega los comentarios de los archivos al docuemnto
def agregar_docstrings_markdown(ruta, archivo_salida):
    with open(archivo_salida, 'a', encoding='utf-8') as f:
        f.write("\n# Documentación de Archivos\n\n")
        for root, dirs, files in os.walk(ruta):
            filtrar_directorios(dirs)
            for file in files:
                if file.startswith('.'):
                    continue
                file_path = os.path.join(root, file)
                doc = extraer_docstring(file_path)
                if doc:
                    relative_path = os.path.relpath(file_path, ruta)
                    f.write(f"## {relative_path}\n\n")
                    f.write(f"{doc}\n\n")

## agrega codigo al documento dentro de bloques 
def agregar_codigo_markdown(ruta, archivo_salida):
    with open(archivo_salida, 'a', encoding='utf-8') as f:
        f.write("\n# Código de Archivos\n\n")
        for root, dirs, files in os.walk(ruta):
            filtrar_directorios(dirs)
            for file in files:
                if file.startswith('.'):
                    continue
                file_path = os.path.join(root, file)
                _, ext = os.path.splitext(file)
                ext = ext.lower().lstrip('.')
                lang_map = {
                    'py': 'python',
                    'js': 'javascript',
                    'php': 'php',
                    'css': 'css',
                    'html': 'html',
                    'htm': 'html',
                }
                lang = lang_map.get(ext, '')
                try:
                    with open(file_path, 'r', encoding='utf-8') as code_file:
                        code_content = code_file.read()
                    relative_path = os.path.relpath(file_path, ruta)
                    f.write(f"## {relative_path}\n\n")
                    f.write(f"```{lang}\n")
                    f.write(f"{code_content}\n")
                    f.write("```\n\n")
                except Exception as e:
                    print(f"Error al leer el archivo {file_path}: {e}")

# genera resumenes estaticos de clases y funciones y los agrega al documento
def agregar_resumen_estatico_markdown(ruta, archivo_salida):
    with open(archivo_salida, 'a', encoding='utf-8') as f:
        f.write("\n# Análisis Estático y Resumen del Código\n\n")
        for root, dirs, files in os.walk(ruta):
            filtrar_directorios(dirs)
            for file in files:
                if file.endswith('.py') and not file.startswith('.'):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, ruta)
                    f.write(f"## {relative_path}\n\n")
                    try:
                        with open(file_path, 'r', encoding='utf-8') as pyfile:
                            tree = ast.parse(pyfile.read(), filename=file_path)
                        summaries = []
                        for node in ast.iter_child_nodes(tree):
                            if isinstance(node, ast.ClassDef):
                                doc = ast.get_docstring(node) or "No documentation."
                                primera_line = doc.splitlines()[0] if doc else "No docstring"
                                summaries.append(f"**Clase** `{node.name}`: {primera_line}")
                            elif isinstance(node, ast.FunctionDef):
                                doc = ast.get_docstring(node) or "No documentation."
                                primera_line = doc.splitlines()[0] if doc else "No docstring"
                                summaries.append(f"**Función** `{node.name}`: {primera_line}")
                        if summaries:
                            for s in summaries:
                                f.write(f"- {s}\n")
                        else:
                            f.write("No se encontraron definiciones de clases o funciones.\n")
                        f.write("\n")
                    except Exception as e:
                        f.write(f"Error al analizar el archivo: {e}\n\n")

# proceas y actualiza la etiqueta del estado y actualiza la vista previa 
def procesar(carpeta, archivo_md, actualizar_label, actualizar_preview=None):

    try:
        listar_estructura_markdown(carpeta, archivo_md)
        actualizar_label("Estructura del proyecto generada.")
        if actualizar_preview: actualizar_preview()

        agregar_docstrings_markdown(carpeta, archivo_md)
        actualizar_label("Docstrings/comentarios agregados.")
        if actualizar_preview: actualizar_preview()

        agregar_codigo_markdown(carpeta, archivo_md)
        actualizar_label("Código de archivos agregado.")
        if actualizar_preview: actualizar_preview()

        agregar_resumen_estatico_markdown(carpeta, archivo_md)
        actualizar_label("Análisis estático y resúmenes agregados.")
        if actualizar_preview: actualizar_preview()

        actualizar_label(f"Proceso completado. Archivo generado: {archivo_md}")
        if actualizar_preview: actualizar_preview()
    except Exception as e:
        actualizar_label(f"Error: {e}")

## Inicia el procesamiento en un hilo separado para mantener la UI responsiva
def iniciar_proceso(carpeta, archivo_md, actualizar_label, actualizar_preview):

    hilo = threading.Thread(target=procesar, args=(carpeta, archivo_md, actualizar_label, actualizar_preview))
    hilo.start()

def main():
    # Configuración de la ventana principal
    root = Tk()
    root.title("Generador de Documentación Markdown")
    root.geometry("900x700")
    style = Style(theme='cosmo')
    
    # Variables para almacenar rutas
    ruta_carpeta = StringVar()
    ruta_archivo = StringVar()
    
    # Funciones para seleccionar carpeta y archivo de salida
    def seleccionar_carpeta():
        carpeta = filedialog.askdirectory()
        if carpeta:
            ruta_carpeta.set(carpeta)
    
    def seleccionar_archivo():
        archivo = filedialog.asksaveasfilename(defaultextension=".md",
                                               filetypes=[("Markdown files", "*.md")])
        if archivo:
            ruta_archivo.set(archivo)
    
    # Función para actualizar la etiqueta de estado
    def actualizar_label(texto):
        estado_var.set(texto)
        root.update_idletasks()
    
    # Función para actualizar la vista previa del Markdown
    def actualizar_preview():
        archivo = ruta_archivo.get()
        if os.path.exists(archivo):
            with open(archivo, 'r', encoding='utf-8') as md_file:
                content = md_file.read()
            # Convertir Markdown a HTML con resaltado de código
            html = markdown.markdown(content, extensions=['fenced_code', 'codehilite'])
            preview_label.set_html(html)
    
    # Diseño de la UI
    frame = ttk.Frame(root, padding=20)
    frame.pack(fill=BOTH, expand=False)
    
    # Selección de carpeta de origen
    carpeta_label = ttk.Label(frame, text="Carpeta de Origen:")
    carpeta_label.grid(row=0, column=0, sticky="w", pady=5)
    carpeta_entry = ttk.Entry(frame, textvariable=ruta_carpeta, width=50)
    carpeta_entry.grid(row=0, column=1, pady=5, padx=5)
    carpeta_button = ttk.Button(frame, text="Seleccionar Carpeta", command=seleccionar_carpeta)
    carpeta_button.grid(row=0, column=2, pady=5)
    
    # Selección de archivo de salida
    archivo_label = ttk.Label(frame, text="Archivo de Salida (.md):")
    archivo_label.grid(row=1, column=0, sticky="w", pady=5)
    archivo_entry = ttk.Entry(frame, textvariable=ruta_archivo, width=50)
    archivo_entry.grid(row=1, column=1, pady=5, padx=5)
    archivo_button = ttk.Button(frame, text="Seleccionar Archivo", command=seleccionar_archivo)
    archivo_button.grid(row=1, column=2, pady=5)
    
    # Botón para iniciar el proceso
    procesar_button = ttk.Button(frame, text="Iniciar Proceso", command=lambda: iniciar_proceso(
        ruta_carpeta.get(), ruta_archivo.get(), actualizar_label, actualizar_preview))
    procesar_button.grid(row=2, column=1, pady=20)
    
    # Etiqueta para mostrar el estado
    estado_var = StringVar()
    estado_var.set("Esperando para iniciar...")
    estado_label = ttk.Label(frame, textvariable=estado_var, bootstyle="info")
    estado_label.grid(row=3, column=0, columnspan=3, pady=10)
    
    # Panel de vista previa del Markdown
    preview_frame = ttk.Frame(root, padding=10)
    preview_frame.pack(fill=BOTH, expand=True)
    preview_label = HTMLLabel(preview_frame, html="<h3>Vista previa del Markdown</h3>")
    preview_label.pack(fill=BOTH, expand=True)
    
    # Ajuste de columnas
    frame.columnconfigure(1, weight=1)
    
    root.mainloop()

if __name__ == "__main__":
    main()
