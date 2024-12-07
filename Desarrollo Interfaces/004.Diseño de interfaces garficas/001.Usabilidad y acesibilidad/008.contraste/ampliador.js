

let tamanio = 1;
let cantidadcontraste = 1;
let contenedor = document.createElement("div");
contenedor.classList.add("ampliador");

///////////////////////////////// AUMENTAR ///////////////////////////////

let aumentar = document.createElement("button");
aumentar.textContent = "+";
contenedor.appendChild(aumentar)
///para añadir el efecto de disminuir cuando le damos al bioton de +
aumentar.onclick = function(){
    tamanio *= 1.1;
    elemento.style.fontSize = tamanio+"em";
}

/////////////////////////////////CONTRATSE DEL AUMENTAR ///////////////////////////////

let contraste = document.createElement("button");
contraste.textContent = "*";
contenedor.appendChild(contraste)
contraste.onclick = function(){
    cantidadcontraste =3;
    elemento.style.filter= tamanio+"contrast("+cantidadcontraste+")";
}

///////////////////////////////// DISMINUIR ///////////////////////////////
let disminuir = document.createElement("button");
disminuir.textContent = "-";
contenedor.appendChild(disminuir);
///para añadir el efecto de disminuir cuando le damos al bioton de -
disminuir.onclick = function(){
    tamanio *= 0.9;
    elemento.style.fontSize = tamanio+"em";
}

document.querySelector("body").appendChild(contenedor);

     