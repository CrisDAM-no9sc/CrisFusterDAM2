// Enumeramos los elementos textarea
let textos = document.querySelectorAll("textarea");

// Indicamos cuántos tenemos
console.log("tengo", textos.length, "textarea");

///////////////////////// reemplazar textaera por un contendor personalizado ///////////////////////
textos.forEach(function (textarea) {
    // Creamos un contenedor para los textos
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "textocontenedor");
    textarea.replaceWith(contenedor);
    contenedor.appendChild(textarea);
    textarea.style.display = "none";

    //////////////////// Creamos un div que va a ser el contenedor de los botones /////////////
    let barra = document.createElement("div");
    barra.classList.add("barra_botones");
    contenedor.appendChild(barra);

    ////////////////// Botón de negrita ///////////////////////
    let negrita = document.createElement("button");
    negrita.innerHTML = "<b>B</b>";
    barra.appendChild(negrita);
    negrita.onclick = function () {
        reemplaza("b");
    };

    ////////////////// Botón de cursiva ///////////////////////
    let cursiva = document.createElement("button");
    cursiva.innerHTML = "<i>I</i>";
    barra.appendChild(cursiva);
    cursiva.onclick = function () {
        reemplaza("i");
    };

    ////////////////// Botón de subrayado ///////////////////////
    let subrayado = document.createElement("button");
    subrayado.innerHTML = "<u>U</u>";
    barra.appendChild(subrayado);
    subrayado.onclick = function () {
        reemplaza("u");
    };

    ////////////////// Botón para color ///////////////////////
    let color = document.createElement("input");
    color.setAttribute("type", "color");
    barra.appendChild(color);
    color.oninput = function () {
        reemplaza("color");
    };

    ////////////////// Botón Pra el Tamaño de la fuente  ///////////////////////
    let tamanioFuente = document.createElement("select");
    let tamanios = [10,11,12,13,14,15,16,17,18,19,20];
    tamanios.forEach(function(tamanio){
        let opcion = document.createElement("option"); 
        opcion.textContent = tamanio;
        opcion.value = tamanio + "px";
        tamanioFuente.appendChild(opcion);
    })
    barra.appendChild(tamanioFuente);
    tamanioFuente.onchange = function() { reemplaza("font-size", tamanioFuente.value); };

    //////////////////// Selector de Fuente /////////////////////
    let formatoFuente = document.createElement("select");
    let fuentes = ["Arial", "Courier", "Georgia", "Times New Roman", "Verdana"];
    fuentes.forEach(function(fuente) {
        let opcion = document.createElement("option");
        opcion.textContent = fuente;
        opcion.value = fuente;
        formatoFuente.appendChild(opcion);
    });
    barra.appendChild(formatoFuente);
    formatoFuente.onchange = function() { reemplaza("font-family", formatoFuente.value); };

    //////////////////////// PARA HACER LISTAS  //////////////////////////
    let listaOrdenada = document.createElement("button");
    listaOrdenada.innerHTML = '<i class="fas fa-list-ol"></i>';
    barra.appendChild(listaOrdenada);
    listaOrdenada.onclick = function(){
        insertarLista("ol");
    }

    let listaDesordenada = document.createElement("button");
    listaDesordenada.innerHTML = '<i class="fas fa-list-ul"></i>';
    barra.appendChild(listaDesordenada);
    listaDesordenada.onclick = function(){
        insertarLista("ul");
    };

    //////////////////// ALINEACION DE TEXTO ////////////////////////////
    // Botón de alineación a la izquierda
    let alinearIzquierda = document.createElement("button");
    alinearIzquierda.innerHTML = '<i class="fas fa-align-left"></i>';
    barra.appendChild(alinearIzquierda);
    alinearIzquierda.onclick = function () {
        aplicarAlineacion("left");
    };

    // Botón de alineación al centro
    let alinearCentro = document.createElement("button");
    alinearCentro.innerHTML = '<i class="fas fa-align-center"></i>';
    barra.appendChild(alinearCentro);
    alinearCentro.onclick = function () {
        aplicarAlineacion("center");
    };

    // Botón de alineación a la derecha
    let alinearDerecha = document.createElement("button");
    alinearDerecha.innerHTML = '<i class="fas fa-align-right"></i>';
    barra.appendChild(alinearDerecha);
    alinearDerecha.onclick = function () {
        aplicarAlineacion("right");
    };

    /////////////////// Creamos el "textarea" editable ///////////////////
    let mitextarea = document.createElement("div");
    mitextarea.classList.add("textarea_nuevo");
    contenedor.appendChild(mitextarea);
    mitextarea.setAttribute("contenteditable", "true");
    mitextarea.onkeypress = function(){actualizaTextarea()}


    //////////////////// PARA HACER LISTAS  /////////////////
    function insertarLista(tipo){
        let lista = document.createElement(tipo);                  //utilizamos tipo para determinar el tipo de lista 
        let item = document.createElement("li");                   //// Crea un elemento de lista (li)
        item.textContent = "Elemenyo de la lista";
        lista.appendChild(item)                                    // Agrega el elemento de lista a la lista creada

        let rango = window.getSelection().getRangeAt(0);           // Obtiene el rango de selección actual
        rango.deleteContents();                                    // eliminamos el contenido 
        rango.insertNode(lista);                                   // Inserta la lista en el lugar de la selección
        // sincronizamos el contenido editable con el text area original
        actualizaTextarea();
        
    }

    ///////////////// Función para aplicar la alineación de texto////////////
    //Esta función se encarga de aplicar una alineación específica 
    //(izquierda, centro o derecha) al texto que se encuentra dentro del área de texto editable.
    function aplicarAlineacion(alineacion) {
        mitextarea.style.textAlign = alineacion;
        actualizaTextarea();
    }
    //////////////////// Funcion actualizar //////////////////////
    function actualizaTextarea(){
        let contenido = mitextarea.innerHTML;
        textarea.value = contenido;
    }
    //////////////////// Función para reemplazar con etiquetas ////////////////////////
    function reemplaza(etiqueta, value) {
        let textoseleccion = window.getSelection().toString();       // Obtiene el texto seleccionado por el usuario
        if (textoseleccion.length > 0) {                            // Verifica que haya texto seleccionado
            let rango = window.getSelection().getRangeAt(0);        // Obtiene el rango de la selección
            let estiloTexto;
    
            // Si el argumento es "color", aplica el color seleccionado
            if (etiqueta === "color") {
                estiloTexto = document.createElement("span");
                // Aplica el color seleccionado al estilo del span
                estiloTexto.style.color = color.value; 
            } 
            // Si el argumento es "font-size", aplica el tamaño de la fuente
            else if (etiqueta === "font-size") {
                estiloTexto = document.createElement("span");
                estiloTexto.style.fontSize = value;
            } 
            // Si el argumento es "font-family", aplica la fuente seleccionada
            else if (etiqueta === "font-family") {
                estiloTexto = document.createElement("span");
                estiloTexto.style.fontFamily = value;
            }
            // Si no es un color ni tamaño, aplica el estilo de la etiqueta correspondiente (b, i, u)
            else {
                estiloTexto = document.createElement(etiqueta); 
            }
    
            estiloTexto.textContent = textoseleccion;       // Asigna el texto seleccionado como contenido de la nueva etiqueta
            rango.deleteContents();                         // Elimina el texto seleccionado original
            rango.insertNode(estiloTexto);                  // Inserta la nueva etiqueta en el lugar de la selección
        }
        // Sincroniza el contenido actualizado con el <textarea> original
        actualizaTextarea(); 
    }
});