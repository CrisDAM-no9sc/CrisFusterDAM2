
"""
Script para listar la estructura de un proyecto y extraer documentación
(comentarios) de múltiples tipos de archivo, generando un Markdown con:

1) Estructura completa de directorios y archivos.
2) Comentarios extraídos (no sólo al principio del archivo).
3) Tabla de contenido (índice de archivos documentados).
4) Conteo de archivos y directorios.
5) Marca de tiempo de generación.

Uso (ejemplo):
    python generar_documentacion_proyecto.py --ruta "C:/ruta/mi_proyecto" --salida "doc_proyecto.md"
"""

import os
import re
import argparse
from datetime import datetime

# Lista de extensiones consideradas binarias (no se leen como texto)
EXTENSIONES_BINARIAS = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.pdf', '.exe', '.dll', '.odg', '.ico'
]

# Regex para comentarios en Python
REGEX_PYTHON_MULTILINEA = re.compile(r'(\"\"\"|\'\'\')([\s\S]*?)(\"\"\"|\'\'\')', re.MULTILINE)
REGEX_PYTHON_LINEA = re.compile(r'^\s*#(.*)$', re.MULTILINE)

# Regex para comentarios en JS/PHP/CSS
REGEX_MULTI = re.compile(r'/\*([\s\S]*?)\*/', re.MULTILINE)
REGEX_LINE = re.compile(r'^\s*//(.*)$', re.MULTILINE)

# Regex para comentarios HTML
REGEX_HTML = re.compile(r'<!--([\s\S]*?)-->', re.MULTILINE)

def es_binario(ruta_archivo: str) -> bool:
    """
    Verifica si un archivo es binario según su extensión.
    """
    _, extension = os.path.splitext(ruta_archivo)
    return extension.lower() in EXTENSIONES_BINARIAS

def extraer_comentarios(ruta_archivo: str) -> str:
    """
    Extrae todos los comentarios o bloques de documentación que encuentre
    en el archivo, según su extensión. Devuelve un string con toda la información.
    """
    _, extension = os.path.splitext(ruta_archivo)
    extension = extension.lower()

    # Si el archivo es binario, no lo procesamos
    if es_binario(ruta_archivo):
        return ""

    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            contenido = f.read()
    except UnicodeDecodeError:
        # Si falla la decodificación, asumimos que no es texto legible
        return ""
    except Exception as e:
        print(f"Error al leer {ruta_archivo}: {e}")
        return ""

    comentarios_encontrados = []

    if extension == '.py':
        # Capturar docstrings multilinea con triple comillas
        bloques_multi = REGEX_PYTHON_MULTILINEA.findall(contenido)
        for bloque in bloques_multi:
            comentarios_encontrados.append(bloque[1].strip())

        # Capturar comentarios de línea que empiecen con #
        lineas = REGEX_PYTHON_LINEA.findall(contenido)
        for l in lineas:
            comentarios_encontrados.append(l.strip())

    elif extension in ['.js', '.php', '.css']:
        # Capturar comentarios multilinea /* ... */
        bloques_multi = REGEX_MULTI.findall(contenido)
        for bloque in bloques_multi:
            comentarios_encontrados.append(bloque.strip())

        # Capturar comentarios de línea que empiecen con //
        lineas = REGEX_LINE.findall(contenido)
        for l in lineas:
            comentarios_encontrados.append(l.strip())

    elif extension == '.html':
        # Capturar comentarios <!-- ... -->
        bloques_html = REGEX_HTML.findall(contenido)
        for bloque in bloques_html:
            comentarios_encontrados.append(bloque.strip())

    # Unir todo en un único texto
    if comentarios_encontrados:
        return "\n".join(comentarios_encontrados)
    else:
        return ""


