
/**
 * # Configuración Dinámica de Tablas
 *
 * ## Descripción:
 * Este script configura la estructura de una tabla, permitiendo:
 * - Extraer los datos dinámicamente desde el contenido actual.
 * - Ordenar las columnas al hacer clic en los encabezados.
 * - Agregar un contador de filas.
 * - Actualizar los datos de la tabla después de cada ordenación.
 * - Detectar nuevas tablas agregadas dinámicamente al DOM y configurarlas automáticamente.
 *
 * ## Funcionalidades principales:
 * - `configurarTabla(tabla)`: Configura una tabla para que sea interactiva y ordenable.
 * - `datosTabla()`: Pobla la tabla con los datos extraídos y ordenados.
 * - `MutationObserver()`: Detecta y configura nuevas tablas añadidas al DOM.
 */

// Función que configura la tabla, la ordena y la actualiza
function configurarTabla(tabla) {
    let contenido = []; // Superarray vacío
    let indices = []; // Lista de índices
    let cabeceras = tabla.querySelectorAll("thead tr th"); // Cargar las cabeceras

    // Recorremos las cabeceras y asignamos los eventos de ordenación
    cabeceras.forEach(function (cabecera, colIndex) {
        indices.push(cabecera.textContent.trim()); // Añadir cabeceras a los índices

        // Evento click para ordenar
        cabecera.onclick = function () {
            console.log("Vamos a ordenar según la columna: " + cabecera.textContent);
            tabla.querySelector("tbody").innerHTML = ""; // Vaciar el cuerpo de la tabla

            // Ordenamos el contenido
            contenido.sort(function (a, b) {
                let valA = a[indices[colIndex]].toLowerCase();
                let valB = b[indices[colIndex]].toLowerCase();
                if (!isNaN(valA) && !isNaN(valB)) {
                    valA = parseFloat(valA);
                    valB = parseFloat(valB);
                }
                return valA > valB ? 1 : valA < valB ? -1 : 0;
            });

            datosTabla(); // Repoblar la tabla con los datos ordenados
        };
    });

    // Extraemos el contenido de la tabla y lo almacenamos en `contenido`
    let registros = tabla.querySelectorAll("tbody tr");
    registros.forEach(function (registro) {
        let linea = {}; // Objeto vacío por fila
        let celdas = registro.querySelectorAll("td");
        celdas.forEach(function (celda, index) {
            linea[indices[index]] = celda.textContent.trim();
        });
        contenido.push(linea); // Añade la fila al superarray
    });

    console.log(contenido); // Para depurar
    datosTabla(); // Inicializamos la tabla con los datos

    // Función para poblar la tabla con los datos almacenados
    function datosTabla() {
        tabla.querySelector("thead tr").innerHTML = ""; // Limpiar cabeceras

        // Añadimos la columna "N°" como contador
        let cabezal1 = document.createElement("th");
        cabezal1.textContent = "N°";
        tabla.querySelector("thead tr").appendChild(cabezal1);

        // Añadimos las cabeceras originales
        indices.forEach(function (campo, colIndex) {
            let cabezal = document.createElement("th");
            cabezal.textContent = campo;
            tabla.querySelector("thead tr").appendChild(cabezal);

            // Evento click para reordenar
            cabezal.onclick = function () {
                console.log("Vamos a ordenar según la columna: " + cabezal.textContent);
                tabla.querySelector("tbody").innerHTML = ""; // Vaciar el cuerpo

                // Ordenamos el contenido de nuevo
                contenido.sort(function (a, b) {
                    let valA = a[indices[colIndex]].toLowerCase();
                    let valB = b[indices[colIndex]].toLowerCase();
                    if (!isNaN(valA) && !isNaN(valB)) {
                        valA = parseFloat(valA);
                        valB = parseFloat(valB);
                    }
                    return valA > valB ? 1 : valA < valB ? -1 : 0;
                });

                datosTabla(); // Repoblar la tabla con los datos ordenados
            };
        });

        // Limpiar el cuerpo de la tabla antes de repoblar
        tabla.querySelector("tbody").innerHTML = "";
        let contador = 1;

        // Recorremos los datos y reconstruimos las filas de la tabla
        contenido.forEach(function (linea) {
            let fila = document.createElement("tr");

            // Añadimos la celda de "Contador" con el número de fila
            let celda1 = document.createElement("td");
            celda1.textContent = contador;
            fila.appendChild(celda1);
            contador++;

            // Añadimos las celdas de los datos
            indices.forEach(function (campo) {
                let celda = document.createElement("td");
                celda.textContent = linea[campo];
                fila.appendChild(celda);
            });

            // Añadimos la fila al cuerpo de la tabla
            tabla.querySelector("tbody").appendChild(fila);
        });
    }
}

// Inicializamos las tablas con el ID "vistaTabla"
document.querySelectorAll("#vistaTabla").forEach(configurarTabla);

// Observamos nuevos elementos en el DOM
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === 1 && node.classList.contains("vistaTabla")) {
                configurarTabla(node); // Configura la nueva tabla añadida
            }
        });
    });
});

// Observamos todo el cuerpo para agregar nuevas tablas dinámicamente
observer.observe(document.body, {
    childList: true,
    subtree: true,
});


