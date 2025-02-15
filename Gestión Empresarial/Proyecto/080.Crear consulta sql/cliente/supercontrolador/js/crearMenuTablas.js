/*
function crearMenuTablas(datos, tipoentidad) {
    let menu = document.querySelector("nav ul");

    // Agregar botón de Consola SQL solo si no existe
    if (!document.getElementById("toggleConsola")) {
        let itemConsola = document.createElement("li");
        itemConsola.innerHTML = `<button id="toggleConsola" tooltip="Abrir Consola SQL">🖥️ Consola</button>`;
        menu.prepend(itemConsola); // Lo agregamos al inicio del menú

        // Agregar evento para mostrar/ocultar la consola
        document.getElementById("toggleConsola").addEventListener("click", function () {
            let consolaSQL = document.getElementById("consolaSQL");
            consolaSQL.style.display = (consolaSQL.style.display === "none" || consolaSQL.style.display === "") ? "block" : "none";
        });
    }
    // Verificamos si 'datos' es un array
    if (Array.isArray(datos)) {
        datos.forEach(function(tabla) {
            let nombre_de_la_tabla = tabla['Tables_in_crismon1'];
            let elemento = document.createElement("li");
            let icono;
            switch (tipoentidad) {
                case "tabla":
                    icono = "<span class='boton botontabla'><img src='../img/icnotabla.png'></span>";
                    break;
                case "coleccion":
                    icono = "<span class='boton botondocumento'><img src='../img/documento.png'></span>";
            }
            elemento.innerHTML = icono + "" + nombre_de_la_tabla;
            elemento.setAttribute("destino", nombre_de_la_tabla);
            elemento.setAttribute("tooltip", "Haz click para cargar la informacion de la tabla " + nombre_de_la_tabla);
            elemento.setAttribute("comentario", tabla['Comentario']);
            elemento.onclick = function() {
                let texto = this.getAttribute("destino");
                switch (tipoentidad) {
                    case "tabla":
                        cargaDatosTabla(texto);
                        break;
                    case "coleccion":
                        cargarDatosColeccion(texto);
                        console.log("ok coleccion");
                        break;
                }
                document.querySelector(".titulotabla h5").textContent = this.textContent;
                document.querySelector(".titulotabla p").textContent = this.getAttribute("comentario");
                let elementosmenu = document.querySelectorAll("nav ul li");
                elementosmenu.forEach(function(elemento) {
                    elemento.classList.remove("menuseleccionado");
                });
                this.classList.add("menuseleccionado");
            }
            menu.appendChild(elemento);
        });
    } else {
        console.error("Se esperaba un array, pero se recibió:", datos);
    }
}
*/

function crearMenuTablas(datos, tipoentidad) {
    let menu = document.querySelector("nav ul");

    // Agregar botón de Consola SQL solo si no existe
    if (!document.getElementById("toggleConsola")) {
        let itemConsola = document.createElement("li");
        itemConsola.innerHTML = `<button id="toggleConsola" tooltip="Abrir Consola SQL"><img src="img/iconoconsola.png"> Consola</button>`;
        menu.prepend(itemConsola);

        // Evento para mostrar la consola
        document.getElementById("toggleConsola").addEventListener("click", function () {
            document.getElementById("contenedorConsola").style.display = "block";
        });

        // Evento para cerrar la consola
        document.getElementById("cerrarConsola").addEventListener("click", function () {
            document.getElementById("contenedorConsola").style.display = "none";
        });
    }

    // Verificamos si 'datos' es un array antes de iterar
    if (Array.isArray(datos)) {
        datos.forEach(function (tabla) {
            let nombre_de_la_tabla = tabla['Tables_in_crismon1'];
            let elemento = document.createElement("li");
            let icono;

            switch (tipoentidad) {
                case "tabla":
                    icono = "<span class='boton botontabla'><img src='../img/icnotabla.png'></span>";
                    break;
                case "coleccion":
                    icono = "<span class='boton botondocumento'><img src='../img/documento.png'></span>";
                    break;
            }

            elemento.innerHTML = icono + " " + nombre_de_la_tabla;
            elemento.setAttribute("destino", nombre_de_la_tabla);
            elemento.setAttribute("tooltip", "Haz click para cargar la información de la tabla " + nombre_de_la_tabla);
            elemento.setAttribute("comentario", tabla['Comentario']);

            elemento.onclick = function () {
                let texto = this.getAttribute("destino");
                switch (tipoentidad) {
                    case "tabla":
                        cargaDatosTabla(texto);
                        break;
                    case "coleccion":
                        cargarDatosColeccion(texto);
                        console.log("ok coleccion");
                        break;
                }

                document.querySelector(".titulotabla h5").textContent = this.textContent;
                document.querySelector(".titulotabla p").textContent = this.getAttribute("comentario");

                let elementosmenu = document.querySelectorAll("nav ul li");
                elementosmenu.forEach(function (elemento) {
                    elemento.classList.remove("menuseleccionado");
                });

                this.classList.add("menuseleccionado");
            };

            menu.appendChild(elemento);
        });
    } else {
        console.error("Se esperaba un array, pero se recibió:", datos);
    }
}
