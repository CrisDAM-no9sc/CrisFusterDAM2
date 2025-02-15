

window.onload = function(){

    let usuario = localStorage.getItem("crismon1_usuario");
    if(usuario == undefined){
    	window.location = "../"
    }
    let token = localStorage.getItem("crismon1_token");
    if(token == undefined){
    	window.location = "../"
    }
    fetch("../../servidor/?o=compruebatoken&token=" + token)
    .then(response => response.json())
    .then(data => {
      if (data.resultado == "ok") {
        // Token válido
      } else {
        window.location = "../";
      }
    })
    .catch(error => {
      console.error("Error en la validación del token:", error);
      window.location = "../";
    });
        
    // LLamo a un microservicio que me da la lista de aplicaciones
    fetch("../../servidor/?o=listadoaplicacionesusuario&usuario="+usuario)         
        .then(response => {
            // Quiero que el servidor me devuelva un json
          return response.json();                       
        })
        .then(data => {
            // Cargo el template HTML como una plantilla en memoria (como un class)
            const plantilla = document.getElementById('plantilla_aplicacion');     
            // Vomito el json en pantalla         
            console.log(data)                                                   
            // Para cada uno de los elementos que vienen en el json de la base de datos            
            data.forEach(function(elemento) {    
                // Pongo el elemento en pantalla simplemente para comprobar que funciona                                           
                console.log(elemento);        
                // Creo  una nueva instancia de la clase (como un instancia)                                              
                const instancia = plantilla.content.cloneNode(true); 
                // Dentro de la plantilla selecciono a uno de los elementos                       
                const nombre = instancia.querySelector('p');                                
                // Y le pongo el contenido que saco del json
                nombre.innerHTML = elemento.nombre; 
                                                        
                const imagen = instancia.querySelector("img")
                imagen.setAttribute("src","img/"+elemento.icono)
                // Por ultimo realmente pongo la instancia en el arbol html
                document.querySelector('main').appendChild(instancia);                      
            });
            // Selecciono todas las aplicaciones y las pongo en un array
            let aplicaciones = document.querySelectorAll(".aplicacion")                     
            // Para cada una de las aplicaciones
            aplicaciones.forEach(function(aplicacion){   
                // Cuando haga click en esa aplicacion                                   
                aplicacion.onclick = function(){   

                    localStorage.setItem('crismon1_aplicacion', this.querySelector("p").textContent);                                        
                    window.location = "../supercontrolador/"
                }
            })
        })

        document.querySelector("#cerrar").onclick = function(){
            localStorage.removeItem("crismon1_usuario")
            localStorage.removeItem("crismon1_token")
            window.location = "../"
        }
}
