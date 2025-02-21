
// Función principal para cargar documentos y mostrar el modal al hacer clic

// Cargar documentos desde MongoDB y mostrarlos en tarjetas
function cargarDatosColeccion(coleccion) {
    console.log("Cargando datos para la colección:", coleccion);

    let tabla = document.querySelector("table");
    if (tabla) {
        tabla.style.display = "none";
    }

    let contenedor = document.querySelector("section");

    let docsContainer = document.querySelector("#docsContainer");
    if (docsContainer) {
        docsContainer.remove();
    }

    docsContainer = document.createElement("div");
    docsContainer.id = "docsContainer";
    contenedor.appendChild(docsContainer);

    fetch(`../../servidor/?o=listadocumentos&coleccion=${coleccion}`)
        .then(response => response.json())
        .then(datos => {
            console.log("Datos recibidos:", datos);

            if (datos.length === 0) {
                docsContainer.innerHTML = "<p class='sin-documentos'>No hay documentos en esta colección.</p>";
                return;
            }

            // Crear tarjetas dinámicas
            datos.forEach((dato) => {
                let card = document.createElement("article");
                card.classList.add("document-card");

                let titulo = document.createElement("h3");
                // Extraer correctamente el ID del documento
                const id = dato._id && dato._id.$oid ? dato._id.$oid : dato._id;
                titulo.textContent = id;

                let contenido = document.createElement("div");
                contenido.innerHTML = renderJSONToHTML(dato);

                // Evento para abrir el modal con los detalles
                card.addEventListener("click", () => {
                    mostrarModalDocumento(coleccion, dato, id);
                });

                card.appendChild(titulo);
                card.appendChild(contenido);
                docsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar los documentos:", error);
        });
}

///////////////////////////// Mostrar el documento en el modal ///////////////////////////////////////////
function mostrarModalDocumento(coleccion, documento, id) {
    const modal = document.querySelector("#modal");
    const contenedorModal = document.querySelector("#contienemodal");

    // Limpiar el contenido anterior
    contenedorModal.innerHTML = "";

    // Crear el contenido del modal
    let contenido = document.createElement("div");
    contenido.classList.add("modal-Mongo");
    contenido.innerHTML = `
        <h3>Detalles del Documento</h3>
        <div id="detallesDocumento">${renderEditableJSON(documento, coleccion, id)}</div>
        <button class="btn-eliminar" onclick="eliminarDocumento('${coleccion}', '${id}')">Eliminar</button>
    `;

    contenedorModal.appendChild(contenido);

    // Mostrar el modal
    modal.style.display = "block";
    modal.classList.remove("desaparece");
    modal.classList.add("aparece");
}

///////////////////////////////// Convertir JSON en formato legible ///////////////////////////////////
function renderJSONToHTML(json) {
    if (typeof json !== "object" || json === null) {
        return `<span>${json}</span>`;
    }

    if (Array.isArray(json)) {
        return `
            <ul style="list-style-type: square; margin-left: 20px;">
                ${json.map(item => `<li>${renderJSONToHTML(item)}</li>`).join("")}
            </ul>
        `;
    }

    return `
        <div style="margin-left: 10px;">
            ${Object.entries(json).map(([clave, valor]) => `
                <div style="margin-bottom: 8px;">
                    <strong style="color: #333;">${clave}:</strong>
                    <span>${valor}</span>
                </div>
            `).join("")}
        </div>
    `;
}
// //////////////////// Convertir JSON editable (doble clic para editar) /////////////////////////////
function renderEditableJSON(json, coleccion, id) {
    return Object.entries(json).map(([clave, valor]) => {
        return `
            <div class="campo-editable">
                <strong>${clave}:</strong> 
                <span 
                    ondblclick="habilitarEdicion(this, '${coleccion}', '${id}', '${clave}')" 
                    class="valor-editable"
                >${valor}</span>
            </div>
        `;
    }).join("");
}

//////////////////////////// Permitir edición en línea (doble clic) ///////////////////////////////////

function habilitarEdicion(elemento, coleccion, id, campo) {
    let valorActual = elemento.textContent;
    let input = document.createElement("input");
    input.type = "text";
    input.value = valorActual;
    input.classList.add("input-edicion");

    elemento.replaceWith(input);

    // Guardar cambios al perder el foco
    input.addEventListener("blur", () => {
        let nuevoValor = input.value;
        let datosActualizados = {};
        datosActualizados[campo] = nuevoValor;

        console.log("Intentando actualizar:", datosActualizados);

        actualizarDocumento(coleccion, id, datosActualizados);

        // Restaurar el texto editado en la interfaz
        let nuevoElemento = document.createElement("span");
        nuevoElemento.textContent = nuevoValor;
        nuevoElemento.classList.add("valor-editable");
        nuevoElemento.ondblclick = () => habilitarEdicion(nuevoElemento, coleccion, id, campo);
        input.replaceWith(nuevoElemento);
    });

    input.focus();
}

/////////////////////////////////// Actualizar documento en MongoDB //////////////////////////////
function actualizarDocumento(coleccion, id, datosActualizados) {
    console.log("Actualizando documento con ID:", id);
    console.log("Datos enviados:", datosActualizados);

    fetch(`../../servidor/?o=actualizarDocumento&coleccion=${coleccion}&id=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosActualizados)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            if (data.mensaje) {
                alert(data.mensaje);
                cargarDatosColeccion(coleccion);
            } else {
                alert("Error al actualizar el documento.");
            }
        })
        .catch(error => console.error("Error en la actualización:", error));
}

///////////////////////////// Eliminar documento ////////////////////////////////////
function eliminarDocumento(coleccion, id) {
    id = String(id);

    if (!confirm("¿Estás seguro de eliminar este documento?")) return;

    fetch(`../../servidor/?o=eliminarDocumento&coleccion=${coleccion}&id=${id}`, {
        method: "DELETE",
    })
        .then(async (response) => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                const textResponse = await response.text();
                console.error("Respuesta inesperada del servidor:", textResponse);
                throw new Error("Respuesta no válida del servidor (no es JSON).");
            }
        })
        .then(data => {
            console.log("Respuesta del servidor:", data);
            if (data.mensaje) {
                alert(data.mensaje);
                cargarDatosColeccion(coleccion);
                cerrarModal();
            } else if (data.error) {
                alert(`Error: ${data.error}`);
            }
        })
        .catch(error => console.error("Error al eliminar documento:", error));
}

/////////////////////////////////// Cerrar el modal ///////////////////////////////////////
function cerrarModal() {
    const modal = document.querySelector("#modal");
    modal.classList.remove("aparece");
    modal.classList.add("desaparece");
    setTimeout(() => {
        modal.style.display = "none";
    }, 1000);
}

////////////////////////////////  Evitar cerrar el modal haciendo clic dentro ////////////////////
document.querySelector("#modal").onclick = function () {
    cerrarModal();
};

document.querySelector("#contienemodal").onclick = function (event) {
    event.stopPropagation();
};