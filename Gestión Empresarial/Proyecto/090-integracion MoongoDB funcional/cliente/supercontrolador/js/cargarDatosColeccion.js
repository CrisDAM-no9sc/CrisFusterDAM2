function cargarDatosColeccion(coleccion, formato = "json") {
    console.log("Cargando datos de la colección:", coleccion);

    const contenedor = document.querySelector("section");

    if (!contenedor) {
        console.error("Error: No se encontró ninguna <section> en el documento.");
        return;
    }

    // Limpiar la sección eliminando todos sus elementos hijos
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }

    contenedor.style.display = "flex"; 
    contenedor.style.flexWrap = "wrap"; 
    contenedor.style.gap = "20px"; 
    contenedor.style.justifyContent = "center"; // Centrar las tarjetas

    // 🔹 Realiza la solicitud al servidor con el formato deseado (JSON o XML)
    fetch(`../../servidor/?o=listadocumentos&coleccion=${coleccion}&formato=${formato}`)
        .then(response => {
            if (formato === "xml") {
                return response.text(); // Si es XML, obtenerlo como texto
            } else {
                return response.json(); // Si es JSON, convertirlo a objeto
            }
        })
        .then(datos => {
            console.log("Datos recibidos:", datos);
            
            if (formato === "xml") {
                contenedor.innerHTML = renderXMLToHTML(datos);
            } else {
                // 🔹 Generar tarjetas (cards) en lugar de solo HTML sin estructura
                datos.forEach(dato => {
                    const article = document.createElement("article");
                    article.classList.add("carta"); // Agregar clase para CSS
                    article.innerHTML = `
                        <h3>Documento ID: ${dato._id || "Sin ID"}</h3>
                        <div class="carta-contenedor">
                            ${renderJSONToHTML(dato)}
                        </div>
                        <button class="boton-accion">Ver Más</button>
                    `;

                    // Agregar botón al DOM
                    const boton = article.querySelector(".boton-accion");
                    boton.addEventListener("click", function () {
                        abrirModal(dato._id, dato);
                    });

                    contenedor.appendChild(article);
                });
            }
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
        });
}
// 🟢 Función para abrir el modal específico "modal-documento"
function abrirModal(id, dato) {
    // Verificar si el modal ya existe, si no, lo creamos
    let modal = document.getElementById("modal-documento");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-documento";
        modal.classList.add("modal");
        document.body.appendChild(modal);
    }

    // Generar contenido del modal
    modal.innerHTML = `
        <div class="modal-contenido">
            <h2>Detalles del Documento</h2>
            <p><strong>ID:</strong> ${id}</p>
            <div>${renderJSONToHTML(dato)}</div>
            <button class="cerrar-modal" onclick="cerrarModal()">Cerrar</button>
        </div>
    `;

    // Mostrar el modal
    modal.style.display = "flex";
}

//Función para cerrar el modal específico "modal-documento"
function cerrarModal() {
    const modal = document.getElementById("modal-documento");
    if (modal) {
        modal.style.display = "none";
    }
}
///////////////////////// CONVERTIR JSON en HTML ////////////////////////////////
// Función recursiva para convertir JSON en HTML estructurado
function renderJSONToHTML(json) {
    if (typeof json !== "object" || json === null) {
        return `<span>${json}</span>`; // Para valores simples
    }

    if (Array.isArray(json)) {
        return `
            <ul style="list-style-type: square; margin-left: 20px;">
                ${json.map(item => `<li>${renderJSONToHTML(item)}</li>`).join("")}
            </ul>
        `;
    }

    // Para objetos
    return `
        <div style="margin-left: 10px;">
            ${Object.entries(json).map(([key, value]) => `
                <div style="margin-bottom: 8px;">
                    <strong style="color: #333;">${key}:</strong> ${renderJSONToHTML(value)}
                </div>
            `).join("")}
        </div>
    `;
}

///////////////////////// CONVERTIR XML en HTML ////////////////////////////////
function renderXMLToHTML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length) {
        return "<p>Error al parsear XML</p>";
    }

    return `<div>${convertXMLNodeToHTML(xmlDoc.documentElement)}</div>`;
}

///////////////////////// RECORRER LOS NODOS XML ////////////////////////////////
function convertXMLNodeToHTML(node) {
    if (!node.children.length) {
        return `<span>${node.tagName}: ${node.textContent}</span><br>`;
    }

    return `
        <div style="margin-left: 15px; border-left: 2px solid #ccc; padding-left: 10px;">
            <strong style="color: #333;">${node.tagName}</strong>
            ${Array.from(node.children).map(child => convertXMLNodeToHTML(child)).join("")}
        </div>
    `;
}
