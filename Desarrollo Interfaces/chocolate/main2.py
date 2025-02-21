import os
import re
import threading
import ast
import markdown  # Para convertir Markdown a HTML
import webbrowser
import shutil
from tkinter import Tk, StringVar, filedialog, BOTH, messagebox
from ttkbootstrap import ttk, Style
from ttkbootstrap.constants import *

# Nueva ruta del logo en la carpeta de destino
RUTA_LOGO_ORIGINAL = r"C:\xampp\htdocs\Desarrollo Interfaces\chocolate\documentacion\logo.png"

# Definimos las extensiones de archivos de texto a procesar
EXTENSIONES_TEXTO = {'.py', '.js', '.php', '.css', '.html', '.htm', '.txt', '.md'}

def filtrar_directorios(dirs):
    dirs[:] = [d for d in dirs if not d.startswith('.')]

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

def es_archivo_texto(file_path):
    _, ext = os.path.splitext(file_path)
    return ext.strip().lower() in EXTENSIONES_TEXTO

def extraer_docstring(file_path):
    _, ext = os.path.splitext(file_path)
    ext = ext.strip().lower()
    if ext not in EXTENSIONES_TEXTO:
        return ""
    partes = file_path.split(os.sep)
    if any(part.startswith('.') for part in partes):
        return ""
    doc = ""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        return ""
    except Exception as e:
        print(f"Error al procesar el archivo {file_path}: {e}")
        return ""
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
    elif ext in {'.js', '.php', '.css'}:
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
    elif ext in {'.html', '.htm'}:
        match = re.match(r'^\s*<!--([\s\S]*?)-->', content, re.DOTALL)
        if match:
            doc = match.group(1).strip()
    return doc

def agregar_docstrings_markdown(ruta, archivo_salida):
    with open(archivo_salida, 'a', encoding='utf-8') as f:
        f.write("\n# Documentación de Archivos\n\n")
        for root, dirs, files in os.walk(ruta):
            filtrar_directorios(dirs)
            for file in files:
                if file.startswith('.'):
                    continue
                file_path = os.path.join(root, file)
                if not es_archivo_texto(file_path):
                    continue
                doc = extraer_docstring(file_path)
                if doc:
                    relative_path = os.path.relpath(file_path, ruta)
                    f.write(f"## {relative_path}\n\n")
                    f.write(f"{doc}\n\n")

def agregar_codigo_markdown(ruta, archivo_salida):
    lang_map = {
        'py': 'python',
        'js': 'javascript',
        'php': 'php',
        'css': 'css',
        'html': 'html',
        'htm': 'html',
        'txt': ''
    }
    with open(archivo_salida, 'a', encoding='utf-8') as f:
        f.write("\n# Código de Archivos\n\n")
        for root, dirs, files in os.walk(ruta):
            filtrar_directorios(dirs)
            for file in files:
                if file.startswith('.'):
                    continue
                file_path = os.path.join(root, file)
                _, ext = os.path.splitext(file)
                ext = ext.strip().lower().lstrip('.')
                if f".{ext}" not in EXTENSIONES_TEXTO:
                    continue
                lang = lang_map.get(ext, '')
                try:
                    with open(file_path, 'r', encoding='utf-8') as code_file:
                        code_content = code_file.read()
                except UnicodeDecodeError:
                    continue
                except Exception as e:
                    print(f"Error al leer el archivo {file_path}: {e}")
                    continue
                relative_path = os.path.relpath(file_path, ruta)
                f.write(f"## {relative_path}\n\n")
                f.write(f"```{lang}\n")
                f.write(f"{code_content}\n")
                f.write("```\n\n")

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

def procesar(carpeta, archivo_md, actualizar_label, notificar_proceso_finalizado):
    try:
        listar_estructura_markdown(carpeta, archivo_md)
        actualizar_label("Estructura del proyecto generada.")
        agregar_docstrings_markdown(carpeta, archivo_md)
        actualizar_label("Docstrings/comentarios agregados.")
        agregar_codigo_markdown(carpeta, archivo_md)
        actualizar_label("Código de archivos agregado.")
        agregar_resumen_estatico_markdown(carpeta, archivo_md)
        actualizar_label("Análisis estático y resúmenes agregados.")
        actualizar_label(f"Proceso completado. Archivo generado: {archivo_md}")
        notificar_proceso_finalizado(archivo_md)
    except Exception as e:
        actualizar_label(f"Error: {e}")

def iniciar_proceso(carpeta, archivo_md, actualizar_label, notificar_proceso_finalizado):
    hilo = threading.Thread(target=procesar, args=(carpeta, archivo_md, actualizar_label, notificar_proceso_finalizado))
    hilo.start()

