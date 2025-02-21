
/**
 * # Sistema de Validación y Carga Dinámica de Aplicaciones
 * 
 * ## Descripción:
 * Este script maneja la autenticación del usuario, validación de tokens y 
 * carga dinámica de las aplicaciones disponibles para el usuario autenticado.
 * 
 * ## Funcionalidades principales:
 * - Verificación del usuario y token en `localStorage`.
 * - Validación del token con el servidor (`fetch` a `compruebatoken`).
 * - Carga de las aplicaciones disponibles desde el servidor.
 * - Renderizado dinámico de las aplicaciones en la interfaz.
 * - Manejo de eventos `onclick` en los elementos generados.
 * - Cierre de sesión eliminando credenciales del `localStorage`.
 */

window.onload = function(){

      /**
     * ## Validación del Usuario y Token
     * Se verifica si existen en `localStorage`. 
     * Si no existen, redirige a la página de inicio.
     */

    let usuario = localStorage.getItem("crismon1_usuario");
    if(usuario == undefined){
    	window.location = "../"
    }
    let token = localStorage.getItem("crismon1_token");
    if(token == undefined){
    	window.location = "../"
    }

    /**
     * ## Verificación del Token con el Servidor
     * Realiza una solicitud `fetch` al servidor para comprobar si el token es válido.
     * Si no es válido, redirige al usuario a la página de inicio.
    */

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
        
    /**
     * ## Carga de Aplicaciones del Usuario
     * Se solicita al servidor la lista de aplicaciones disponibles para el usuario autenticado.
     */
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
        /**
         * ## Cierre de Sesión
         * Cuando el usuario presiona el botón de cerrar sesión, se eliminan los 
         * datos del usuario y el token de `localStorage` y se redirige a la página de inicio.
        */
        document.querySelector("#cerrar").onclick = function(){
            localStorage.removeItem("crismon1_usuario")
            localStorage.removeItem("crismon1_token")
            window.location = "../"
        }
}
