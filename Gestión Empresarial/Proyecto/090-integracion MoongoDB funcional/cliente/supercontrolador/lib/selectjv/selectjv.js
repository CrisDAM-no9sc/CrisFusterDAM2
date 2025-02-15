function selectjv(selector) {
    // Definir contenedores correctamente
    let contenedores = [];  // Se agregó `let` para evitar que `contenedores` sea global.

    //////////////////// CREACION DEL CONTENEDOR PARA EL SELECT ///////////////
    // Creo un div
    contenedores.push(document.createElement("div"));
    // Le asigno la clase
    contenedores[contenedores.length - 1].classList.add("selectjv");

    // Esta funcion se ejecuta cuando se hace click dentro del contenedor, evita que se propague a otros elementos padres
    // Útil para manejar la visibilidad de los elementos relacionados como una lista de resultados
    contenedores[contenedores.length - 1].onclick = function (e) {
        e.stopPropagation();
    };

    // Reemplazo el select original con el nuevo div
    // El select ahora será parte del nuevo contenedor
    selector.replaceWith(contenedores[contenedores.length - 1]);

    //////////////////////// VISUALIZACION DE LAS OPCIONES ////////////////////
    // Creo una nueva caja
    let caja = document.createElement("div");
    caja.classList.add("caja");
    // Le asigno como texto, el de la primera opción
    caja.textContent = selector.querySelector("option:first-child").textContent;
    // Agrego el div.caja y el select al contenedor original
    contenedores[contenedores.length - 1].appendChild(caja);
    contenedores[contenedores.length - 1].appendChild(selector);

    // Al hacer click en la caja
    caja.onclick = function (e) {
        e.stopPropagation();
        caja.classList.add("radio2");  // Cambia la clase del radio

        //----------------- CREACION DE LAS OPTION DEL SELECT -------------//
        // Creo un nuevo contenedor para los resultados
        let resultados = document.createElement("div");
        resultados.classList.add("resultados");
        this.appendChild(resultados);

        // Creo un campo de búsqueda
        let buscador = document.createElement("input");
        buscador.setAttribute("type", "search");
        buscador.setAttribute("placeholder", "busca...");
        resultados.appendChild(buscador);

        buscador.onclick = function (e) {
            e.stopPropagation();
        };

        //------------------ FILTRADO DE LAS OPCIONES -------------//
        // Creo un contenedor intermedio para las opciones filtradas
        let contieneresultados = document.createElement("div");
        contieneresultados.onclick = function (e) {
            e.stopPropagation();
        };

        // Selecciono todas las opciones del select original
        let opciones = selector.querySelectorAll("option");

        // Recorro todas las opciones y las agrego a los resultados
        opciones.forEach(function (opcion) {
            let texto = document.createElement("p");
            texto.textContent = opcion.textContent;
            contieneresultados.appendChild(texto);

            texto.onclick = function () {
                console.log("Has hecho clic en una opción: ", texto.textContent);
                resultados.remove();  // Elimino la lista de resultados
                caja.textContent = texto.textContent;  // Actualizo el texto de la caja

                let opciones2 = selector.querySelectorAll("option");
                opciones2.forEach(function (opcion2) {
                    if (opcion2.textContent == texto.textContent) {
                        opcion2.setAttribute("selected", true);
                    } else {
                        opcion2.removeAttribute("selected");
                    }
                });
            };
        });

        resultados.appendChild(contieneresultados);

        //------------------------- FILTRAMOS LAS OPCIONES ---------------------------//
        // Se ejecutará cada vez que el usuario escriba algo en el campo de búsqueda
        buscador.onkeyup = function (e) {
            // Cojo el valor escrito
            let busca = this.value;
            // Vacío el contenedor de resultados antes de agregar las nuevas opciones
            contieneresultados.innerHTML = "";

            opciones.forEach(function (opcion) {
                // Si el texto de la opción coincide con lo que se está buscando (sin importar mayúsculas/minúsculas)
                if (opcion.textContent.toLowerCase().includes(busca.toLowerCase())) {
                    let texto = document.createElement("p");
                    texto.textContent = opcion.textContent;
                    contieneresultados.appendChild(texto);

                    // Al hacer click en una opción filtrada
                    texto.onclick = function () {
                        console.log("Has hecho clic en una opción: ", texto.textContent);
                        resultados.remove();
                        caja.textContent = texto.textContent;

                        let opciones2 = selector.querySelectorAll("option");
                        opciones2.forEach(function (opcion2) {
                            if (opcion2.textContent == texto.textContent) {
                                opcion2.setAttribute("selected", true);
                            } else {
                                opcion2.removeAttribute("selected");
                            }
                        });
                    };
                }
            });
        };
    };

    //----------------- CERRAR LA LISTA DE OPCIONES --------------//
    // Cuando hago click en cualquier parte del documento
    document.onclick = function () {
        console.log("ok body");
        contenedores.forEach(function (contenedor) {
            try {
                // Elimino la lista de opciones y la clase radio de la caja
                contenedor.querySelector(".resultados").remove();
                contenedor.querySelector(".caja").classList.remove("radio2");
            } catch (error) {
                console.log("error pero no pasa nada");
            }
        });
    };
}
