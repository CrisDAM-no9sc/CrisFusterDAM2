window.onload = function() {
    // Array para almacenar los contenedores(div)que se van a crear 
    let contenedores = []; 
    // Selecciono todos los selectores de la página
    let selectores = document.querySelectorAll(".selectjv"); 

    // Para cada uno de los selectores
    selectores.forEach(function(selector) {
        //creamos un nuevo elemento div y lo añadimos al arrray de contenedores
        //crea un nuevo selector que va a reemplazar al selector origicnal
        contenedores.push(document.createElement("div"));
        //añadimos esta clase al ultimo contenedor creado
        //nos asegura que va a tener la misma clase que el original
        contenedores[contenedores.length - 1].classList.add("selectjv"); 
        //Prevenir que al hacer clic en el contenedor se cierren los resultados por eventos globales.
        // Evento para prevenir el cierre del contenedor al hacer clic
        contenedores[contenedores.length - 1].onclick = function(e) {
            e.stopPropagation();
        };
        //aqui estamos reemplaza elemento select con el nuevo contenedor div
        //para poner el boton abajo del input
        selector.replaceWith(contenedores[contenedores.length-1]);

        ////creamos un nuevo div y le asignamos la clase caja
        let caja = document.createElement("div"); 
        caja.classList.add("caja"); 
        //vamos a enseñar el valor predeterminado del selctor
        caja.textContent = selector.querySelector("option:first-child").value; 
        //incorporamos la caja al contendedor
        contenedores[contenedores.length - 1].appendChild(caja); 
        //añadimos de vuelta el selector en el DOM para que los datos sean accesibles 
        contenedores[contenedores.length - 1].appendChild(selector); 

        ////////////////// DEFNIMOS UN EVENTO PARA LA CAJA ////////////////////
        // Evento para mostrar los resultados al hacer clic en la caja
        caja.onclick = function(e) {
            // Evita que se cierren los resultados al hacer clic en la caja
            e.stopPropagation(); 
            // Cambia la clase de la caja
            caja.classList.add("radio2"); 
            //------ creamos un nuevo div y su clase es resultado ----//
            // Creo un div para los resultados
            let resultados = document.createElement("div"); 
            // Le pongo una clase
            resultados.classList.add("resultados"); 
            // Lo añado al contenedor
            this.appendChild(resultados); 
            //nos va a mostrar un espacio donde se presentaran las opciones y la busqueda
            //------------- Creamos un campo input -----------//
            
            //y la clase de este input va a ser buscador 
            // Creo un campo de entrada para la búsqueda
            let buscador = document.createElement("input"); 
            // Tipo de input es búsqueda
            buscador.setAttribute("type", "search"); 
            buscador.setAttribute("placeholder", "busca..."); 
            // Agrego el buscador a los resultados
            //el cual lo vamos a añadir al div de resultados
            resultados.appendChild(buscador); 


            buscador.onclick = function(e){
                console.log("hola")
                e.stopPropagation()
            }
            ///-------- y le añadimos evento de escucha ----///
            // Evento para manejar la búsqueda al escribir en el input
            buscador.onkeyup = function(e) {
                //obtenemos el valor del texto y lo guardamos en busca
                let busca = this.value; 
                //limpiamos el contenedor 
                contieneresultados.innerHTML = "";

                // iteramos sobre las opciones del selector original
                opciones.forEach(function(opcion) {
                    // Si la opción contiene el texto buscado
                    //aqui le ponemos tolowercase para que acepte tanto minusculas como matusculas
                    if (opcion.value.toLowerCase().includes(busca.toLowerCase())) {
                        //crea un nuevo elemento p por cada opcion que coincida y lo ñade al resultado
                        //nos va a aenseñar solo la info relevante que le pongamos
                        let texto = document.createElement("p"); 
                        texto.textContent = opcion.value; 
                        contieneresultados.appendChild(texto); 
                        
                        // Evento para manejar el clic en una opción
                        //le añadimos al texto que aparece en las opviones, para cuando hagamos click en un elemento de texto
                        texto.onclick = function() {
                            console.log("has hecho clic en una opción: ", texto.textContent);
                            resultados.remove(); // Elimino los resultados
                            //elimina los resultados de la pantalla y actualiza la cja con el texto
                            caja.textContent = texto.textContent;
                            
                            // Marca la opción seleccionada
                            let opciones2 = selector.querySelectorAll("option");
                            //iteramos sobre cada opcion del selector original
                            opciones2.forEach(function(opcion2) {
                                //busca la opcion donde el valor coincide con el texto seleccionado
                                if (opcion2.value == texto.textContent) {
                                    //marca la opcion como seleccionada
                                    opcion2.setAttribute("selected", true); 
                                }else{
                                    //para asegurar que vamos a limpiar los seleccionados
                                    opcion2.removeAttribute("selected");
                                }
                            });
                        };
                    }
                });
            };

            let contieneresultados = document.createElement("div"); 
            let opciones = selector.querySelectorAll("option"); 

            // Para cada opción en el select
            opciones.forEach(function(opcion) {
                let texto = document.createElement("p"); 
                texto.textContent = opcion.value; 
                contieneresultados.appendChild(texto);

                // Evento para manejar el clic en una opción
                texto.onclick = function() {
                    console.log("has hecho clic en una opción: ", texto.textContent);
                    resultados.remove();
                    caja.textContent = texto.textContent; 

                    // Marca la opción seleccionada
                    let opciones2 = selector.querySelectorAll("option");
                    opciones2.forEach(function(opcion2) {
                        if (opcion2.value == texto.textContent) {
                            opcion2.setAttribute("selected", true); 
                        }else{
                            //para asegurar que vamos a limpiar los seleccionados
                            opcion2.removeAttribute("selected"); 
                        }
                    });
                };
            });

            resultados.appendChild(contieneresultados); 
        };
    });

    // Evento para manejar clics en el documento
    document.onclick = function() {
        console.log("ok body");
        contenedores.forEach(function(contenedor) {
            console.log(contenedor);
            try {
                contenedor.querySelector(".resultados").remove();
                contenedor.querySelector(".caja").classList.remove("radio2"); 
            } catch (error) {
                console.log("error pero no pasa nada"); 
            }
        });
    };
};
