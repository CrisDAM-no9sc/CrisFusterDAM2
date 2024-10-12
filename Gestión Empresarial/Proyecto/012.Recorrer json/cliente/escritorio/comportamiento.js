window.onload = function(){
    fetch("../../servidor/aplicaciones.php")               //llamamos al archivo de aplicciones
        .then(response => {
          // Quiero que el servidor me devuelva un json
          return response.json();                       
        })
        .then(data => {
          //cargamos el template con una plantilla en memoria (es como una clase)
            const plantilla = document.getElementById('plantilla'); 
            //aqui con data lo que estsmosas haciendo es que nos de el json en pantalla
            console.log(data)                           
            data.forEach(function(elemento) { 
              //Aqui estamos poniendo los elemento en pantalla para comprobar que funciona 
              console.log(elemento); 
              //aqui estamos creando una nueva instancia de la class (plantilla)                                          
              const instancia = plantilla.content.cloneNode(true);
              //seleccionamos dentro de plantilla a uno de los elementos "p"
              const nombre = instancia.querySelector('p');     
              //y le ponemos el contenido del json       
              nombre.innerHTML = elemento.nombre;

              const imagen = instancia.querySelector("img");
              imagen.setAttribute("src", "img/" +elemento.icono);
              //El query selector lo que nos permite es seleccionar un elemento DOM usamos main
              //Y appendchild lo coloca al final de cualquier contenido
              document.querySelector('main').appendChild(instancia);             
            });
        })
}