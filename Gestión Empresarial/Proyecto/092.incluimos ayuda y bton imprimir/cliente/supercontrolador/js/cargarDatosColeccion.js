/*

function cargarDatosColeccion(coleccion) {
    console.log("Cargando datos para la colección:", coleccion);

    let tabla = document.querySelector("table");
    if (!tabla) {
        console.error("ERROR: No se encontró la tabla en el DOM.");
        return;
    }

    // Ocultar la tabla antes de mostrar los documentos
    tabla.style.display = "none";

    // Obtener la sección donde se mostrarán los documentos
    let contenedor = document.querySelector("section");
    if (!contenedor) {
        console.error("ERROR: No se encontró el contenedor <section>.");
        return;
    }

    // Eliminar contenido previo antes de cargar los nuevos documentos
    let docsContainer = document.querySelector("#docsContainer");
    if (docsContainer) {
        docsContainer.remove(); // Si ya existe, lo eliminamos para evitar duplicados
    }

    // Crear un nuevo contenedor para los documentos
    docsContainer = document.createElement("div");
    docsContainer.id = "docsContainer"; // ID para identificarlo fácilmente
    docsContainer.style.display = "flex";
    docsContainer.style.flexDirection = "column";
    docsContainer.style.gap = "10px";
    docsContainer.style.padding = "10px";

    // Agregar el contenedor a la sección principal
    contenedor.appendChild(docsContainer);

    // Realizar la solicitud al servidor
    fetch("../../servidor/?o=listacolecciones&coleccion=" + coleccion)
        .then(response => response.json())
        .then(datos => {
            console.log("Datos de la colección recibidos:", datos);

            // Generar las tarjetas de documentos dinámicamente
            datos.forEach(function (dato) {
                let card = document.createElement("article");
                card.classList.add("document-card"); // Aplica estilos con CSS si es necesario
                card.style.border = "1px solid #ccc";
                card.style.padding = "10px";
                card.style.borderRadius = "5px";
                card.style.background = "#f8f8f8";

                let titulo = document.createElement("h3");
                titulo.textContent = dato["Tables_in_crismon1"];

                let comentario = document.createElement("p");
                comentario.textContent = dato["Comentario"] || "Sin comentarios";

                card.appendChild(titulo);
                card.appendChild(comentario);

                docsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error(" Error al cargar los datos:", error);
        });
}
*/

function cargarDatosColeccion(coleccion) {
    console.log("📌 Cargando datos para la colección:", coleccion);

    let tabla = document.querySelector("table");
    if (!tabla) {
        console.error("❌ ERROR: No se encontró la tabla en el DOM.");
        return;
    }

    // ✅ Ocultar la tabla antes de mostrar los documentos
    tabla.style.display = "none";

    // ✅ Obtener la sección donde se mostrarán los documentos
    let contenedor = document.querySelector("section");
    if (!contenedor) {
        console.error("❌ ERROR: No se encontró el contenedor <section>.");
        return;
    }

    // ✅ Eliminar contenido previo antes de cargar los nuevos documentos
    let docsContainer = document.querySelector("#docsContainer");
    if (docsContainer) {
        docsContainer.remove(); // Si ya existe, lo eliminamos para evitar duplicados
    }

    // ✅ Crear un nuevo contenedor para los documentos
    docsContainer = document.createElement("div");
    docsContainer.id = "docsContainer"; // ID para identificarlo fácilmente
    docsContainer.style.display = "flex";
    docsContainer.style.flexDirection = "column";
    docsContainer.style.gap = "10px";
    docsContainer.style.padding = "10px";

    // ✅ Agregar el contenedor a la sección principal
    contenedor.appendChild(docsContainer);

    // ✅ Realizar la solicitud al servidor para obtener los documentos de la colección
    fetch(`../../servidor/?o=listadocumentos&coleccion=${coleccion}`)
        .then(response => response.json())
        .then(datos => {
            console.log("📌 Datos de la colección recibidos:", datos);

            // ✅ Si no hay documentos, mostrar un mensaje
            if (datos.length === 0) {
                docsContainer.innerHTML = "<p style='padding: 20px; text-align: center; font-weight: bold;'>No hay documentos en esta colección.</p>";
                return;
            }

            // ✅ Generar las tarjetas de documentos dinámicamente
            datos.forEach(function (dato) {
                let card = document.createElement("article");
                card.classList.add("document-card"); // Aplica estilos con CSS si es necesario
                card.style.border = "1px solid #ccc";
                card.style.padding = "10px";
                card.style.borderRadius = "5px";
                card.style.background = "#f8f8f8";

                let titulo = document.createElement("h3");
                titulo.textContent = dato["_id"] || "Documento sin ID";

                let contenido = document.createElement("div");
                contenido.innerHTML = renderJSONToHTML(dato); // ✅ Convertir JSON a HTML

                card.appendChild(titulo);
                card.appendChild(contenido);

                docsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("❌ Error al cargar los datos de la colección:", error);
        });
}

// ✅ Función recursiva para convertir JSON en HTML
function renderJSONToHTML(json) {
    if (typeof json !== "object" || json === null) {
        return `<span>${json}</span>`; // Si es un valor simple, devolverlo como texto.
    }

    if (Array.isArray(json)) {
        // ✅ Manejar arrays
        return `
            <ul style="list-style-type: square; margin-left: 20px;">
                ${json.map(item => `<li>${renderJSONToHTML(item)}</li>`).join("")}
            </ul>
        `;
    }

    // ✅ Manejar objetos
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
