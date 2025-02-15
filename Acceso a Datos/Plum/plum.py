#!/usr/bin/env python3
import os
import json
import time

def obtener_tamaño(ruta):
    """Obtiene el tamaño de un archivo o directorio."""
    try:
        if os.path.isfile(ruta):
            return os.path.getsize(ruta)
        elif os.path.isdir(ruta):
            tamaño_total = 0
            for ruta_directorio, _, archivos in os.walk(ruta):
                for archivo in archivos:
                    ruta_archivo = os.path.join(ruta_directorio, archivo)
                    # Omitir enlaces simbólicos rotos
                    if not os.path.islink(ruta_archivo):
                        tamaño_total += os.path.getsize(ruta_archivo)
            return tamaño_total
    except (OSError, PermissionError):
        return None

def listar_archivos_y_carpetas_recursivo(ruta_raiz, solo_carpetas=False):
    """
    Lista recursivamente todos los archivos y carpetas en el directorio dado.
    
    Retorna una lista de diccionarios con:
      - nombre
      - ruta
      - tipo (archivo o directorio)
      - tamaño
      - fecha_modificacion (timestamp)
      - numero_archivos (cantidad de archivos inmediatos en un directorio)
      - contenido (para directorios)
    """
    estructura = []
    try:
        for entrada in os.scandir(ruta_raiz):
            info = entrada.stat()
            fecha_modificacion = info.st_mtime  # timestamp UNIX
            if entrada.is_dir():
                # Contar archivos inmediatos en el directorio
                try:
                    num_archivos = sum(1 for item in os.scandir(entrada.path) if item.is_file())
                except Exception:
                    num_archivos = 0
                estructura.append({
                    'nombre': entrada.name,
                    'ruta': entrada.path,
                    'tipo': 'directorio',
                    'tamaño': obtener_tamaño(entrada.path),
                    'fecha_modificacion': fecha_modificacion,
                    'numero_archivos': num_archivos,
                    'contenido': listar_archivos_y_carpetas_recursivo(entrada.path, solo_carpetas)
                })
            elif not solo_carpetas:
                estructura.append({
                    'nombre': entrada.name,
                    'ruta': entrada.path,
                    'tipo': 'archivo',
                    'tamaño': obtener_tamaño(entrada.path),
                    'fecha_modificacion': fecha_modificacion
                })
    except (OSError, PermissionError):
        pass
    return estructura

def transformar_para_d3_sunburst(datos, nombre_padre="raiz"):
    """
    Transforma la estructura de archivos en un formato jerárquico compatible
    con el gráfico sunburst de D3.js.
    
    Cada nodo tendrá la siguiente estructura:
    {{
      "nombre": <str>,
      "children": [...],
      "value": <tamaño_del_archivo>  (solo para nodos hoja),
      "fecha_modificacion": <timestamp>,
      "numero_archivos": <cantidad> (solo para directorios)
    }}
    """
    nodo = {
        "nombre": nombre_padre,
        "children": []
    }
    
    for item in datos:
        tamaño = item.get('tamaño', 0) or 0
        if 'contenido' in item and item['contenido']:
            # Es un directorio con contenido
            nodo_hijos = transformar_para_d3_sunburst(item['contenido'], nombre_padre=item['ruta'])
            nodo_hijos["nombre"] = item['ruta']
            nodo_hijos["fecha_modificacion"] = item.get('fecha_modificacion')
            nodo_hijos["numero_archivos"] = item.get('numero_archivos')
            nodo["children"].append(nodo_hijos)
        else:
            # Es un archivo o directorio vacío
            nodo["children"].append({
                "nombre": item['ruta'],
                "value": tamaño,
                "fecha_modificacion": item.get('fecha_modificacion'),
                "numero_archivos": item.get('numero_archivos', None)
            })
    
    return nodo

