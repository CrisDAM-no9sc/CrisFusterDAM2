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
        //para poner el boton abajo del input
        selector.replaceWith(contenedores[contenedores.length-1]); // Elimino el select original

        let caja = document.createElement("div"); // Creo una caja que mostrará el texto seleccionado
        caja.classList.add("caja"); // Le pongo una clase
        caja.textContent = selector.querySelector("option:first-child").value; // Le pongo el texto del primer option
        contenedores[contenedores.length - 1].appendChild(caja); // Lo añado al contenedor
        contenedores[contenedores.length - 1].appendChild(selector); // Vuelvo a agregar el selector (pero estará oculto)

        // Evento para mostrar los resultados al hacer clic en la caja
        caja.onclick = function(e) {
            // Evita que se cierren los resultados al hacer clic en la caja
            e.stopPropagation(); 
            // Cambia la clase de la caja
            caja.classList.add("radio2"); 
            // Creo un div para los resultados
            let resultados = document.createElement("div"); 
            // Le pongo una clase
            resultados.classList.add("resultados"); 
            // Lo añado al contenedor
            this.appendChild(resultados); 
            // Creo un campo de entrada para la búsqueda
            let buscador = document.createElement("input"); 
            // Tipo de input es búsqueda
            buscador.setAttribute("type", "search"); 
            
            
            buscador.setAttribute("placeholder", "busca..."); 
            // Agrego el buscador a los resultados
            resultados.appendChild(buscador); 
            buscador.focus(function(e){
                e.stopPropagation()
            })
            // Evento para manejar la búsqueda al escribir en el input
            buscador.onkeyup = function(e) {
                
                let busca = this.value; // Contenido del buscador
                contieneresultados.innerHTML = ""; // Vacío los resultados antes de llenarlos

                // Para cada opción en el select
                opciones.forEach(function(opcion) {
                    // Si la opción contiene el texto buscado
                    //aqui le ponemos tolowercase para que acepte tanto minusculas como matusculas
                    if (opcion.value.toLowerCase().includes(busca.toLowerCase())) {
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
