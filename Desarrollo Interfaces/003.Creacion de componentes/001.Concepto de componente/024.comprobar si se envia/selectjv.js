window.onload = function() {
    // Array para almacenar los contenedores creados
    let contenedores = []; 
    // Selecciono todos los selectores de la página
    let selectores = document.querySelectorAll(".selectjv"); 

    // Para cada uno de los selectores
    selectores.forEach(function(selector) {
        contenedores.push(document.createElement("div")); 
        contenedores[contenedores.length - 1].classList.add("selectjv"); 

        // Evento para prevenir el cierre del contenedor al hacer clic
        contenedores[contenedores.length - 1].onclick = function(e) {
            e.stopPropagation();
        };

        selector.parentElement.appendChild(contenedores[contenedores.length-1]) 
        // Elimino el select original
        selector.remove(); 
        // Creo una caja que mostrará el texto seleccionado
        let caja = document.createElement("div"); 
        caja.classList.add("caja"); 
        caja.textContent = selector.querySelector("option:first-child").value; 
         // Lo añado al contenedor
        contenedores[contenedores.length - 1].appendChild(caja);
        // Vuelvo a agregar el selector (pero estará oculto)
        contenedores[contenedores.length - 1].appendChild(selector); 

        // Evento para mostrar los resultados al hacer clic en la caja
        caja.onclick = function(e) {
            e.stopPropagation();
            caja.classList.add("radio2");
            // Creo un div para los resultados
            let resultados = document.createElement("div"); 
            // Le pongo una clase
            resultados.classList.add("resultados"); 
            // Lo añado al contenedor
            contenedores[contenedores.length - 1].appendChild(resultados); 
            // Creo un campo de entrada para la búsqueda
            let buscador = document.createElement("input"); 
            buscador.setAttribute("type", "search"); 
            buscador.setAttribute("placeholder", "busca..."); 
            // Agrego el buscador a los resultados
            resultados.appendChild(buscador); 

            // Evento para manejar la búsqueda al escribir en el input
            buscador.onkeyup = function() {
                let busca = this.value;
                contieneresultados.innerHTML = ""; 

                // Para cada opción en el select
                opciones.forEach(function(opcion) {
                    // Si la opción contiene el texto buscado
                    if (opcion.value.includes(busca)) {
                        let texto = document.createElement("p"); 
                        texto.textContent = opcion.value; 
                        contieneresultados.appendChild(texto); 
                        
                        // Evento para manejar el clic en una opción
                        texto.onclick = function() {
                            console.log("has hecho clic en una opción: ", texto.textContent);
                            resultados.remove(); 
                            // Actualizo el texto de la caja
                            caja.textContent = texto.textContent; 
                            
                            // Marca la opción seleccionada
                            let opciones2 = selector.querySelectorAll("option");
                            opciones2.forEach(function(opcion2) {
                                if (opcion2.value == texto.textContent) {
                                    // Marca la opción como seleccionada
                                    opcion2.setAttribute("selected", true); 
                                }
                            });
                        };
                    }
                });
            };
            // Creo un contenedor para los resultados intermedios
            let contieneresultados = document.createElement("div"); 
            // Selecciono todas las opciones del selector
            let opciones = selector.querySelectorAll("option"); 

            // Para cada opción en el select
            opciones.forEach(function(opcion) {
                // Creo un elemento de texto
                let texto = document.createElement("p"); 
                // Asigno el texto de la opción
                texto.textContent = opcion.value; 
                // Lo añado al contenedor de resultados
                contieneresultados.appendChild(texto); 

                // Evento para manejar el clic en una opción
                texto.onclick = function() {
                    console.log("has hecho clic en una opción: ", texto.textContent);
                    // Elimino los resultados
                    resultados.remove(); 
                    // Actualizo el texto de la caja
                    caja.textContent = texto.textContent; 

                    // Marca la opción seleccionada
                    let opciones2 = selector.querySelectorAll("option");
                    opciones2.forEach(function(opcion2) {
                        if (opcion2.value == texto.textContent) {
                            // Marca la opción como seleccionada
                            opcion2.setAttribute("selected", true); 
                        }
                    });
                };
            });
            // Agrego el contenedor intermedio a los resultados
            resultados.appendChild(contieneresultados); 
        };
    });

    // Evento para manejar clics en el documento
    document.onclick = function() {
        console.log("ok body");
        contenedores.forEach(function(contenedor) {
            console.log(contenedor);
            try {
                // Elimino los resultados si existen
                contenedor.querySelector(".resultados").remove(); 
                // Quita el estilo de selección de la caja
                contenedor.querySelector(".caja").classList.remove("radio2"); 
            } catch (error) {
                // Manejo de error si no hay resultados
                console.log("error pero no pasa nada"); 
            }
        });
    };
};
