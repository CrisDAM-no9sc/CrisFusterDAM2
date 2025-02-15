

function crearMenuTablas(datos, tipoentidad) {
    let menu = document.querySelector("nav ul");
    

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
