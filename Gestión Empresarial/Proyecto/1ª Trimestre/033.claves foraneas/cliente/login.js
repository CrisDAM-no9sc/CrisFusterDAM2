window.onload = function(){
    console.log("Javascript cargado");
    document.querySelector("#login").onclick = function(){
        console.log("Has pulsado el boton");
        let usuario = document.querySelector("#usuario").value;
        let contrasena = document.querySelector("#contrasena").value;
        console.log(usuario,contrasena);
        // Me conecto a un microservicio y le envío la información json en POST
        let mensaje = {"usuario":usuario,"contrasena":contrasena}
        fetch("../servidor/?o=buscar&tabla=usuarios", {
                          method: 'POST', 
                          headers: {
                            'Content-Type': 'application/json', 
                          },
                          body: JSON.stringify(mensaje), 
                        })
        .then(response => {
          return response.json();                                                       // Quiero que el servidor me devuelva un json
        })
        .then(data => {
          console.log( data);                                            // De momento voy a poner ese JSON en la consola simplemente para ver que la comunicacion es ok
          if(data.length > 0){                                               // En el caso de que el login sea satisfactorio
            console.log("Entras correctamente")
            localStorage.setItem('crismon1_usuario', data[0].usuario);       // Ahora necesito un mencanismo para que el cliente recuerde quien soy
            document.querySelector("#comentario").style.color = "green"         // Pongo el mensaje de color verde
            document.querySelector("#comentario").innerHTML = "Acceso correcto. Redirigiendo en 5 segundos...";   // Escribo un mensaje de ok
            setTimeout(function(){
                window.location = "escritorio/index.html";                            // Me voy al escritorio                 
            },5000)
          }else{
            console.log("Error al entrar")
            document.querySelector("#comentario").style.color = "red"           // Pongo el mensaje de color rojo
            document.querySelector("#comentario").innerHTML = "Usuario incorrecto. Redirigiendo en 5 segundos...";        // Escribo mensaje de error
            setTimeout(function(){
                window.location = window.location;                              // en 5 segundos vuelvo al mismo sitio
            },5000)
          }
        })
    }
}