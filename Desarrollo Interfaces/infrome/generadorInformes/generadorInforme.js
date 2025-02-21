
const generadorInforme = (function () {
    // ================== Funciones de utilidad para el mapa de calor ==================
function hexAHsl(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0; // Sin color
    } else {
      const delta = max - min;
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      switch (max) {
        case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
        case g: h = (b - r) / delta + 2; break;
        case b: h = (r - g) / delta + 4; break;
      }
      h /= 6;
    }
  
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
  
  function interpolarHsl(hsl1, hsl2, porcentaje) {
    const regex = /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/;
    const match1 = hsl1.match(regex);
    const match2 = hsl2.match(regex);
  
    if (!match1 || !match2) {
      throw new Error("Formato HSL inválido.");
    }
  
    let h1 = parseInt(match1[1], 10), s1 = parseInt(match1[2], 10), l1 = parseInt(match1[3], 10);
    let h2 = parseInt(match2[1], 10), s2 = parseInt(match2[2], 10), l2 = parseInt(match2[3], 10);
  
    let h = h1 + (h2 - h1) * porcentaje;
    let s = s1 + (s2 - s1) * porcentaje;
    let l = l1 + (l2 - l1) * porcentaje;
  
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  }
  
  function esColorOscuro(hsl) {
    const match = hsl.match(/^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/);
    if (!match) return false;
    return parseInt(match[3], 10) < 50;
  }
  
  // ================== Clase Grafico ==================
  class Grafico {
    constructor(contenedorSelector, datos) {
      this.contenedores = document.querySelectorAll(contenedorSelector);
      this.datos = datos;
      // Generamos 10 colores distintos
      this.colores = this.generarColores(10);
      this.inicializar();
    }
  
    inicializar() {
      this.contenedores.forEach(contenedor => {
        contenedor.classList.add("generador-informe");
      });
    }
  
    generarColores(cantidad) {
      const colores = [];
      const tonoBase = Math.random() * 360;
      for (let i = 0; i < cantidad; i++) {
        const tono = (tonoBase + (i * 360 / cantidad)) % 360;
        colores.push(`hsl(${tono}, 70%, 60%)`);
      }
      return colores;
    }
  
    // =============  AGRUPACIONES  =============
  
    // 1. Agrupar por navegador (para el pastel)
    agruparPorNavegador() {
      const agrupado = {};
      this.datos.forEach(item => {
        const navegador = item.navegador || "Desconocido";
        if (!agrupado[navegador]) {
          agrupado[navegador] = { 
            navegador, 
            valor: 0,
            ips: new Set()
          };
        }
        agrupado[navegador].valor++;
        agrupado[navegador].ips.add(item.ip);
      });
      return Object.values(agrupado).map(obj => ({
        navegador: obj.navegador,
        valor: obj.valor,
        ips: Array.from(obj.ips).join(", ")
      }));
    }
  
    // 2. Agrupar por país (para las barras, sumando bloqueos)
    agruparPorPais() {
      const agrupado = {};
      this.datos.forEach(item => {
        const pais = item.pais || "SIN";
        if (!agrupado[pais]) {
          agrupado[pais] = { 
            pais, 
            bloqueos: 0
          };
        }
        agrupado[pais].bloqueos += Number(item.bloqueo_por_pais) || 0;
      });
      return Object.values(agrupado);
    }
  
    // 3. Agrupar por fecha (para el mapa de calor)
    agruparPorFecha() {
      const agrupado = {};
      this.datos.forEach(item => {
        const fecha = item.fecha_registro;
        if (!fecha) return;
        if (!agrupado[fecha]) {
          agrupado[fecha] = 0;
        }
        agrupado[fecha]++;
      });
      return agrupado;
    }
  
    // =============  GRÁFICO PASTEL  =============
    crearGraficoPastel(contenedor) {
        const datosAgrupados = this.agruparPorNavegador();
        const total = datosAgrupados.reduce((acc, item) => acc + item.valor, 0);
      
        // Aumentamos el tamaño del SVG a 400×400
        const ancho = 400;
        const alto = 400;
      
        // Ajustamos el radio en función de ancho/alto
        const radio = Math.min(ancho, alto) / 2 - 20;
      
        const svg = this.crearSVG(ancho, alto);
        const grupo = document.createElementNS("http://www.w3.org/2000/svg", "g");
        grupo.setAttribute("transform", `translate(${ancho / 2}, ${alto / 2})`);
      
        let anguloInicio = 0;
        datosAgrupados.forEach((item, indice) => {
          const porcentaje = (item.valor / total) * 100;
          const anguloFin = anguloInicio + (porcentaje / 100) * 360;
      
          // Coordenadas polares
          const x1 = radio * Math.cos((Math.PI * anguloInicio) / 180);
          const y1 = radio * Math.sin((Math.PI * anguloInicio) / 180);
          const x2 = radio * Math.cos((Math.PI * anguloFin) / 180);
          const y2 = radio * Math.sin((Math.PI * anguloFin) / 180);
      
          const banderaArco = porcentaje > 50 ? 1 : 0;
          const datosCamino = `
            M 0 0
            L ${x1} ${y1}
            A ${radio} ${radio} 0 ${banderaArco} 1 ${x2} ${y2}
            Z
          `;
          const sector = document.createElementNS("http://www.w3.org/2000/svg", "path");
          sector.setAttribute("d", datosCamino);
          sector.setAttribute("fill", this.colores[indice % this.colores.length]);
          sector.setAttribute("stroke", "#fff");
          sector.setAttribute("stroke-width", "2");
      
          // Tooltip nativo con <title>
          const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
          title.textContent = `${item.navegador} (${item.valor} visitas)`;
          sector.appendChild(title);
      
          // Texto dentro del sector
          const anguloMedio = (anguloInicio + anguloFin) / 2;
          const xText = (radio * 0.5) * Math.cos((Math.PI * anguloMedio) / 180);
          const yText = (radio * 0.5) * Math.sin((Math.PI * anguloMedio) / 180);
          const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
          texto.setAttribute("x", xText);
          texto.setAttribute("y", yText);
          texto.setAttribute("fill", "#fff");
          texto.setAttribute("font-size", "10");
          texto.setAttribute("text-anchor", "middle");
          texto.textContent = item.valor;
      
          grupo.appendChild(sector);
          grupo.appendChild(texto);
          anguloInicio = anguloFin;
        });
      
        svg.appendChild(grupo);
        contenedor.appendChild(svg);
        
        // Tabla de resumen opcional
        this.crearTabla(contenedor, datosAgrupados, ["navegador", "valor", "ips"]);
      }
  
    // =============  GRÁFICO DE BARRAS  =============
    crearGraficoBarras(contenedor) {
      const datosAgrupados = this.agruparPorPais();
      const ancho = 500;
      const alto = 500;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const chartWidth = ancho - margin.left - margin.right;
      const chartHeight = alto - margin.top - margin.bottom;
      
      const maxValor = Math.max(...datosAgrupados.map(d => d.bloqueos));
      const svg = this.crearSVG(ancho, alto);
      const grupo = document.createElementNS("http://www.w3.org/2000/svg", "g");
      grupo.setAttribute("transform", `translate(${margin.left}, ${margin.top})`);
  
      const barWidth = chartWidth / datosAgrupados.length;
      datosAgrupados.forEach((item, indice) => {
        const barHeight = (maxValor === 0) ? 0 : (item.bloqueos / maxValor) * chartHeight;
  
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", indice * barWidth);
        rect.setAttribute("y", chartHeight - barHeight);
        rect.setAttribute("width", barWidth - 5);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", this.colores[indice % this.colores.length]);
  
        // Tooltip
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `País: ${item.pais} - Bloqueos: ${item.bloqueos}`;
        rect.appendChild(title);
  
        grupo.appendChild(rect);
  
        // Etiqueta debajo de la barra
        const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
        texto.setAttribute("x", (indice * barWidth) + (barWidth - 5) / 2);
        texto.setAttribute("y", chartHeight + 15);
        texto.setAttribute("text-anchor", "middle");
        texto.setAttribute("font-size", "10");
        texto.textContent = item.pais;
        grupo.appendChild(texto);
      });
      svg.appendChild(grupo);
      contenedor.appendChild(svg);
      // Tabla de resumen opcional
      this.crearTabla(contenedor, datosAgrupados, ["pais", "bloqueos"]);
    }
  
    // =============  MAPA DE CALOR (FECHAS)  =============
    crearMapaCalor(contenedor) {
      const agrupado = this.agruparPorFecha();
      const fechas = Object.keys(agrupado);
      if (fechas.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No hay datos de fecha_registro.";
        contenedor.appendChild(msg);
        return;
      }
  
      const tabla = document.createElement("table");
      tabla.classList.add("tabla-mapa-calor");
  
      // Encabezado
      const thead = document.createElement("thead");
      const trHead = document.createElement("tr");
      ["FECHA", "REGISTROS"].forEach(texto => {
        const th = document.createElement("th");
        th.textContent = texto;
        trHead.appendChild(th);
      });
      thead.appendChild(trHead);
      tabla.appendChild(thead);
  
      // Cuerpo
      const tbody = document.createElement("tbody");
      fechas.forEach(fecha => {
        const fila = document.createElement("tr");
        const tdFecha = document.createElement("td");
        const tdCantidad = document.createElement("td");
  
        const cantidad = agrupado[fecha];
        tdFecha.textContent = fecha;
        tdCantidad.textContent = cantidad;
        fila.appendChild(tdFecha);
        fila.appendChild(tdCantidad);
        tbody.appendChild(fila);
      });
      tabla.appendChild(tbody);
      contenedor.appendChild(tabla);
  
      // Aplicar el mapeo de colores
      this.aplicarMapaCalorColor(tabla);
    }
  
    aplicarMapaCalorColor(tabla) {
      const colorClaroHSL = hexAHsl("#C3EEE6"); // Color claro
      const colorOscuroHSL = hexAHsl("#00776B"); // Color oscuro
  
      const celdas = tabla.querySelectorAll("tbody td:nth-child(2)");
      let valores = [];
      celdas.forEach(celda => {
        let valor = parseFloat(celda.textContent.trim());
        if (!isNaN(valor)) valores.push(valor);
      });
      if (valores.length === 0) return;
      let maximo = Math.max(...valores);
      let minimo = Math.min(...valores);
      let rango = maximo - minimo || 1;
  
      celdas.forEach(celda => {
        let valor = parseFloat(celda.textContent.trim());
        if (isNaN(valor)) return;
        let porcentaje = (valor - minimo) / rango;
        let colorFinalHsl = interpolarHsl(colorClaroHSL, colorOscuroHSL, porcentaje);
        celda.style.transition = "background-color 0.5s ease-in-out";
        celda.style.backgroundColor = colorFinalHsl;
        celda.style.color = esColorOscuro(colorFinalHsl) ? "white" : "black";
      });
    }
  
    // =============  Utilidad para crear SVG  =============
    crearSVG(ancho, alto) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", ancho);
      svg.setAttribute("height", alto);
      svg.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);
      return svg;
    }
  
    // =============  Tabla de datos opcional  =============
    crearTabla(contenedor, datos, columnas = []) {
      if (!datos || datos.length === 0) return;
  
      const tabla = document.createElement("table");
  
      // Encabezados
      const thead = document.createElement("thead");
      const encabezado = document.createElement("tr");
      const keys = columnas.length ? columnas : Object.keys(datos[0]);
      keys.forEach(campo => {
        const th = document.createElement("th");
        th.textContent = campo.toUpperCase();
        encabezado.appendChild(th);
      });
      thead.appendChild(encabezado);
      tabla.appendChild(thead);
  
      // Filas
      const tbody = document.createElement("tbody");
      datos.forEach(item => {
        const fila = document.createElement("tr");
        keys.forEach(campo => {
          const td = document.createElement("td");
          td.textContent = item[campo];
          fila.appendChild(td);
        });
        tbody.appendChild(fila);
      });
      tabla.appendChild(tbody);
  
      contenedor.appendChild(tabla);
    }
  }
  
  // ========== Exportamos la clase ==========
  return {
    Grafico: Grafico
  };
  })();