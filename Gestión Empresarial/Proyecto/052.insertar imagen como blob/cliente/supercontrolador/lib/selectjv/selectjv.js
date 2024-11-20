function selectjv(selector) {
    //arreglo vacio que lo vamos a utilizar para guardar los elementos div que sirven como contenedores para el select
    let contenedores = [];  // Definir contenedores correctamente

    //////////////////// CREACION DEL CONTENEDOR PARA EL SELECT ///////////////
    //creamos para el arreglo de contenedores uun nuevo div
    contenedores.push(document.createElement("div"));
    //le asignamos la clase 
    contenedores[contenedores.length - 1].classList.add("selectjv");

    //esta funcion se ejecuta cunado se hace click dentro del contenedor, evita que se porpage a otros elementos padres
    //util para manejar la visibilidad de los elementos relacionados como una lista de resultados 
    contenedores[contenedores.length - 1].onclick = function (e) {
        e.stopPropagation();
    };
    //reempplazamos el select original con el nuevo div
    //el select ahora sera parte del nuevo contenedor 
    selector.replaceWith(contenedores[contenedores.length - 1]);

    //////////////////////// VISUALIZACION DE LAS OPCIONES ////////////////////
    //creamos un nuevo div y se llamara caja
    let caja = document.createElement("div");
    caja.classList.add("caja");
    //le asignamos como texto, el de la primera opcion
    caja.textContent = selector.querySelector("option:first-child").textContent;
    //y agregamos el div.caja y el select al contenedor original
    contenedores[contenedores.length - 1].appendChild(caja);
    contenedores[contenedores.length - 1].appendChild(selector);

    
    //al hacer click se eevita que el eveneto se propage y agregamos la clase radio2 a la caja 
    caja.onclick = function (e) {
        e.stopPropagation();
        caja.classList.add("radio2");
        //----------------- CREACION DE LAS OPTION DEL SELECT -------------//
        //creamos un nuevo contenedor 
        let resultados = document.createElement("div");
        resultados.classList.add("resultados");
        this.appendChild(resultados);

        //dentro del resultado creamos un nuevo input para que podamos buscar opciones
        let buscador = document.createElement("input");
        buscador.setAttribute("type", "search");
        //le ponemos un placeholder de buscar
        buscador.setAttribute("placeholder", "busca...");
        resultados.appendChild(buscador);

        buscador.onclick = function (e) {
            e.stopPropagation();
        };

        //creamos un nuevo contendeor para contener las opciones buscadas 
        //y cuando hagamos click dentro de este contenedor tambien le ponemos el stop
        let contieneresultados = document.createElement("div");
        contieneresultados.onclick = function (e) {
            e.stopPropagation();
        };
        //------------------ GENERACION Y MANEJO DE LAS OPCIONES ----------//
        //obtenemos una lista de todas las opciones dentro del select original
        //selecciona todos los elementos option dentro de este select
        let opciones = selector.querySelectorAll("option");
        //recorremos cada opcion y le creamos un parrafo para cada una 
        opciones.forEach(function (opcion) {
            let texto = document.createElement("p");
            //cada opción del select se convierte en un párrafo que mostrará el mismo texto.
            texto.textContent = opcion.textContent;
            //y cada uno se agrega al contenedr de contieneresultados
            contieneresultados.appendChild(texto);

            //cuando hagamos click en una opcion
            texto.onclick = function () {
                console.log("Has hecho clic en una opción: ", texto.textContent);
                resultados.remove();
                //el texto de la caja se actualiza con el texto de la opcion seleccionada 
                caja.textContent = texto.textContent;

                let opciones2 = selector.querySelectorAll("option");
                //recorremos todas las opciones 
                opciones2.forEach(function (opcion2) {
                    //se compara el texto de la opcion actual con el del parrafo seleccionado
                    if (opcion2.textContent == texto.textContent) {
                        //si coinciden se marca como seleccionada 
                        opcion2.setAttribute("selected", true);
                    } else {
                        //si no coincide se desmarcan las opciones 
                        opcion2.removeAttribute("selected");
                    }
                });
            };
        });

        resultados.appendChild(contieneresultados);
        //------------------------- FILTRAMOS LAS OPCIONES ---------------------------//
        //se ejecutara cada vez que el usurio escriba algo en el campo de busqueda 
        buscador.onkeyup = function (e) {
            //cojemos el valor escrito 
            let busca = this.value;
            //y vaciamos el contenedor de resultados antes de agregar las nuevas opciones 
            contieneresultados.innerHTML = "";
            
            opciones.forEach(function (opcion) {
                //si el texto de la opcion escrito en el campo da igual(mayuculas/minusculas) agregamos esa opcion a la lista 
                if (opcion.textContent.toLowerCase().includes(busca.toLowerCase())) {
                    //creamos un nuevo parrafo con el texto filtrado
                    let texto = document.createElement("p");
                    texto.textContent = opcion.textContent;
                    //agregamos el parrafo al contendero de resultados 
                    contieneresultados.appendChild(texto);
                    //este codigo se vuelve a repetir para hacer lo mismo para marcar la opcion seleccionada 
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
    //----------------- CRERRA LA LISTA DE OPCIONES --------------//
    //para cuando hagamos click en cualquier parte del codigo 
    document.onclick = function () {
        contenedores.forEach(function (contenedor) {
            //utilizamos este bloque para ,anejar posibles errores 
            try {
                //dentro de cada cnotenedor buscamos el elemento resultado y lo elimina 
                //para ecrrar la lista de las opciones 
                contenedor.querySelector(".resultados").remove();
                //y ademas de eliminar la lista de opcioens tambien elimina la clase radio de la caja 
                contenedor.querySelector(".caja").classList.remove("radio2");
            } catch (error) {
                console.log("error pero no pasa nada");
            }
        });
    };
}