def generar_html_desde_markdown(archivo_md, titulo, autor, subtitulo, ruta_logo):
    """
    Genera el HTML final con un contenedor centrado y estilos básicos.
    """
    try:
        with open(archivo_md, 'r', encoding='utf-8') as f:
            md_content = f.read()
    except Exception as e:
        messagebox.showerror("Error", f"No se pudo leer el archivo Markdown: {e}")
        return None

    html_body = markdown.markdown(md_content, extensions=['fenced_code', 'codehilite'])
    
    html_template = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>{titulo}</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 10px;
                padding: 0;
                background-color: #eef2f3;
                color: #333;
            }}
            .container {{
                max-width: 900px;
                margin: 0 auto;
                padding: 0 20px;
            }}
            header {{
                background: linear-gradient(135deg, #2980b9, #6dd5fa);
                color: #fff;
                padding: 30px;
                text-align: center;
                position: relative;
            }}
            header img {{
                max-height: 80px;
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
            }}
            header h1 {{
                margin: 0;
                font-size: 2.5em;
            }}
            header h2 {{
                margin: 5px 0 0;
                font-size: 1.2em;
                font-weight: normal;
            }}
            header p {{
                margin: 5px 0 0;
                font-size: 1em;
                font-style: italic;
            }}
            main {{
                padding: 20px 0;
            }}
            pre {{
                background: #2d2d2d;
                color: #ccc;
                padding: 10px;
                border-radius: 5px;
                overflow-x: auto;
            }}
            code {{
                font-family: Consolas, monospace;
            }}
            a {{
                color: #2980b9;
                text-decoration: none;
            }}
            a:hover {{
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <img src="{ruta_logo}" alt="Logo Crsimon">
                <h1>{titulo}</h1>
                <h2>{subtitulo}</h2>
                <p>Autor: {autor}</p>
            </header>
            <main>
                {html_body}
            </main>
        </div>
    </body>
    </html>
    """
    return html_template

def parse_comment_block(comment: str) -> str:
    """
    Convierte patrones de comentario como '* * ## Descripción:' o '* - ' 
    en líneas Markdown más limpias.
    """
    lines = comment.splitlines()
    new_lines = []

    for line in lines:
        original = line  # Por si quieres depurar

        # Eliminamos espacios iniciales
        line = line.strip()

        # Sustitución de patrones específicos:
        if line.startswith("* * ##"):
            # Convierte "* * ## Descripción:" en "## Descripción:"
            line = line.replace("* * ##", "##", 1)

        elif line.startswith("## 🔹"):
            # Convierte "## 🔹 Descripción:" en "## Descripción:"
            line = line.replace("## 🔹", "## ", 1)

        elif line.startswith("* ##"):
            # Convierte "* ## Notas:" en "## Notas:"
            line = line.replace("* ##", "##", 1)

        elif line.startswith("* - "):
            # Convierte "* - " en viñetas "-"
            line = line.replace("* - ", "- ", 1)

        elif line.startswith("* "):
            # Convierte "* " al inicio en simple viñeta
            line = line.replace("* ", "- ", 1)

        # Puedes añadir más reglas según tu patrón de comentarios

        new_lines.append(line)

    # Reconstruimos el bloque
    return "\n".join(new_lines)

def abrir_en_chrome(archivo_html):
    """
    Intenta forzar la apertura en Chrome.
    Si no se encuentra Chrome en la ruta dada,
    abrirá el archivo en el navegador predeterminado.
    """
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe %s"
    try:
        webbrowser.get(chrome_path).open(archivo_html, new=2)
    except webbrowser.Error:
        webbrowser.open(f"file://{os.path.abspath(archivo_html)}", new=2)

def notificar_proceso_finalizado(archivo_md, titulo, autor, subtitulo):
    """
    Copia el logo (si es necesario), genera el HTML y pregunta al usuario
    si desea abrir la documentación resultante en el navegador.
    """
    ruta_salida = os.path.dirname(archivo_md)
    destino_logo = os.path.join(ruta_salida, "logo_crsimon.png")
    try:
        if os.path.abspath(RUTA_LOGO_ORIGINAL) != os.path.abspath(destino_logo):
            shutil.copy(RUTA_LOGO_ORIGINAL, destino_logo)
        else:
            destino_logo = RUTA_LOGO_ORIGINAL
    except Exception as e:
        messagebox.showwarning("Advertencia", f"No se pudo copiar el logo: {e}")
        destino_logo = RUTA_LOGO_ORIGINAL

    html = generar_html_desde_markdown(archivo_md, titulo, autor, subtitulo, destino_logo)
    if html is None:
        return
    archivo_html = os.path.splitext(archivo_md)[0] + ".html"
    try:
        with open(archivo_html, 'w', encoding='utf-8') as f:
            f.write(html)
    except Exception as e:
        messagebox.showerror("Error", f"No se pudo guardar el archivo HTML: {e}")
        return
    if messagebox.askyesno("Proceso Completado", "El procesamiento se completó.\n¿Desea abrir la documentación en Chrome?"):
        abrir_en_chrome(archivo_html)

def main():
    # Configuración de la ventana principal
    root = Tk()
    root.title("Generador de Documentación Markdown")
    root.geometry("700x450")
    style = Style(theme='cosmo')
    root.configure(background="#f0f0f0")
    
    # Variables para almacenar datos
    ruta_carpeta = StringVar()
    ruta_archivo = StringVar()
    titulo_doc = StringVar(value="Título del Documento")
    autor_doc = StringVar(value="Autor")
    subtitulo_doc = StringVar(value="Version")
    
    # Frame para los dos campos principales (Carpeta y Archivo)
    frame_top = ttk.Frame(root, padding=20)
    frame_top.pack(anchor='center', fill='x')
    
    # Fila para carpeta de origen
    row_carpeta = ttk.Frame(frame_top)
    row_carpeta.pack(anchor='center', pady=5)
    ttk.Label(row_carpeta, text="Carpeta de Origen:", font=("Segoe UI", 10, "bold")).pack(side='left', padx=5)
    carpeta_entry = ttk.Entry(row_carpeta, textvariable=ruta_carpeta, width=40)
    carpeta_entry.pack(side='left', padx=5)
    ttk.Button(row_carpeta, text="Seleccionar Carpeta",
               command=lambda: ruta_carpeta.set(filedialog.askdirectory())).pack(side='left', padx=5)
    
    # Fila para archivo de salida
    row_archivo = ttk.Frame(frame_top)
    row_archivo.pack(anchor='center', pady=5)
    ttk.Label(row_archivo, text="Carpeta Destino (.md):", font=("Segoe UI", 10, "bold")).pack(side='left', padx=6)
    archivo_entry = ttk.Entry(row_archivo, textvariable=ruta_archivo, width=40)
    archivo_entry.pack(side='left', padx=6)
    ttk.Button(row_archivo, text="Seleccionar Carpeta",
               command=lambda: ruta_archivo.set(
                   filedialog.asksaveasfilename(defaultextension=".md", filetypes=[("Markdown files", "*.md")])
               )).pack(side='left', padx=5)
    
    # Frame para datos del documento
    frame_datos = ttk.Frame(root, padding=20)
    frame_datos.pack(anchor='center', fill='x')
    
    # Fila para título
    row_titulo = ttk.Frame(frame_datos)
    row_titulo.pack(anchor='center', pady=5)
    ttk.Label(row_titulo, text="Título:", font=("Segoe UI", 10, "bold")).pack(side='left', padx=5)
    ttk.Entry(row_titulo, textvariable=titulo_doc, width=40).pack(side='left', padx=5)
    
    # Fila para autor
    row_autor = ttk.Frame(frame_datos)
    row_autor.pack(anchor='center', pady=5)
    ttk.Label(row_autor, text=" Autor:", font=("Segoe UI", 10, "bold")).pack(side='left', padx=5)
    ttk.Entry(row_autor, textvariable=autor_doc, width=40).pack(side='left', padx=5)
    
    # Fila para subtítulo
    row_subtitulo = ttk.Frame(frame_datos)
    row_subtitulo.pack(anchor='center', pady=5)
    ttk.Label(row_subtitulo, text="Version:", font=("Segoe UI", 10, "bold")).pack(side='left', padx=5)
    ttk.Entry(row_subtitulo, textvariable=subtitulo_doc, width=40).pack(side='left', padx=5)
    
    # Botón de procesamiento (centrado en la ventana)
    procesar_button = ttk.Button(root, text="Iniciar Proceso", command=lambda: threading.Thread(
        target=procesar, args=(
            ruta_carpeta.get(),
            ruta_archivo.get(),
            lambda texto: root.after(0, lambda: estado_var.set(texto)),
            lambda archivo_md: notificar_proceso_finalizado(
                archivo_md, titulo_doc.get(), autor_doc.get(), subtitulo_doc.get()
            )
        )).start())
    procesar_button.pack(anchor='center', pady=20)
    
    # Etiqueta de estado en la parte inferior
    estado_var = StringVar(value="Esperando para iniciar...")
    estado_label = ttk.Label(root, textvariable=estado_var, bootstyle="info")
    estado_label.pack(anchor='center', pady=5)
    
    root.mainloop()

if __name__ == "__main__":
    main()
