import os
import re

def listar_estructura_markdown(ruta, archivo_salida):
    """
    Genera la estructura del directorio en formato Markdown utilizando listas desordenadas.

    Args:
        ruta (str): Ruta de la carpeta a analizar.
        archivo_salida (str): Nombre del archivo Markdown de salida.
    """
    with open(archivo_salida, 'w', encoding='utf-8') as salida:
        salida.write("# Estructura del Proyecto\n\n")
        for directorio_actual, subdirectorios, archivos in os.walk(ruta):
            # Calcular el nivel de profundidad en el árbol de directorios
            ruta_relativa = os.path.relpath(directorio_actual, ruta)
            if ruta_relativa == '.':
                nivel = 0
            else:
                nivel = ruta_relativa.count(os.sep) + 1
            indentacion = '    ' * nivel  # 4 espacios por nivel de indentación

            # Escribir el nombre de la carpeta (en negrita)
            nombre_carpeta = os.path.basename(directorio_actual)
            if nombre_carpeta:
                salida.write(f"{indentacion}- **{nombre_carpeta}/**\n")

            # Escribir los archivos dentro de la carpeta
            for archivo in archivos:
                indentacion_archivo = '    ' * (nivel + 1)
                salida.write(f"{indentacion_archivo}- {archivo}\n")


def extraer_docstring(ruta_archivo):
    """
    Extrae el docstring o los comentarios iniciales de un archivo según su tipo.

    Args:
        ruta_archivo (str): Ruta completa del archivo.

    Returns:
        str: Contenido del docstring/comentario si se encuentra, o una cadena vacía.
    """
    _, extension = os.path.splitext(ruta_archivo)
    extension = extension.lower()
    documentacion = ""

    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
            contenido = archivo.read()

        if extension == '.py':
            # Extraer cadenas de triple comillas al inicio del archivo (docstring de Python)
            coincidencia = re.match(r'^\s*(?:\'\'\'|\"\"\")([\s\S]*?)(?:\'\'\'|\"\"\")', contenido, re.DOTALL)
            if coincidencia:
                documentacion = coincidencia.group(1).strip()
            else:
                # Si no hay triple comillas, intenta extraer comentarios de línea (que empiezan con #)
                comentarios = []
                for linea in contenido.splitlines():
                    linea = linea.strip()
                    if linea.startswith("#"):
                        comentarios.append(linea.lstrip("#").strip())
                    elif not linea:
                        continue
                    else:
                        break
                if comentarios:
                    documentacion = "\n".join(comentarios)
        elif extension in ['.js', '.php', '.css']:
            # Extraer comentarios multilínea (/* ... */)
            coincidencia_multilinea = re.match(r'^\s*/\*([\s\S]*?)\*/', contenido, re.DOTALL)
            if coincidencia_multilinea:
                documentacion = coincidencia_multilinea.group(1).strip()
            else:
                # Extraer comentarios de línea (que empiezan con //)
                comentarios = []
                for linea in contenido.splitlines():
                    linea = linea.strip()
                    if linea.startswith("//"):
                        comentarios.append(linea.lstrip("//").strip())
                    elif not linea:
                        continue
                    else:
                        break
                if comentarios:
                    documentacion = "\n".join(comentarios)
        elif extension == '.html':
            # Extraer comentarios HTML (<!-- ... -->)
            coincidencia = re.match(r'^\s*<!--([\s\S]*?)-->', contenido, re.DOTALL)
            if coincidencia:
                documentacion = coincidencia.group(1).strip()
        else:
            # Para otros tipos de archivo no soportados se deja la documentación vacía
            pass

    except Exception as e:
        print(f"Error al procesar el archivo {ruta_archivo}: {e}")

    return documentacion


def agregar_docstrings_markdown(ruta, archivo_salida):
    """
    Agrega al documento Markdown la documentación (docstrings o comentarios)
    extraídos de cada archivo del directorio.

    Args:
        ruta (str): Ruta de la carpeta a analizar.
        archivo_salida (str): Nombre del archivo Markdown de salida.
    """
    with open(archivo_salida, 'a', encoding='utf-8') as salida:
        salida.write("\n# Documentación de Archivos\n\n")
        for directorio_actual, subdirectorios, archivos in os.walk(ruta):
            for archivo in archivos:
                ruta_archivo = os.path.join(directorio_actual, archivo)
                documentacion = extraer_docstring(ruta_archivo)
                if documentacion:
                    # Crear una ruta relativa para usarla como encabezado en el Markdown
                    ruta_relativa = os.path.relpath(ruta_archivo, ruta)
                    salida.write(f"## {ruta_relativa}\n\n")
                    salida.write(f"{documentacion}\n\n")


def main():
    """
    Función principal que ejecuta dos fases:
      1. Genera la estructura del directorio en un archivo Markdown.
      2. Extrae y agrega la documentación (docstrings/comentarios) de los archivos al Markdown.
    """
    carpeta = input("Indica la carpeta sobre la cual sacar la estructura: ").strip()
    if not os.path.isdir(carpeta):
        print(f"La ruta especificada '{carpeta}' no es una carpeta válida.")
        return

    archivo_md = 'estructura_proyecto.md'
    listar_estructura_markdown(carpeta, archivo_md)
    print(f"La estructura del proyecto ha sido guardada en '{archivo_md}'.")

    # Fase 2: Agregar docstrings o comentarios
    agregar_docstrings_markdown(carpeta, archivo_md)
    print(f"Las docstrings/comentarios han sido agregados al archivo '{archivo_md}'.")


if __name__ == "__main__":
    main()
