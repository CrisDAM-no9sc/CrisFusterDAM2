// Seleccionamos los elementos 'a' y 'b' donde el usuario hará clic
let a = document.querySelector('#a');
let b = document.querySelector('#b');

////// ASIGNACION DE EVENTOS////
a.onclick = function(e) {
    reset()                         //llamamos a la fncion reset
    revela.call(this, 'a');         // llamamos al la funcion y le asignamos this detntro para apuntar al boton
};

b.onclick = function(e) {
    reset()
    revela.call(this, 'b');
};

// Función que revela las estadísticas de manera divertida
function revela(identificador) {
    let estadistica = this.querySelector(".estadistica");
    let p = this.querySelector("p");
    p.style.display = "none";

    if(estadistica.style.display === "block"){
        estadistica.style.display = "none";
        p.style.display = "block";
    }else{
        p.style.display = "none";
        estadistica.style.display = "block";
        estadistica.style.opacity = 0;
        estadistica.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
            estadistica.style.opacity = 1;
        }, 10);
        estadistica.innerText = "¡Procesando datos... ";
    }
    ////////////////////////// LLAMADA DEL SERVIDOR //////////////////////////////////////////////////
     fetch("http://192.168.0.22/MyAppWeb/dame.php?option="  + identificador)
        .then(function(resultado){
            return resultado.json()
        })
        .then(function(datos){
           document.querySelector("#a .estadistica").textContent = datos.a + "% de la gente prefiere esto";
           document.querySelector("#b .estadistica").textContent = datos.a + "% de la gente prefiere esto";

            console.log(datos)
        })
}

/////////////////////////////////// FUNCIO PARA RESTAURAR EL ESTADO VISUAL DE AMBOS BOTONES////////////
function reset(){
    let reset = document.querySelectorAll('#a, #b')
    reset.forEach(option =>{
        let p = option.querySelector('p')
        let estadistica = option.querySelector('.estadistica')
        p.style.display = "block";
        estadistica.style.display = "none";
    })

}