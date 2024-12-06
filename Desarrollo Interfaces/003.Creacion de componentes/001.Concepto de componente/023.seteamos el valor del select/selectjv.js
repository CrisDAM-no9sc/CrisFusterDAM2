window.onload = function() {
    let contenedores = []; // Array para almacenar los contenedores creados
    let selectores = document.querySelectorAll(".selectjv"); // Selecciono todos los selectores de la página

    // Para cada uno de los selectores
    selectores.forEach(function(selector) {
        contenedores.push(document.createElement("div")); // Creo un div
        contenedores[contenedores.length - 1].classList.add("selectjv"); // Le pongo una clase al div

        // Evento para prevenir el cierre del contenedor al hacer clic
        contenedores[contenedores.length - 1].onclick = function(e) {
            e.stopPropagation();
        };

        // Agrego el contenedor al body de la página
        document.querySelector("body").appendChild(contenedores[contenedores.length - 1]);
        
        selector.remove(); // Elimino el select original

        let caja = document.createElement("div"); // Creo una caja que mostrará el texto seleccionado
        caja.classList.add("caja"); // Le pongo una clase
        caja.textContent = selector.querySelector("option:first-child").value; // Le pongo el texto del primer option
        contenedores[contenedores.length - 1].appendChild(caja); // Lo añado al contenedor
        contenedores[contenedores.length - 1].appendChild(selector); // Vuelvo a agregar el selector (pero estará oculto)

        // Evento para mostrar los resultados al hacer clic en la caja
        caja.onclick = function(e) {
            e.stopPropagation(); // Evita que se cierren los resultados al hacer clic en la caja
            caja.classList.add("radio2"); // Cambia la clase de la caja

            let resultados = document.createElement("div"); // Creo un div para los resultados
            resultados.classList.add("resultados"); // Le pongo una clase
            contenedores[contenedores.length - 1].appendChild(resultados); // Lo añado al contenedor
            
            let buscador = document.createElement("input"); // Creo un campo de entrada para la búsqueda
            buscador.setAttribute("type", "search"); // Tipo de input es búsqueda
            buscador.setAttribute("placeholder", "busca..."); // Placeholder para indicar que se puede buscar
            resultados.appendChild(buscador); // Agrego el buscador a los resultados

            // Evento para manejar la búsqueda al escribir en el input
            buscador.onkeyup = function() {
                let busca = this.value; // Contenido del buscador
                contieneresultados.innerHTML = ""; // Vacío los resultados antes de llenarlos

                // Para cada opción en el select
                opciones.forEach(function(opcion) {
                    // Si la opción contiene el texto buscado
                    if (opcion.value.includes(busca)) {
                        let texto = document.createElement("p"); // Creo un elemento de texto
                        texto.textContent = opcion.value; // Asigno el texto de la opción
                        contieneresultados.appendChild(texto); // Lo añado a los resultados
                        
                        // Evento para manejar el clic en una opción
                        texto.onclick = function() {
                            console.log("has hecho clic en una opción: ", texto.textContent);
                            resultados.remove(); // Elimino los resultados
                            caja.textContent = texto.textContent; // Actualizo el texto de la caja
                            
                            // Marca la opción seleccionada
                            let opciones2 = selector.querySelectorAll("option");
                            opciones2.forEach(function(opcion2) {
                                if (opcion2.value == texto.textContent) {
                                    opcion2.setAttribute("selected", true); // Marca la opción como seleccionada
                                }
                            });
                        };
                    }
                });
            };

            let contieneresultados = document.createElement("div"); // Creo un contenedor para los resultados intermedios
            let opciones = selector.querySelectorAll("option"); // Selecciono todas las opciones del selector

            // Para cada opción en el select
            opciones.forEach(function(opcion) {
                let texto = document.createElement("p"); // Creo un elemento de texto
                texto.textContent = opcion.value; // Asigno el texto de la opción
                contieneresultados.appendChild(texto); // Lo añado al contenedor de resultados

                // Evento para manejar el clic en una opción
                texto.onclick = function() {
                    console.log("has hecho clic en una opción: ", texto.textContent);
                    resultados.remove(); // Elimino los resultados
                    caja.textContent = texto.textContent; // Actualizo el texto de la caja

                    // Marca la opción seleccionada
                    let opciones2 = selector.querySelectorAll("option");
                    opciones2.forEach(function(opcion2) {
                        if (opcion2.value == texto.textContent) {
                            opcion2.setAttribute("selected", true); // Marca la opción como seleccionada
                        }
                    });
                };
            });

            resultados.appendChild(contieneresultados); // Agrego el contenedor intermedio a los resultados
        };
    });

    // Evento para manejar clics en el documento
    document.onclick = function() {
        console.log("ok body");
        contenedores.forEach(function(contenedor) {
            console.log(contenedor);
            try {
                contenedor.querySelector(".resultados").remove(); // Elimino los resultados si existen
                contenedor.querySelector(".caja").classList.remove("radio2"); // Quita el estilo de selección de la caja
            } catch (error) {
                console.log("error pero no pasa nada"); // Manejo de error si no hay resultados
            }
        });
    };
};
