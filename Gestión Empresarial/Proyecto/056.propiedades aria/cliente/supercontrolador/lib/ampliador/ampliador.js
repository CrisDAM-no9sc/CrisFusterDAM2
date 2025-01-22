

let tamanio = 1;
let cantidadcontraste = 1;
let contenedor = document.createElement("div");
contenedor.classList.add("ampliador");


///////////////////////////////// FUENTE ///////////////////////////////

let fuentes = ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'];
let contador = 0;

let fuente = document.createElement("button");
fuente.textContent = "F";
fuente.setAttribute("aria-label","Cambiar de funete")
contenedor.appendChild(fuente)

fuente.onclick = function(){
    document.querySelector("body").style.fontFamily = fuentes[contador];
    contador++;
    if(contador == 4){contador = 0;}
}

///////////////////////////////// AUMENTAR ///////////////////////////////

let aumentar = document.createElement("button");
aumentar.textContent = "+";
aumentar.setAttribute("aria-label","Ampliar")
contenedor.appendChild(aumentar)
///para añadir el efecto de disminuir cuando le damos al bioton de +
aumentar.onclick = function(){
    tamanio *= 1.1;
    //document.querySelector("body").style.fontSize = tamanio+"em";
    document.querySelector("body").style.transform = "scale(" + tamanio + ")";
    
}

///////////////////////////////// CONTRATSE ///////////////////////////////

let contraste = document.createElement("button");
contraste.textContent = "☼";
contraste.setAttribute("aria-label","Cambiar contraste")
contenedor.appendChild(contraste)
contraste.onclick = function(){
    cantidadcontraste =3;
    document.querySelector("body").style.filter="contrast("+cantidadcontraste+")";
}

///////////////////////////////// INVERTIR CONTRATSE ///////////////////////////////

let invertir = document.createElement("button");
invertir.textContent = "🔾";
invertir.setAttribute("aria-label","Invertir contraste")
contenedor.appendChild(invertir)

invertir.onclick = function(){
    cantidadcontraste =3;
    document.querySelector("body").style.filter ="invert(1)";
}

///////////////////////////////// DISMINUIR ///////////////////////////////

let disminuir = document.createElement("button");
disminuir.textContent = "-";
disminuir.setAttribute("aria-label","Disminuir contenido pagina")
contenedor.appendChild(disminuir);
///para añadir el efecto de disminuir cuando le damos al bioton de -
disminuir.onclick = function(){
    tamanio *= 0.9;
    document.querySelector("body").style.transform = "scale(" + tamanio + ")"; 
}


///////////////////////////////// RESTABLECER ///////////////////////////////

let restablecer = document.createElement("button");
restablecer.textContent = "⭯"; 
restablecer.setAttribute("aria-label","Volver a pagina original")
contenedor.appendChild(restablecer);
restablecer.onclick = function () {
  tamanio = 1;
  cantidadcontraste = 1;
  document.querySelector("body").style.transform = "scale(1)";
  document.querySelector("body").style.filter = "none";
};

///////////////////////////////// AÑADIR AL DOCUMENTO ///////////////////////////////
document.querySelector("body").appendChild(contenedor);

     