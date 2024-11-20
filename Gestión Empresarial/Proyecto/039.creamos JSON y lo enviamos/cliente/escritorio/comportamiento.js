window.onload = function(){
    // LLamo a un microservicio que me da la lista de aplicaciones
    fetch("../../servidor/?o=tabla&tabla=aplicaciones")         
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
                    window.location = "../supercontrolador/"
                }
            })
        })
}