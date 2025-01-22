window.onload = function(){
    console.log("Javascript cargado");
    //cuando hagamos click se ejecutara esta funcion
    document.querySelector("#login").onclick = function(){
        console.log("Has pulsado el boton");
        //obtenemos el valor (texto) que el ingresemos
        let usuario = document.querySelector("#usuario").value;
        //obtenemos e valor de la contrasña que hemos ingresao 
        let contrasena = document.querySelector("#contrasena").value;
        console.log(usuario,contrasena);
        //creamos un objeto JSON con propiedades de usuaruio y contraseña
        // Me conecto a un microservicio y le envío la información json en POST
        let mensaje = {"usuario":usuario,"contrasena":contrasena}
        //iniciamos una solicitud fetch para enviar al servidor
        //para buscar en la tabla de ususarios 
        fetch("../servidor/?o=buscar&tabla=usuarios", {
                          method: 'POST', 
                          headers: {
                            'Content-Type': 'application/json', 
                          },
                          //aqui convertimos el objeto en una cadena JSON
                          body: JSON.stringify(mensaje), 
                        })
        //manejamos la respuesta del servidor, y cuando este responde devulve la respuesta en json
        .then(response => {
          return response.json();                                                       
        })
        //aqui es donde almacenamos la resuesta anterior 
        .then(data => {
          console.log( data);    
          //compribamos si la longitud ddel array es mayor a 0, siginificara el servidor a encontrado un usuario que ocincide                                         
          if(data.length > 0){                                               
            console.log("Entras correctamente")
            //guarda el nombre del usuario en el local del navegador 
            localStorage.setItem('crismon1_usuario', data[0].usuario);       
            document.querySelector("#comentario").style.color = "green"         
            document.querySelector("#comentario").innerHTML = "Acceso correcto. Redirigiendo en 5 segundos...";  
            setTimeout(function(){
                window.location = "escritorio/index.html";                                          
            },5000)
          // y si la longitud es 0, nos dira que no se a encontrado ningun resultado  y se ejecutara el else 
          }else{
            console.log("Error al entrar")
            document.querySelector("#comentario").style.color = "red"          
            document.querySelector("#comentario").innerHTML = "Usuario incorrecto. Redirigiendo en 5 segundos...";        
            setTimeout(function(){
                window.location = window.location;                           
            },5000)
          }
        })
    }
}