def crear_html_grafico_sunburst(datos, archivo_html):
    """
    Crea un archivo HTML interactivo que:
      - Muestra un formulario de login (usuario y contraseña: 'jocarsa').
      - Una vez autenticado, presenta un gráfico sunburst interactivo con zoom.
      - Permite hacer clic para hacer zoom en cada sección y volver atrás mediante botones.
      - Muestra un tooltip enriquecido con la ruta, tamaño, fecha de modificación y número de archivos.
      - Incorpora botones para exportar la estructura a CSV o PDF.
    """
    datos_json = json.dumps(datos, ensure_ascii=False)
    
    contenido_html = f"""\
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<title>Gráfico Sunburst Interactivo</title>
<style>
  /* ----- Reset y estilos generales ----- */
  * {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }}
  body {{
    font-family: 'Roboto', sans-serif;
    background: linear-gradient(135deg, #f4f7f9, #e2e8f0);
    color: #333;
  }}
  /* ----- Contenedor centrado ----- */
  .contenedor-central {{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
  }}
  /* ----- Tarjeta de Login ----- */
  .tarjeta-login {{
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    max-width: 400px;
    width: 90%;
    padding: 30px;
    margin-bottom: 20px;
  }}
  .tarjeta-login h1 {{
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
  }}
  .tarjeta-login label {{
    display: block;
    margin: 10px 0 5px;
    font-weight: 600;
  }}
  .tarjeta-login input[type="text"],
  .tarjeta-login input[type="password"] {{
    width: 100%;
    padding: 10px;
    border: 1px solid #dfe3e8;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 14px;
  }}
  .tarjeta-login button {{
    background: #3498db;
    border: none;
    border-radius: 5px;
    padding: 12px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  }}
  .tarjeta-login button:hover {{
    background: #2980b9;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transform: scale(1.03);
  }}
  .mensaje-error {{
    color: #c0392b;
    font-weight: 600;
    margin-top: 5px;
    min-height: 18px;
  }}
  /* ----- Contenedor del Gráfico ----- */
  #contenedor-grafico {{
    display: none;
    text-align: center;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }}
  .titulo-grafico {{
    font-size: 26px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20px;
  }}
  .controles-grafico, .controles-exportacion {{
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
  }}
  .controles-grafico button,
  .controles-exportacion button {{
    background: #27ae60;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  }}
  .controles-grafico button:hover,
  .controles-exportacion button:hover {{
    background: #2ecc71;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transform: scale(1.03);
  }}
  .grafico {{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    overflow: auto;
  }}
  /* ----- Tooltip mejorado ----- */
  .tooltip {{
    position: absolute;
    text-align: center;
    padding: 10px 12px;
    font: 13px sans-serif;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 6px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(-10px);
  }}
  .tooltip.show {{
    opacity: 1;
    transform: translateY(0);
  }}
  /* Responsividad del SVG */
  .grafico svg {{
    max-width: 100%;
    height: auto;
  }}
</style>
</head>
<body>

<div class="contenedor-central">
  <!-- FORMULARIO DE LOGIN -->
  <div class="tarjeta-login" id="tarjeta-login">
    <h1>Login</h1>
    <label for="usuario">Usuario</label>
    <input type="text" id="usuario" placeholder="Usuario" />
    <label for="contrasena">Contraseña</label>
    <input type="password" id="contrasena" placeholder="Contraseña" />
    <button onclick="intentarLogin()">Iniciar sesión</button>
    <div class="mensaje-error" id="mensaje-error"></div>
  </div>

  <!-- CONTENEDOR DEL GRÁFICO (oculto hasta el login) -->
  <div id="contenedor-grafico">
    <div class="titulo-grafico">Gráfico Sunburst Interactivo</div>
    <div class="controles-grafico">
      <button onclick="irAlPadre()">Ir al directorio padre</button>
      <button onclick="irARaiz()">Ir al directorio raíz</button>
    </div>
    <div class="controles-exportacion">
      <button onclick="exportarCSV()">Exportar CSV</button>
      <button onclick="exportarPDF()">Exportar PDF</button>
    </div>
    <div class="grafico">
      <svg id="sunburst" width="800" height="800"></svg>
    </div>
  </div>
</div>

<div class="tooltip" id="tooltip"></div>

<!-- D3.js v7 desde CDN -->
<script src="https://d3js.org/d3.v7.min.js"></script>
<!-- jsPDF para exportar PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
  const USUARIO_VALIDO = "cris";
  const CONTRASENA_VALIDA = "cris";

  let raiz;              // Raíz de la jerarquía
  let nodoActual;        // Nodo actualmente seleccionado (zoom)
  let rutasArcos;        // Referencia a los arcos del gráfico
  let contenedorArcos;   // Contenedor 'g' para los arcos
  let generadorArcos;    // Generador de arcos
  let svg;               // Referencia al elemento SVG
  const radio = 400;     // Radio del gráfico
  let particion;         // Layout de partición de d3

  // Datos jerárquicos obtenidos desde Python
  const datos = {datos_json};

  function intentarLogin() {{
    const campoUsuario = document.getElementById("usuario");
    const campoContrasena = document.getElementById("contrasena");
    const mensajeError = document.getElementById("mensaje-error");

    if (campoUsuario.value === USUARIO_VALIDO && campoContrasena.value === CONTRASENA_VALIDA) {{
      document.getElementById("tarjeta-login").style.display = "none";
      document.getElementById("contenedor-grafico").style.display = "block";
      iniciarSunburst();
    }} else {{
      mensajeError.textContent = "Usuario o contraseña inválidos";
    }}
  }}

  function iniciarSunburst() {{
    const ancho = 800;
    const formato = d3.format(",d");

    svg = d3.select("#sunburst")
      .attr("viewBox", [0, 0, ancho, ancho])
      .style("font", "12px sans-serif");

    contenedorArcos = svg.append("g")
      .attr("transform", "translate(" + (ancho / 2) + "," + (ancho / 2) + ")");

    raiz = d3.hierarchy(datos)
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value);

    particion = d3.partition().size([2 * Math.PI, radio]);
    particion(raiz);
    raiz.each(d => d.current = d);

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, raiz.children.length + 1));

    generadorArcos = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radio / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    const tooltip = d3.select("#tooltip");

    rutasArcos = contenedorArcos.selectAll("path")
      .data(raiz.descendants())
      .join("path")
        .attr("d", d => generadorArcos(d.current))
        .attr("fill", d => {{
          while (d.depth > 1) d = d.parent;
          return color(d.data.nombre);
        }})
        .attr("fill-opacity", d => arcoVisible(d.current) ? 0.8 : 0)
        .on("mouseover", function(event, d) {{
          let detalles = "";
          if(d.data.numero_archivos !== undefined && d.data.numero_archivos !== null) {{
            detalles += `<br>Número de archivos: ${{d.data.numero_archivos}}`;
          }}
          if(d.data.fecha_modificacion) {{
            detalles += `<br>Última modificación: ${{new Date(d.data.fecha_modificacion * 1000).toLocaleString()}}`;
          }}
          tooltip.classed("show", true)
                 .html(() => {{
                    const tamStr = d.value ? formato(d.value) + " bytes" : "0 bytes";
                    return `<strong>${{d.data.nombre}}</strong><br/>${{tamStr}}${{detalles}}`;
                 }})
                 .style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 28) + "px");
          d3.select(this)
            .attr("stroke", "#000")
            .attr("stroke-width", 1);
        }})
        .on("mousemove", function(event) {{
          d3.select("#tooltip")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        }})
        .on("mouseout", function() {{
          d3.select("#tooltip").classed("show", false);
          d3.select(this)
            .attr("stroke", null)
            .attr("stroke-width", null);
        }})
        .on("click", clicEnNodo);

    rutasArcos.filter(d => d.children).style("cursor", "pointer");
    nodoActual = raiz;
    window.clicEnNodo = clicEnNodo;
  }}

  function arcoVisible(d) {{
    return d.y1 <= radio && d.y0 >= 0 && d.x1 > d.x0;
  }}

  function clicEnNodo(event, p) {{
    if (p === nodoActual) return;
    nodoActual = p;

    raiz.each(d => {{
      const nuevoX0 = (d.x0 - p.x0) / (p.x1 - p.x0) * 2 * Math.PI;
      const nuevoX1 = (d.x1 - p.x0) / (p.x1 - p.x0) * 2 * Math.PI;
      d.target = {{
        x0: nuevoX0 < 0 ? 0 : nuevoX0,
        x1: nuevoX1 > 2 * Math.PI ? 2 * Math.PI : nuevoX1,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      }};
    }});

    const transicion = contenedorArcos.transition().duration(750);
    rutasArcos.transition(transicion)
      .tween("data", d => {{
        const interpolador = d3.interpolate(d.current, d.target);
        return t => d.current = interpolador(t);
      }})
      .attrTween("d", d => () => generadorArcos(d.current))
      .attr("fill-opacity", d => arcoVisible(d.target) ? 0.8 : 0);
  }}

  function irAlPadre() {{
    if (!nodoActual || !nodoActual.parent) return;
    window.clicEnNodo(new Event("click"), nodoActual.parent);
  }}

  function irARaiz() {{
    if (!raiz) return;
    window.clicEnNodo(new Event("click"), raiz);
  }}

  // Función para exportar la estructura a CSV
  function exportarCSV() {{
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nombre,Ruta,Tipo,Tamaño,Fecha Modificación,Número Archivos\\n";

    function recorrer(nodo) {{
      if(nodo.nombre) {{
        let fecha = nodo.fecha_modificacion ? new Date(nodo.fecha_modificacion * 1000).toLocaleString() : "";
        let numArch = nodo.numero_archivos !== undefined ? nodo.numero_archivos : "";
        csvContent += `"${{nodo.nombre}}","${{nodo.ruta || nodo.nombre}}","${{nodo.tipo || (nodo.value ? "archivo" : "directorio")}}","${{nodo.value || ""}}","${{fecha}}","${{numArch}}"\\n`;
      }}
      if(nodo.contenido) {{
        nodo.contenido.forEach(item => recorrer(item));
      }}
    }}
    // Empezamos a recorrer desde los datos originales (global 'datos')
    recorrer(datos);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "estructura_archivos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}

  // Función para exportar PDF usando jsPDF
  function exportarPDF() {{
    const {{ jsPDF }} = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Estructura de Archivos", 10, 20);
    // Aquí se puede mejorar recorriendo 'datos' para incluir detalles en el PDF.
    // También se podría capturar una imagen del gráfico.
    doc.save("estructura_archivos.pdf");
  }}
</script>
</body>
</html>
"""
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(contenido_html)

def main():
    # Ruta a escanear (usa una cadena "raw" para evitar problemas con las barras invertidas)
    ruta_raiz = r"C:\xampp\htdocs\Gestión Empresarial\Proyecto\096.implemnetar mejora en vistaTabla"
    archivo_salida = "estructura_archivos.json"
    archivo_html = "estructura_archivos_sunburst.html"
    solo_carpetas = True  # Cambiar a False para incluir archivos

    print("Escaneando el directorio raíz. Esto puede tardar un poco...")
    estructura_archivos = listar_archivos_y_carpetas_recursivo(ruta_raiz, solo_carpetas=solo_carpetas)

    print(f"Guardando los resultados en {archivo_salida}...")
    with open(archivo_salida, "w", encoding="utf-8") as f:
        json.dump(estructura_archivos, f, indent=4, ensure_ascii=False)

    print("Transformando datos para D3 sunburst...")
    datos_d3 = transformar_para_d3_sunburst(estructura_archivos, nombre_padre=ruta_raiz)

    print(f"Creando gráfico sunburst interactivo. Guardando en {archivo_html}...")
    crear_html_grafico_sunburst(datos_d3, archivo_html)

    print("¡Proceso completado!")

if __name__ == "__main__":
    main()