def listar_estructura_markdown(ruta: str, archivo_salida: str) -> (int, int): # type: ignore
    """
    Genera la estructura del directorio en formato Markdown utilizando listas anidadas.
    Devuelve el número total de directorios y archivos encontrados.
    """
    total_directorios = 0
    total_archivos = 0

    with open(archivo_salida, 'w', encoding='utf-8') as salida:
        # Escribimos cabecera con fecha/hora
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        salida.write(f"# Estructura del Proyecto\n\n")
        salida.write(f"_Documento generado el {now}_\n\n")

        for directorio_actual, subdirectorios, archivos in os.walk(ruta):
            # Calcular el nivel de profundidad
            ruta_relativa = os.path.relpath(directorio_actual, ruta)
            if ruta_relativa == '.':
                nivel = 0
            else:
                nivel = ruta_relativa.count(os.sep) + 1

            indentacion = '    ' * nivel  # 4 espacios por nivel

            # Escribir el nombre de la carpeta (en negrita)
            nombre_carpeta = os.path.basename(directorio_actual)
            if nombre_carpeta:
                salida.write(f"{indentacion}- **{nombre_carpeta}/**\n")
                total_directorios += 1

            # Escribir los archivos dentro de la carpeta
            for archivo in archivos:
                indentacion_archivo = '    ' * (nivel + 1)
                salida.write(f"{indentacion_archivo}- {archivo}\n")
                total_archivos += 1

    return total_directorios, total_archivos


def agregar_docstrings_markdown(ruta: str, archivo_salida: str):
    """
    Extrae y agrega al documento Markdown la documentación (comentarios) de cada archivo
    en todo el proyecto, generando también una tabla de contenido (índice de archivos documentados).
    """
    # Primero, recolectamos todo en memoria, para luego generar un índice
    lista_documentaciones = []  # [(ruta_relativa, comentarios), ...]
    for directorio_actual, subdirectorios, archivos in os.walk(ruta):
        for archivo in archivos:
            ruta_archivo = os.path.join(directorio_actual, archivo)
            comentarios = extraer_comentarios(ruta_archivo)
            if comentarios:
                ruta_relativa = os.path.relpath(ruta_archivo, ruta)
                lista_documentaciones.append((ruta_relativa, comentarios))

    if not lista_documentaciones:
        # Si no hay ningún comentario, no hacemos nada más
        return

    with open(archivo_salida, 'a', encoding='utf-8') as salida:
        salida.write("\n# Documentación de Archivos\n")

        # 1) Generar la tabla de contenido con enlaces ancla
        salida.write("\n## Índice\n")
        for i, (ruta_relativa, _) in enumerate(lista_documentaciones, start=1):
            # Crear un anchor id "archivo_1", "archivo_2", ...
            anchor_id = f"archivo_{i}"
            # Quitar caracteres problemáticos del anchor
            titulo_limpio = ruta_relativa.replace(" ", "-").replace("\\", "-").replace("/", "-")
            salida.write(f"- [{ruta_relativa}](#{anchor_id}-{titulo_limpio.lower()})\n")

        # 2) Escribir cada sección con sus comentarios
        for i, (ruta_relativa, comentarios) in enumerate(lista_documentaciones, start=1):
            anchor_id = f"archivo_{i}"
            titulo_limpio = ruta_relativa.replace(" ", "-").replace("\\", "-").replace("/", "-").lower()

            salida.write(f"\n## {ruta_relativa}\n")
            salida.write(f"<a name=\"{anchor_id}-{titulo_limpio}\"></a>\n\n")
            # Formatear el texto de comentarios como bloque de código (opcional)
            salida.write("```\n")
            salida.write(comentarios)
            salida.write("\n```\n")


def main():
    parser = argparse.ArgumentParser(
        description="Listar la estructura de un proyecto y extraer sus comentarios en un Markdown."
    )
    parser.add_argument(
        "--ruta", 
        required=True, 
        help="Ruta de la carpeta a analizar."
    )
    parser.add_argument(
        "--salida", 
        default="estructura_proyecto.md", 
        help="Archivo Markdown donde se guardará la documentación (por defecto: estructura_proyecto.md)."
    )

    args = parser.parse_args()
    carpeta = args.ruta
    archivo_md = args.salida

    # Verificar que la carpeta sea válida
    if not os.path.isdir(carpeta):
        print(f"Error: La ruta '{carpeta}' no es un directorio válido.")
        return

    # 1) Listar estructura
    dirs, files = listar_estructura_markdown(carpeta, archivo_md)
    print(f"Estructura del proyecto guardada en '{archivo_md}'.")
    print(f"Se han encontrado {dirs} directorios y {files} archivos en total.")

    # 2) Agregar comentarios/docstrings
    agregar_docstrings_markdown(carpeta, archivo_md)
    print(f"Comentarios/docstrings agregados a '{archivo_md}'.")


if __name__ == "__main__":
    main()
