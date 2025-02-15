window.onload = function(){
    fetch("http://localhost/Gesti%c3%b3n%20Empresarial/Proyecto/078.endpoint%20publico/public/")
    .then(function(resultado){
        console.log(resultado)
        return resultado.json()
    })
    .then(function(datos){
        console.log(datos)
        const contenedor = document.querySelector(".productos-container");
        let plantilla = document.querySelector("#plantilla_articulos");
        datos.forEach(function(dato){ 
            const instancia = plantilla.content.cloneNode(true);

            // Asignamos los valores
            instancia.querySelector("h2").textContent = dato.nombre;
            instancia.querySelector(".descripcion").textContent = dato.descripcion;
            instancia.querySelector(".precio").textContent = `${dato.precio} €`;
            instancia.querySelector("img").src = dato.fotografia;

            // Añadimos al contenedor
            contenedor.appendChild(instancia);
        })
    })
}