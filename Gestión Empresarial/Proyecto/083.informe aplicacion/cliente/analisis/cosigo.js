/////////////////////////////// CREAMOS LAS OPCIONES PARA LISTAR LAS TABLAS ////////////////////

fetch("../../servidor/?o=listatablas")
    .then(function(resultado){
        return resultado.json();
    })
    .then(function(datos){
        console.log(datos); // Verifica qué estructura tiene "datos" en la consola
        datos.forEach(function(tabla){
            let opcion = document.createElement("option");
            opcion.value = tabla.Tables_in_crismon1; // Accedemos a la propiedad correcta
            opcion.textContent = tabla.Tables_in_crismon1;
            document.querySelector("#tablas").appendChild(opcion);
        });
    })
    .catch(function(error) {
        console.error("Error al obtener las tablas:", error);
    });

/////////////////////////// SACAMOS LOS CAMPOS DE LAS TABLAS ///////////////////////////

document.querySelector("#tablas").onchange = function(){
    fetch("../../servidor/?o=columnastabla&tabla=" + this.value)
    .then(function (resultado) {
        return resultado.json();
    })
    .then(function (datos) {
        let contenedor = document.querySelector("#campotabla");
        contenedor.innerHTML = ""; // Limpia antes de agregar nuevos elementos

        datos.forEach(function (columna) {
            let etiqueta = document.createElement("label");
            etiqueta.textContent = columna.Field; // Texto del label

            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.value = columna.Field;
            checkbox.name = "campos";
            checkbox.id = `checkbox-${columna.Field}`; // ID único para cada checkbox

            etiqueta.appendChild(checkbox); // Añade el checkbox al label
            contenedor.appendChild(etiqueta); // Añade el label al contenedor

        });
    })
    .catch(function (error) {
        console.error("Error al obtener las columnas de la tabla:", error);
    });
}

///////////////////////////////// REALIZAR BÚSQUEDAS /////////////////////////////////////////

document.querySelector("#buscarBtn").onclick = function() {
    let tablaSeleccionada = document.querySelector("#tablas").value;

    // Obtener los campos seleccionados (checkboxes)
    let camposSeleccionados = [];
    document.querySelectorAll("#campotabla input:checked").forEach(function(checkbox) {
        camposSeleccionados.push(checkbox.value);
    });

    // Validar que al menos un campo haya sido seleccionado
    if (camposSeleccionados.length === 0) {
        alert("Por favor, selecciona al menos un campo para la búsqueda.");
        return;
    }

    // Estructurar los datos para enviar al backend
    let datosEnvio = {
        campos: camposSeleccionados // Campos seleccionados
        // No se incluyen 'valores' ya que no hay inputs de búsqueda
    };

    console.log(datosEnvio);  // Verifica lo que se va a enviar

    // Realizar la petición al servidor
    fetch("../../servidor/?o=buscarseleccion&tabla=" + tablaSeleccionada, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datosEnvio) // Enviar los datos estructurados como JSON
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(resultados) {
        let contenedorResultados = document.querySelector(".resultados");
        contenedorResultados.innerHTML = "<h2>Resultados de la Búsqueda</h2>";

        if (resultados.length > 0) {
            // Crear una tabla para mostrar los resultados de manera estructurada
            let tabla = document.createElement("table");
            tabla.border = "1";
            let encabezado = document.createElement("tr");

            // Crear encabezados de tabla
            camposSeleccionados.forEach(function(campo) {
                let th = document.createElement("th");
                th.textContent = campo;
                encabezado.appendChild(th);
            });
            tabla.appendChild(encabezado);

            // Crear filas con los datos
            resultados.forEach(function(fila) {
                let tr = document.createElement("tr");
                camposSeleccionados.forEach(function(campo) {
                    let td = document.createElement("td");
                    td.textContent = fila[campo];
                    tr.appendChild(td);
                });
                tabla.appendChild(tr);
            });

            contenedorResultados.appendChild(tabla);
        } else {
            contenedorResultados.innerHTML = "<p>No se encontraron resultados.</p>";
        }
    })
    .catch(function(error) {
        console.error("Error al hacer la búsqueda:", error);
    });
}
