window.onload = function(){
    console.log("Javascript cargado");
    document.querySelector("#login").onclick = function(){
        console.log("Has pulsado el boton");
        let usuario = document.querySelector("#usuario").value;
        let contrasena = document.querySelector("#contrasena").value;
        console.log(usuario,contrasena);
        let envio = {"usuario":usuario,"contrasena":contrasena};
        console.log(envio);
        // Referencia al div de comentarios
        let comentarioDiv = document.querySelector("#comentario");
        // Me conecto a un microservicio y le envío la información json en POST
        fetch("../servidor/loginusuario.php?usuario="+usuario+"&contrasena="+contrasena)
        .then(response => {
          return response.json();                       // Quiero que el servidor me devuelva un json
        })
        .then(data => {
          console.log('Success:', data);                // De momento voy a poner ese JSON en la consola simplemente para ver que la comunicacion es ok
          if(data.resultado == 'ok'){
            console.log("entras correctamente")
            localStorage.setItem('crismon1_usuario',data.usuario);
            document.querySelector('#comentario').style.color = "green";
            document.querySelector('#comentario').innerHTML = "Acceso Correcto. Redirigiendo...";
            setTimeout(function(){
              window.location.href = "escritorio.html"; 
          }, 2000);
          }else{
            console.log("error al entrar")
            document.querySelector('#comentario').style.color = "red";
            document.querySelector('#comentario').innerHTML = "Usuario incorrecto. Redirigiendo en 5 segundos...";
            setTimeout(function(){
                window.location = window.location;
            },5000)
          }
        })
    }
}