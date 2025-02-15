
function pueblaTabla(datos, campoclave, tabla, listaaplicaciones) {
    console.log("Datos recibidos en pueblaTabla:", datos);

    // Obtener la tabla y tbody
    let tablaElement = document.querySelector("section table");

    let contenidotabla = tablaElement.querySelector("tbody");
    if (!contenidotabla) {
        contenidotabla = document.createElement("tbody");
        tablaElement.appendChild(contenidotabla);
    }

    // Ahora que estamos seguros de que existe, limpiamos el contenido
    contenidotabla.innerHTML = "";  

    // Recorrer los datos y crear filas
    datos.forEach(function (registro) {
        let clave_primaria;
        let nuevafila = document.createElement("tr");

        Object.keys(registro).forEach(clave => {
            if (clave == campoclave) {
                clave_primaria = registro[clave];
            }
            let nuevacolumna = document.createElement("td");
            nuevacolumna.textContent = registro[clave];
            nuevacolumna.setAttribute("tabla", tabla);
            nuevacolumna.setAttribute("columna", clave);
            nuevacolumna.setAttribute("Identificador", clave_primaria);

            nuevacolumna.ondblclick = function () {
                console.log("Click en celda editable.");
                this.setAttribute("contenteditable", "true");
                this.focus();
            };

            nuevacolumna.onblur = function () {
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

        // Agregar columna de aplicaciones si existen
        if (listaaplicaciones.length > 0) {
            let columnaApps = document.createElement("td");
            let selector = document.createElement("select");
            let opcion = document.createElement("option");
            opcion.textContent = "Selecciona una opción";
            selector.appendChild(opcion);

            listaaplicaciones.forEach(function (aplicacion) {
                let opcion = document.createElement("option");
                opcion.textContent = aplicacion;
                opcion.value = aplicacion;
                selector.appendChild(opcion);
            });

            selector.onchange = function () {
                console.log("Cargando aplicación:", this.value);
                let seccion = document.querySelector("section");
                seccion.innerHTML = "<iframe src='../supercontrolador/apps/" + tabla + "/" + this.value + "/index.html?entidad=" + tabla + "&id=" + clave_primaria + "'></iframe>";
                console.log("Ruta del iframe:", 'supercontrolador/apps/' + tabla + '/' + this.value + '/index.html?entidad=' + tabla + '&id=' + clave_primaria);
            };

            columnaApps.appendChild(selector);
            nuevafila.appendChild(columnaApps);
        }

        let eliminarColumna = document.createElement("td");
        eliminarColumna.innerHTML = "<span class='boton botoneliminar'><img src='../img/eliminar.png'></span>";
        eliminarColumna.setAttribute("claveprimaria", clave_primaria);

        eliminarColumna.onclick = function () {
            console.log("Eliminando registro con ID:", clave_primaria);
            fetch("../../servidor/?o=eliminar&tabla=" + tabla + "&id=" + clave_primaria)
                .then(() => this.parentElement.remove());
        };

        nuevafila.appendChild(eliminarColumna);
        contenidotabla.appendChild(nuevafila);
    });
}
