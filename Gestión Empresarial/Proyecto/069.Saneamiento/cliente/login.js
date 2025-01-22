
// Definir la función de login
function login() {
    console.log("Has pulsado el botón o presionado Enter");

    // Obtenemos el valor (texto) que ingresamos
    let usuario = document.querySelector("#usuario").value;
    // Obtenemos el valor de la contraseña que hemos ingresado
    let contrasena = document.querySelector("#contrasena").value;
    console.log(usuario, contrasena);

    // Crear un objeto JSON con las propiedades de usuario y contraseña
    let mensaje = { "usuario": usuario, "contrasena": contrasena };

    // Iniciar una solicitud fetch para enviar al servidor
    fetch("../servidor/?o=buscar&tabla=usuarios", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        // Convertir el objeto en una cadena JSON
        body: JSON.stringify(mensaje),
    })
    .then(response => {
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();  
    })
    .then(data => {
        console.log(data);

        // Comprobar si hay un mensaje de error
        if (data.error) {
            console.log("Error al entrar:", data.error);
            document.querySelector("#comentario").style.color = "red";
            document.querySelector("#comentario").innerHTML = "Error: " + data.error;
            setTimeout(function() {
                window.location = window.location;
            }, 5000);
            return;
        }

        // Comprobar si la longitud del array es mayor a 0, significando que el login es satisfactorio
        if (data.length > 0) {
            console.log("Entras correctamente");
            let nombreCompleto = data[0].nombre + " " + data[0].apellidos;  // Unir nombre y apellidos
            localStorage.setItem('nombre_usuario', nombreCompleto);  
            // Guardar el nombre del usuario en el local del navegador
            localStorage.setItem('crismon1_usuario', data[0].usuario);
            document.querySelector("#comentario").style.color = "green";
            document.querySelector("#comentario").innerHTML = "Acceso correcto. Redirigiendo en 5 segundos...";
            setTimeout(function() {
                window.location = "escritorio/index.html";
            }, 5000);
        } else {
            console.log("Error al entrar: Usuario no encontrado");
            document.querySelector("#comentario").style.color = "red";
            document.querySelector("#comentario").innerHTML = "Usuario incorrecto. Redirigiendo en 5 segundos...";
            setTimeout(function() {
                window.location = window.location;
            }, 5000);
        }
    })
    .catch(error => {
        // Manejar errores
        console.error("Error al procesar la respuesta:", error);
        // Mostrar un mensaje de error al usuario
        const toast = document.querySelector("#toast");
        toast.style.display = "block";  // Asegúrate de que el toast sea visible
        toast.classList.add("animado");  // Añade la animación
        toast.textContent = "Error en acceso. Inténtalo de nuevo más tarde.";
    });
}

// Configurar los manejadores de eventos una vez que el DOM haya cargado
window.onload = function() {
    console.log("Javascript cargado");

    // Asignar el manejador de clic al botón de login
    document.querySelector("#login").onclick = function() {
        login();
    }

    // Asignar el manejador de evento para la tecla "Enter"
    document.onkeypress = function(e){
        console.log("Has pulsado una tecla");
        if(e.code === "Enter"){
            console.log("Y la tecla es Enter");
            login();
        }
    }
}