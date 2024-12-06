
    ///////////////////////////// creacion dinamica del selector ///////////////////
    //definimos la cadena de texto para las opcioens
    let texto = "Cristina";
    //selecionamios el contenedor original
    let contenedor = document.querySelector("#contenedor");
    //crea un selctor 
    let selector = document.createElement("select");
    //y lo añadimos al contenedor 
    contenedor.appendChild(selector)
    //iteramos osbre la cadena de texto
    for(let i = 0;i<10;i++){
        //creamos una opcion para cada caracter
        let opcion = document.createElement("option")
        //asignamos el caracter como texto de la opcion
        opcion.textContent = texto[i];
        //establecemos el valor de la opcion
        opcion.value = i;
        selector.appendChild(opcion);
    }
    // Llama a la función que reemplaza el selector
    selectjv(selector);

    function selectjv(selector){
    // Array para almacenar los contenedores(div)que se van a crear 
    contenedores = []; 
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

    /////////////////////// CREACION DE LA CAJA PRINCIPAL /////////////////////////
    let caja = document.createElement("div"); 
    caja.classList.add("caja"); 
    //vamos a enseñar el valor predeterminado del selctor
    caja.textContent = selector.querySelector("option:first-child").textContent; 
    //incorporamos la caja al contendedor
    contenedores[contenedores.length - 1].appendChild(caja); 
    //añadimos de vuelta el selector en el DOM para que los datos sean accesibles 
    contenedores[contenedores.length - 1].appendChild(selector); 

    ////----------------- CREACION DE LISTA DE RESULTADOS Y BUSQUEDA --------------------//
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
        ///-------- PERMITE FILTRAR OPCIONES DE BUSQUEDA MIENTRAS ESCRIBIMOS ----///
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
                if (opcion.textContent.toLowerCase().includes(busca.toLowerCase())) {
                    //crea un nuevo elemento p por cada opcion que coincida y lo ñade al resultado
                    //nos va a aenseñar solo la info relevante que le pongamos
                    let texto = document.createElement("p"); 
                    texto.textContent = opcion.textContent; 
                    contieneresultados.appendChild(texto); 
                    
                    // Evento para manejar el clic en una opción
                    //le añadimos al texto que aparece en las opviones, para cuando hagamos click en un elemento de texto
                    texto.onclick = function() {
                        console.log("has hecho clic en una opción: ", texto.textContent);
                        resultados.remove(); // Elimino los resultados
                        //elimina los resultados de la pantalla y actualiza la cja con el texto
                        caja.textContent = texto.textContent;
                        //------------ PARA MARCAR LA OPCION SELECCIONADA ---------//
                        // Marca la opción seleccionada
                        let opciones2 = selector.querySelectorAll("option");
                        //iteramos sobre cada opcion del selector original
                        opciones2.forEach(function(opcion2) {
                            //busca la opcion donde el valor coincide con el texto seleccionado
                            if (opcion2.textContent == texto.textContent) {
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
        ////////////// MOSTRAR TODAS LAS OPCIONES AL ABRIR EL MENU ////////////////////////

        let contieneresultados = document.createElement("div"); 
        contieneresultados.onclick = function(e){
            e.stopPropagation();
        }
        let opciones = selector.querySelectorAll("option"); 

        // Para cada opción en el select
        opciones.forEach(function(opcion) {
            let texto = document.createElement("p"); 
            texto.textContent = opcion.textContent; 
            contieneresultados.appendChild(texto);

            // Evento para manejar el clic en una opción
            texto.onclick = function() {
                console.log("has hecho clic en una opción: ", texto.textContent);
                resultados.remove();
                caja.textContent = texto.textContent; 

                //------------ PARA MARCAR LA OPCION SELECCIONADA ---------//
                // Marca la opción seleccionada
                let opciones2 = selector.querySelectorAll("option");
                opciones2.forEach(function(opcion2) {
                    //para que nos salga lso nombres en vez de los numero hay que cambiar al textcontent
                    //en vez de como estaba antes que era value
                    if (opcion2.textContent == texto.textContent) {
                        opcion2.setAttribute("selected", true); 
                    }else{
                        //para asegurar que vamos a limpiar los seleccionados
                        opcion2.removeAttribute("selected"); 
                    }
                });
            };
        });

        resultados.appendChild(contieneresultados); 
        resultados.onclick = function(e){
            e.stopPropagation();
        }
    };

    ///////////////////////// CERRAR EL MENU AL HACER CLICK FUERA DEL CONTENDOR //////////////
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

}