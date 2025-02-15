

window.onload = function() {
    console.log("Javascript cargado");
    document.querySelector("#login").onclick = function(){
        login()
    }
    document.onkeypress = function(e){
    	console.log("Has pulsado una tecla")
    	if(e.code == "Enter"){
    		console.log("Y la tecla es enter")
    		login()
    	}
    }
}

function login(){
    console.log("Has pulsado el boton");
    // Obtenemos el valor (texto) que ingresamos
    let usuario = document.querySelector("#usuario").value;
    // Obtenemos el valor de la contraseña que hemos ingresado
    let contrasena = document.querySelector("#contrasena").value;
    console.log(usuario,contrasena);
    let mensaje = {"usuario": usuario, "contrasena": contrasena};

    fetch("../servidor/?o=buscar&tabla=usuarios", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(mensaje),
        })
        .then(response => {

            return response.json();
        })
        .then(data =>{
            console.log(data)
            if(data.length > 0){                                            
                console.log("Entras correctamente")
                const nombreCompleto = `${data[0].nombre} ${data[0].apellidos}`;
                localStorage.setItem("nombre_usuario", nombreCompleto);
                localStorage.setItem("crismon1_usuario", data[0].usuario);
                localStorage.setItem("crismon1_token", data[0].token);
                document.querySelector("#comentario").style.color = "green";
                document.querySelector("#comentario").textContent = "Acceso correcto. Redirigiendo en 5 segundos...";
                setTimeout(function(){
                    window.location = "escritorio/index.html";                            // Me voy al escritorio                 
                },5000)
            } else {
                document.querySelector("#comentario").style.color = "red";
                document.querySelector("#comentario").textContent = "Usuario incorrecto.";
                  setTimeout(function() {
                      window.location = window.location;
                  }, 5000);
              }

        })
        .catch(error => {

            console.error("Error durante la solicitud:", error);
            // Muestra el toast con el mensaje de error
            const toast = document.querySelector("#toast");
            toast.style.display = "block";  // Asegúrate de que el toast sea visible
            toast.classList.add("animado");  // Añade la animación
            toast.textContent = "Error en acceso. Inténtalo de nuevo más tarde";
    
            
        });
}
      



