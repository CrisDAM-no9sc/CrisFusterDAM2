
function pueblaTabla(datos, campoclave, tabla, listaaplicaciones) {
    //console.log("Datos recibidos en pueblaTabla:", datos);
     // Comprueba si la respuesta contiene un error
     if (datos.error) {
        console.error("Error en pueblaTabla:", datos.error);
        alert("Error: " + datos.error);
        return;
    }
    // Verifica que datos sea un array
    if (!Array.isArray(datos)) {
        console.error("pueblaTabla: La respuesta no es un array:", datos);
        return;
    }
    
    console.log("Datos recibidos en pueblaTabla:", datos);


    // Obtener la tabla y su <tbody>
    let tablaElement = document.querySelector("section table");
    let contenidotabla = tablaElement.querySelector("tbody");
    if (!contenidotabla) {
        contenidotabla = document.createElement("tbody");
        tablaElement.appendChild(contenidotabla);
    }

    // Limpiar el contenido previo del tbody
    contenidotabla.innerHTML = "";

    // Recorrer los datos y crear una fila para cada registro
    datos.forEach(function(registro) {
        let clave_primaria;
        let nuevafila = document.createElement("tr");

        // Recorrer cada propiedad del registro para crear sus celdas
        Object.keys(registro).forEach(clave => {
            if (clave === campoclave) {
                clave_primaria = registro[clave];
            }
            let nuevacolumna = document.createElement("td");
            nuevacolumna.textContent = registro[clave];
            nuevacolumna.setAttribute("tabla", tabla);
            nuevacolumna.setAttribute("columna", clave);
            nuevacolumna.setAttribute("Identificador", clave_primaria);

            // Hacer la celda editable al doble clic
            nuevacolumna.ondblclick = function() {
                console.log("Click en celda editable.");
                this.setAttribute("contenteditable", "true");
                this.focus();
            };

            // Al perder el foco, desactivar la edición y enviar la actualización al servidor
            nuevacolumna.onblur = function() {
                this.setAttribute("contenteditable", "false");
                let mensaje = {
                    "tabla": this.getAttribute("tabla"),
                    "columna": this.getAttribute("columna"),
                    "Identificador": this.getAttribute("Identificador"),
                    "valor": this.textContent
                };
                fetch("../../servidor/?o=actualizar", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mensaje),
                })
                .then(response => response.json())
                .then(datos => console.log(datos));

                console.log("Datos enviados al servidor:", mensaje);
            };

            nuevafila.appendChild(nuevacolumna);
        });

        // Agregar columna de aplicaciones si la lista no está vacía
        if (listaaplicaciones.length > 0) {
            let columnaApps = document.createElement("td");
            let selector = document.createElement("select");
            let opcionInicial = document.createElement("option");
            opcionInicial.textContent = "Selecciona una opción";
            selector.appendChild(opcionInicial);

            listaaplicaciones.forEach(function(aplicacion) {
                let opcion = document.createElement("option");
                opcion.textContent = aplicacion;
                opcion.value = aplicacion;
                selector.appendChild(opcion);
            });

            selector.onchange = function() {
                console.log("Cargando aplicación:", this.value);
                let seccion = document.querySelector("section");
                seccion.innerHTML = "<iframe src='../supercontrolador/apps/" + tabla + "/" + this.value + "/index.html?entidad=" + tabla + "&id=" + clave_primaria + "'></iframe>";
                console.log("Ruta del iframe:", 'supercontrolador/apps/' + tabla + '/' + this.value + '/index.html?entidad=' + tabla + '&id=' + clave_primaria);
            };

            columnaApps.appendChild(selector);
            nuevafila.appendChild(columnaApps);
        }

        // GENERAMOS BOTÓN ELIMINAR
        let columnaEliminar = document.createElement("td");
        columnaEliminar.innerHTML = "<span class='boton botoneliminar'><img src='../img/eliminar.png'></span>";
        columnaEliminar.setAttribute("claveprimaria", clave_primaria);

        columnaEliminar.onclick = function() {
            console.log("Eliminando registro con ID:", clave_primaria);
            fetch("../../servidor/?o=eliminar&tabla=" + tabla + "&id=" + clave_primaria)
                .then(() => this.parentElement.remove());
        };
        nuevafila.appendChild(columnaEliminar);

        // GENERAMOS BOTÓN INFORME
        let columnaInforme = document.createElement("td");
        columnaInforme.innerHTML ="<span class='boton botoneliminar'><img src='../img/informe.png'></span>";
        // Se asigna el atributo 'claveprimaria' para identificar el registro
        columnaInforme.setAttribute("claveprimaria", clave_primaria);
        nuevafila.appendChild(columnaInforme);

        columnaInforme.onclick = function() {
            console.log("Quiero un informe");
            let identificador = this.getAttribute("claveprimaria");
            console.log("Quiero un informe", tabla, identificador);
            fetch("../../servidor/?o=informe&tabla=" + tabla + "&id=" + identificador)
                .then(function(result) {
                    return result.json();
                })
                .then(function(datos) {
                    console.log(datos);
                    // Limpiar el contenido de la sección y renderizar la nueva tabla con la función 'renderizarTabla'
                    document.querySelector("section").innerHTML = "";
                    document.querySelector("section").innerHTML = renderizarTabla(datos[0]);
                });
        };

        // Agregar la fila completa al tbody de la tabla
        contenidotabla.appendChild(nuevafila);
    });
}