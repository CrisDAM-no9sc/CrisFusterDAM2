window.onload = function(){
    let elemento = document.querySelector("body");
    let tamanio = 1;
    let contenedor = document.createElement("div");
    contenedor.classList.add("ampliador");
    let aumentar = document.createElement("button");
    aumentar.textContent = "+";
    contenedor.appendChild(aumentar)
    ///para añadir el efecto de disminuir cuando le damos al bioton de +
    aumentar.onclick = function(){
        tamanio *= 1.1;
        elemento.style.fontSize = tamanio+"em";
    }

    let disminuir = document.createElement("button");
    disminuir.textContent = "-";
    contenedor.appendChild(disminuir);
    ///para añadir el efecto de disminuir cuando le damos al bioton de -
    disminuir.onclick = function(){
        tamanio *= 0.9;
        elemento.style.fontSize = tamanio+"em";
    }

    document.querySelector("body").appendChild(contenedor);
    contenedor.style.position = "fixed";
    contenedor.style.top= "10px";
    contenedor.style.right = "10px";
    contenedor.style.fontSize = "1em";
    // Al hacer clic en cualquier parte de la página, selecciona el elemento
    document.onclick = function (event) {
        if (event.target !== aumentar && event.target !== disminuir) {
            elemento = event.target;
            console.log("Elemento seleccionado:", elemento);
            // Restablecemos el tamaño inicial para el nuevo elemento
            tamanio = 1;
        }
    };
}   