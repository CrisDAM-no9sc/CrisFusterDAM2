// Inicializamos una cadena de texto y seleccionamos el contenedor donde se va a insertar el selector
let texto = "Cristina";
let contenedor = document.querySelector("#contenedor");
let selector = document.createElement("select");

// Crear las opciones del select a partir de la cadena de texto
for (let i = 0; i < 10; i++) {
    let opcion = document.createElement("option"); // Creamos una nueva opción
    opcion.textContent = texto[i];  // Establecemos el texto de la opción
    opcion.value = i;  // Establecemos un valor único para cada opción
    selector.appendChild(opcion);  // Añadimos la opción al select
}

// Añadimos el select al contenedor en el DOM
contenedor.appendChild(selector);

// Llamamos a la función `selectjv` para personalizar el select creado
selectjv(selector);

function selectjv(selector) {
    // Array para almacenar los contenedores (divs) que vamos a crear para simular el select
    let contenedores = []; 

    // Creamos un nuevo contenedor div y lo añadimos al array
    contenedores.push(document.createElement("div"));
    contenedores[contenedores.length - 1].classList.add("selectjv");  

    // Prevenir que al hacer clic en el contenedor se cierren los resultados por eventos globales
    contenedores[contenedores.length - 1].onclick = function(e) {
        e.stopPropagation();  // Evita que el clic se propague y cierre el contenedor
    };

    // Reemplazamos el select original con el nuevo div contenedor
    selector.replaceWith(contenedores[contenedores.length - 1]);

    // Crear una caja dentro del contenedor que mostrará el valor seleccionado del select
    let caja = document.createElement("div");
    caja.classList.add("caja");  // Añadimos una clase a la caja para estilizarla
    caja.textContent = selector.querySelector("option:first-child").textContent;  
    // Añadimos la caja al contenedor
    contenedores[contenedores.length - 1].appendChild(caja);
    // Añadimos el selector al contenedor
    contenedores[contenedores.length - 1].appendChild(selector);  

    // Configuramos la funcionalidad de la caja y la búsqueda
    configurarCaja(caja, selector, contenedores[contenedores.length - 1]);
}

//////////////////////////// CONFIGURACION DE LA CAJA DE SELECTOR Y FILTRO DE BUSQUEDA //////////////////////////

function configurarCaja(caja, selector, contenedorSelect) {
    caja.onclick = function(e) {
        // Evita que el clic en la caja cierre los resultados
        e.stopPropagation();  
        // Añadimos una clase para indicar que está seleccionado
        caja.classList.add("radio2");  

        // Creamos el contenedor para los resultados y la barra de búsqueda
        let resultados = document.createElement("div");
        // Le damos una clase para estilizar los resultados
        resultados.classList.add("resultados");  
        // Añadimos el contenedor de resultados
        contenedorSelect.appendChild(resultados);  

        // Creamos un campo de entrada de tipo 'search' para la búsqueda
        let buscador = document.createElement("input");
        buscador.setAttribute("type", "search");
        buscador.setAttribute("placeholder", "Busca...");  
        // Añadimos el buscador al contenedor de resultados
        resultados.appendChild(buscador);  

        // Evitar que hacer clic en el buscador cierre el menú de resultados
        buscador.onclick = function(e) {
            e.stopPropagation();
        };

        // Filtrar las opciones a medida que el usuario escribe en el buscador
        buscador.onkeyup = function() {
            filtrarOpciones(this.value, selector, resultados);
        };

        // Mostrar todas las opciones cuando se abre el menú de selección
        mostrarOpciones(selector, resultados);
    };
}

///////////////////////////////// FUNCION PARA FILTRAR LAS OPCIONES ////////////////////////////

function filtrarOpciones(busca, selector, resultados) {
    let contieneresultados = document.createElement("div");
    contieneresultados.onclick = function(e) {
        e.stopPropagation();  
    };
    // Obtenemos todas las opciones del selector
    let opciones = selector.querySelectorAll("option");  

    // Limpiamos el contenedor de resultados antes de añadir las opciones filtradas
    contieneresultados.innerHTML = "";

    // Iteramos sobre las opciones y mostramos solo aquellas que coincidan con el texto de búsqueda
    opciones.forEach(function(opcion) {
        if (opcion.textContent.toLowerCase().includes(busca.toLowerCase())) {
            // Creamos un nuevo elemento de texto para cada opción filtrada
            let texto = document.createElement("p");  
            texto.textContent = opcion.textContent;
            // Añadimos el texto al contenedor de resultados
            contieneresultados.appendChild(texto);  

            // Evento para manejar el clic en una opción filtrada
            texto.onclick = function() {
                // Actualizamos el texto de la caja con la opción seleccionada
                caja.textContent = texto.textContent;  
                // Eliminamos los resultados de la búsqueda
                resultados.remove();  
                // Marcamos la opción seleccionada en el select original
                actualizarOpcionSeleccionada(selector, texto.textContent);  
            };
        }
    });
    // Añadimos los resultados al contenedor de resultados
    resultados.appendChild(contieneresultados);  
}

/////////////////////////////////////// FUNCION ENSEÑAR LAS OPCIONES /////////////////////////////

function mostrarOpciones(selector, resultados) {
    let contieneresultados = document.createElement("div");
    // Evitar que el clic en el contenedor cierre el menú
    contieneresultados.onclick = function(e) {
        e.stopPropagation();  
    };
    // Obtenemos todas las opciones del select
    let opciones = selector.querySelectorAll("option");  

    // Iteramos sobre las opciones y las mostramos en el menú
    opciones.forEach(function(opcion) {
        let texto = document.createElement("p");
        texto.textContent = opcion.textContent;
        contieneresultados.appendChild(texto);

        // Evento para manejar el clic en una opción
        texto.onclick = function() {
            // Actualizamos la caja con el texto de la opción seleccionada
            caja.textContent = texto.textContent;  
            // Eliminamos los resultados del menú
            resultados.remove();  
            // Marcamos la opción seleccionada en el select original
            actualizarOpcionSeleccionada(selector, texto.textContent);  
        };
    });
    // Añadimos las opciones al contenedor de resultados
    resultados.appendChild(contieneresultados);  
}

//////////////////////////////////// FUNCION ACTUALIZAR OPCIONES ////////////////////////////////

function actualizarOpcionSeleccionada(selector, textoSeleccionado) {
    let opciones = selector.querySelectorAll("option");
    opciones.forEach(function(opcion) {
        if (opcion.textContent === textoSeleccionado) {
            // Marcamos la opción como seleccionada
            opcion.setAttribute("selected", true);  
        } else {
            // Desmarcamos las demás opciones
            opcion.removeAttribute("selected");  
        }
    });
}

// Evento para cerrar el menú de resultados cuando se haga clic fuera del contenedor
document.onclick = function() {
    let contenedores = document.querySelectorAll(".selectjv");
    contenedores.forEach(function(contenedor) {
        try {
            // Eliminamos los resultados del menú
            contenedor.querySelector(".resultados").remove();  
            // Quitamos la clase de selección de la caja
            contenedor.querySelector(".caja").classList.remove("radio2");  
        } catch (error) {
            console.log("Error al intentar cerrar el menú, pero no pasa nada");
        }
    });
};
