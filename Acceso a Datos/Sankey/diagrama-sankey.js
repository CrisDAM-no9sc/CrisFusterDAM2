

(function (global) {
  const DiagramaSankey = {};

  /**
   * Crea un diagrama Sankey con datos y configuración especificada.
   * @param {Object} config - Configuración del diagrama
   * @param {string|HTMLElement} config.element - Selector o elemento donde se creará el diagrama
   * @param {Object} config.data - Datos para el Sankey:
   *   {
   *     nodes: [
   *       { name: "Nodo A", color: "#xxxxxx" },
   *       { name: "Nodo B", color: "#xxxxxx" },
   *       ...
   *     ],
   *     links: [
   *       { source: "Nodo A", target: "Nodo B", value: 10 },
   *       { source: 1, target: 2, value: 15 }, // también se aceptan índices
   *       ...
   *     ]
   *   }
   * @param {number} config.width - Ancho total del diagrama (SVG).
   * @param {number} config.height - Alto total del diagrama (SVG).
   * @param {number} [config.nodeWidth=20] - Ancho visual de cada nodo.
   * @param {number} [config.nodePadding=10] - Espaciado vertical entre nodos.
   * @param {number} [config.curvature=0.5] - Factor de curvatura (0 a 1) de los enlaces.
   * @param {number} [config.minNodeHeight=20] - Altura mínima para cada nodo (evita nodos invisibles).
   */
  DiagramaSankey.crearDiagramaSankey = function(config) {
    const {
      element,
      data,
      width,
      height,
      nodeWidth = 20,
      nodePadding = 10,
      curvature = 0.5,
      minNodeHeight = 20
    } = config;

    // 1) Localizar el contenedor (por ID, clase, o directamente un elemento HTML).
    let container;
    if (typeof element === 'string') {
      container = document.querySelector(element);
    } else {
      container = element;
    }
    if (!container) {
      throw new Error("No se encontró el contenedor para el diagrama Sankey");
    }

    // Limpiar todo lo que haya dentro del contenedor
    container.innerHTML = '';

    // 2) Crear tooltip (un div flotante) para mostrar información
    const tooltip = crearTooltip();

    // 3) Crear un elemento SVG donde dibujaremos el diagrama
    const svg = crearElementoSVG('svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.classList.add('diagramasankey-svg');
    container.appendChild(svg);

    // Contenedor <defs> para gradientes y definiciones
    const defs = crearElementoSVG('defs');
    svg.appendChild(defs);

    // 4) Preparar nodos
    // - Convertimos cada objeto de "nodes" en una estructura interna que guardará:
    //   índices, vínculos de entrada/salida, posiciones, etc.
    const nodes = data.nodes.map((d, i) => {
      return {
        index: i,
        name: d.name || `Nodo ${i}`,
        color: d.color || colorAleatorio(),
        sourceLinks: [],
        targetLinks: [],
        valueIn: 0,
        valueOut: 0,
        linkOffsetOut: 0,
        linkOffsetIn: 0
      };
    });

    // Tabla para mapear "nombre del nodo" -> "índice en el array"
    const nameToIndex = {};
    nodes.forEach((node, i) => {
      nameToIndex[node.name] = i;
    });

    // 5) Preparar enlaces (links)
    // - Pueden venir con "source"/"target" como texto o índice;
    //   si es texto, lo convertimos usando nameToIndex.
    const links = data.links.map(link => {
      let sourceIndex, targetIndex;

      if (typeof link.source === 'string') {
        sourceIndex = nameToIndex[link.source];
        if (sourceIndex === undefined) {
          throw new Error(`Nodo fuente "${link.source}" no encontrado`);
        }
      } else {
        sourceIndex = link.source;
      }

      if (typeof link.target === 'string') {
        targetIndex = nameToIndex[link.target];
        if (targetIndex === undefined) {
          throw new Error(`Nodo destino "${link.target}" no encontrado`);
        }
      } else {
        targetIndex = link.target;
      }

      return {
        source: sourceIndex,
        target: targetIndex,
        value: +link.value // Aseguramos que sea numérico
      };
    });

    // 6) Calcular información de flujos para cada nodo
    // - valueOut (suma salidas), valueIn (suma entradas)
    links.forEach(link => {
      const s = nodes[link.source];
      const t = nodes[link.target];
      s.sourceLinks.push(link);
      t.targetLinks.push(link);
      s.valueOut += link.value;
      t.valueIn += link.value;
    });

    // 7) Asignar columnas/capas
    //  - Tomamos los nodos que no reciben nada (valueIn=0) como fuente
    const sourceNodes = nodes.filter(n => n.valueIn === 0);
    asignarCapasNodos(nodes, sourceNodes);

    // Sacar la capa máxima
    const maxLayer = Math.max(...nodes.map(d => d.layer));

    // Calcular posición horizontal (x) de cada capa
    const xScale = (width - nodeWidth) / maxLayer;
    nodes.forEach(n => {
      n.x0 = n.layer * xScale;
      n.x1 = n.x0 + nodeWidth;
    });

    // Agrupar nodos por capas y distribuirlos verticalmente
    const layers = [];
    for (let i = 0; i <= maxLayer; i++) {
      layers[i] = [];
    }
    nodes.forEach(n => {
      layers[n.layer].push(n);
    });
    layers.forEach(layerNodes => {
      // Orden opcional: de mayor valorOut a menor
      layerNodes.sort((a, b) => b.valueOut - a.valueOut);
      distribuirNodosEnCapa(layerNodes, height, nodePadding, minNodeHeight);
    });

    // 8) Dibujar los enlaces como <path> curvos
    links.forEach((link, idx) => {
      const source = nodes[link.source];
      const target = nodes[link.target];

      // Cuánto ancho asignar al enlace con base en la salida total del source
      const totalSourceValue = source.sourceLinks.reduce((sum, l) => sum + l.value, 0);
      const linkWidthScale = (source.y1 - source.y0 - (source.sourceLinks.length - 1) * nodePadding) / totalSourceValue;
      const linkHeight = link.value * linkWidthScale;

      // Posición vertical de partida (offset)
      const sy0 = source.y0 + source.linkOffsetOut + linkHeight / 2;
      source.linkOffsetOut += linkHeight + nodePadding;
      const ty0 = target.y0 + target.linkOffsetIn + linkHeight / 2;
      target.linkOffsetIn += linkHeight + nodePadding;

      // Guardamos estos desplazamientos para actualizarlos si se arrastra un nodo
      link.sy = sy0 - source.y0;
      link.ty = ty0 - target.y0;

      // Definir color o gradiente
      let linkStroke;
      if (source.color === target.color) {
        // Si ambos nodos tienen mismo color, usa ese color sin gradiente
        linkStroke = source.color;
      } else {
        // Crear gradiente
        const gradientId = `gradient-${source.index}-${target.index}-${idx}`;
        const linearGradient = crearElementoSVG('linearGradient');
        linearGradient.setAttribute('id', gradientId);
        linearGradient.setAttribute('x1', '0%');
        linearGradient.setAttribute('y1', '0%');
        linearGradient.setAttribute('x2', '100%');
        linearGradient.setAttribute('y2', '0%');

        const stop1 = crearElementoSVG('stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', source.color);
        linearGradient.appendChild(stop1);

        const stop2 = crearElementoSVG('stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', target.color);
        linearGradient.appendChild(stop2);

        defs.appendChild(linearGradient);
        linkStroke = `url(#${gradientId})`;
      }

      // Crear path <path> en SVG
      const path = crearElementoSVG('path');
      path.setAttribute('class', 'diagramasankey-link');
      path.setAttribute('d', pathSankey(source.x1, sy0, target.x0, ty0, curvature));
      path.setAttribute('stroke', linkStroke);
      path.setAttribute('stroke-width', linkHeight);
      path.setAttribute('fill', 'none');
      path.style.transition = "stroke-opacity 0.3s ease";
      path.style.strokeOpacity = "0.2";

      // Eventos para el tooltip
      path.addEventListener('mouseover', (event) => {
        mostrarTooltip(
          tooltip, 
          `Enlace: ${source.name} → ${target.name}<br>Valor: ${link.value}`,
          event.clientX,
          event.clientY
        );
        path.style.strokeOpacity = 0.7;
      });
      path.addEventListener('mousemove', (event) => {
        mostrarTooltip(
          tooltip, 
          `Enlace: ${source.name} → ${target.name}<br>Valor: ${link.value}`,
          event.clientX,
          event.clientY
        );
      });
      path.addEventListener('mouseout', () => {
        ocultarTooltip(tooltip);
        path.style.strokeOpacity = 0.2;
      });

      svg.appendChild(path);

      // Guardar referencia para actualizar la ruta si se mueve el nodo
      link.path = path;
    });

    // 9) Habilitar arrastrar y soltar (drag & drop) de nodos
    let currentDraggedNode = null;
    let dragStartY = 0;
    let nodeStartY = 0;

    // Crear elementos para cada nodo
    nodes.forEach(node => {
      const g = crearElementoSVG('g');
      g.setAttribute('class', 'diagramasankey-node');

      const rect = crearElementoSVG('rect');
      rect.setAttribute('x', node.x0);
      rect.setAttribute('y', node.y0);
      rect.setAttribute('width', nodeWidth);
      rect.setAttribute('height', node.y1 - node.y0);
      rect.setAttribute('fill', node.color);
      rect.setAttribute('stroke', '#ffffff');
      rect.setAttribute('rx', 5);
      rect.setAttribute('ry', 5);
      rect.setAttribute('stroke-width', 2);
      rect.classList.add('diagramasankey-rect');
      rect.style.transition = "fill 0.3s ease, y 0.3s ease";

      // Tooltip de nodo
      rect.addEventListener('mouseover', (event) => {
        mostrarTooltip(
          tooltip,
          `Nodo: ${node.name}<br>Entrada: ${node.valueIn}<br>Salida: ${node.valueOut}`,
          event.clientX,
          event.clientY
        );
        rect.style.fill = 'orange';
      });
      rect.addEventListener('mousemove', (event) => {
        mostrarTooltip(
          tooltip,
          `Nodo: ${node.name}<br>Entrada: ${node.valueIn}<br>Salida: ${node.valueOut}`,
          event.clientX,
          event.clientY
        );
      });
      rect.addEventListener('mouseout', () => {
        ocultarTooltip(tooltip);
        rect.style.fill = node.color;
      });

      g.appendChild(rect);

      // Etiqueta de texto
      const text = crearElementoSVG('text');
      text.setAttribute('x', node.x0 + nodeWidth / 2);
      text.setAttribute('y', node.y0 + (node.y1 - node.y0) / 2);
      text.setAttribute('dy', '0.35em');
      text.setAttribute('text-anchor', 'middle');
      text.textContent = node.name;
      text.classList.add('diagramasankey-text');
      g.appendChild(text);

      // Guardar para usarlos en el drag
      node.rect = rect;
      node.text = text;
      node.height = node.y1 - node.y0;

      // Evento para iniciar arrastre
      g.addEventListener('mousedown', (event) => {
        event.preventDefault();
        currentDraggedNode = node;
        dragStartY = event.clientY;
        nodeStartY = node.y0;
      });

      svg.appendChild(g);
    });

    // Mover el nodo mientras arrastramos
    function onMouseMove(event) {
      if (!currentDraggedNode) return;
      const deltaY = event.clientY - dragStartY;
      const newY = nodeStartY + deltaY;
      // Ajustar la posición del nodo
      currentDraggedNode.y0 = newY;
      currentDraggedNode.y1 = newY + currentDraggedNode.height;
      currentDraggedNode.rect.setAttribute('y', newY);
      currentDraggedNode.text.setAttribute('y', newY + currentDraggedNode.height / 2);

      // Actualizar los enlaces conectados
      currentDraggedNode.sourceLinks.forEach(link => actualizarRutaLink(link));
      currentDraggedNode.targetLinks.forEach(link => actualizarRutaLink(link));
    }

    function onMouseUp() {
      if (currentDraggedNode) {
        currentDraggedNode = null;
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Función para recalcular la ruta de un enlace cuando se mueve un nodo
    function actualizarRutaLink(link) {
      const source = nodes[link.source];
      const target = nodes[link.target];
      const sy = source.y0 + link.sy;
      const ty = target.y0 + link.ty;
      link.path.setAttribute('d', pathSankey(source.x1, sy, target.x0, ty, curvature));
    }
  };

  // ------------------------------------------------------------------
  // Funciones auxiliares
  // ------------------------------------------------------------------

  // Asigna la propiedad "layer" a cada nodo haciendo un BFS o recorrido análogo
  function asignarCapasNodos(nodes, sourceNodes) {
    nodes.forEach(n => n.layer = undefined);
    const queue = [];
    sourceNodes.forEach(s => {
      s.layer = 0;
      queue.push(s);
    });
    while (queue.length) {
      const current = queue.shift();
      const currentLayer = current.layer;
      current.sourceLinks.forEach(link => {
        const targetNode = nodes[link.target];
        if (targetNode.layer == null || targetNode.layer < currentLayer + 1) {
          targetNode.layer = currentLayer + 1;
          queue.push(targetNode);
        }
      });
    }
  }

  // Distribuye los nodos verticalmente dentro de la capa
  function distribuirNodosEnCapa(layerNodes, totalHeight, nodePadding, minNodeHeight) {
    if (!layerNodes.length) return;
    // Suma de (valueIn, valueOut) para repartir espacio
    const totalValue = layerNodes.reduce((sum, n) => sum + Math.max(n.valueIn, n.valueOut), 0);
    let yStart = 0;
    layerNodes.forEach(n => {
      const nodeValue = Math.max(n.valueIn, n.valueOut);
      let nodeHeight = (nodeValue / totalValue) * (totalHeight - nodePadding * (layerNodes.length - 1));
      if (nodeHeight < minNodeHeight) {
        nodeHeight = minNodeHeight;
      }
      n.height = nodeHeight;
      n.y0 = yStart;
      n.y1 = yStart + nodeHeight;
      yStart += nodeHeight + nodePadding;
    });
  }

  // Genera la ruta de tipo Sankey con curvatura
  function pathSankey(x0, y0, x1, y1, curvature) {
    const xi = interpolarNumero(x0, x1);
    const x2 = xi(curvature);
    const x3 = xi(1 - curvature);
    return `M${x0},${y0} C${x2},${y0} ${x3},${y1} ${x1},${y1}`;
  }

  function interpolarNumero(a, b) {
    return function(t) {
      return a + (b - a) * t;
    };
  }

  // Crear elemento SVG con su namespace
  function crearElementoSVG(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
  }

  // Generar un color hex aleatorio
  function colorAleatorio() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Crear tooltip
  function crearTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'diagramasankey-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.transition = 'opacity 0.3s';
    tooltip.style.opacity = '0';
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function mostrarTooltip(tooltip, content, x, y) {
    tooltip.innerHTML = content;
    tooltip.style.left = (x + 10) + 'px';
    tooltip.style.top = (y + 10) + 'px';
    tooltip.style.opacity = '1';
  }

  function ocultarTooltip(tooltip) {
    tooltip.style.opacity = '0';
  }

  // Exportar como librería universal
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiagramaSankey;
  } else {
    global.DiagramaSankey = DiagramaSankey;
  }

})(this);