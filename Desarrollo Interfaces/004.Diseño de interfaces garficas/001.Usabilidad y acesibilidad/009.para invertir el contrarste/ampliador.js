

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
    document.querySelector("body").style.fontSize = tamanio+"em";
    
}

///////////////////////////////// CONTRATSE ///////////////////////////////

let contraste = document.createElement("button");
contraste.textContent = "\u2600 +";
contenedor.appendChild(contraste)
contraste.onclick = function(){
    cantidadcontraste =3;
    document.querySelector("body").style.filter="contrast("+cantidadcontraste+")";
}

///////////////////////////////// INVERTIR CONTRATSE ///////////////////////////////

let invertir = document.createElement("button");
invertir.textContent = "\u2600 -";
contenedor.appendChild(invertir)

invertir.onclick = function(){
    cantidadcontraste =3;
    document.querySelector("body").style.filter ="invert(1)";
}

///////////////////////////////// DISMINUIR ///////////////////////////////

let disminuir = document.createElement("button");
disminuir.textContent = "-";
contenedor.appendChild(disminuir);
///para añadir el efecto de disminuir cuando le damos al bioton de -
disminuir.onclick = function(){
    tamanio *= 0.9;
    document.querySelector("body").style.fontSize = tamanio+"em";
}

document.querySelector("body").appendChild(contenedor);

     