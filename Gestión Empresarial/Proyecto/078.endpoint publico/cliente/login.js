

window.onload = function() {
    console.log("Javascript cargado");
    //////////////////////////// ACCEDER A TRADUCTORES DINAMICAMENTE //////////////////////////
    // Cargar las traducciones basadas en el idioma del navegador

    const idioma = navigator.language.split('-')[0];
    fetch("traductor/" + idioma + ".json")
    .then(function(response) {
        if (!response.ok) {
          throw new Error("Archivo de traducción no encontrado");
        }
        return response.json();
      })
      .then(function(datos) {
        console.log(datos);
        // Actualizar el texto del botón de login
        document.querySelector("#login").textContent = datos.login.boton;
        // Actualizar el placeholder del campo de usuario
        document.querySelector("#usuario").placeholder = datos.login.usuario_placeholder;
        // Actualizar el placeholder del campo de contraseña
        document.querySelector("#contrasena").placeholder = datos.login.contrasena_placeholder;
      })
      .catch(function(error) {
        console.warn("Error cargando traducciones:", error);
        // Usar valores predeterminados en caso de error
        document.querySelector("#login").textContent = "Iniciar sesión";
        document.querySelector("#usuario").placeholder = "Usuario";
        document.querySelector("#contrasena").placeholder = "Contraseña";
      });
  
    // Cuando hagamos click se ejecutará esta función
    document.querySelector("#login").onclick = function() {
      login();
    }
  
  
    function login() {
      console.log("Has pulsado el botón");
  
      // Obtenemos el valor (texto) que ingresamos
      let usuario = document.querySelector("#usuario").value;
      // Obtenemos el valor de la contraseña que hemos ingresado
      let contrasena = document.querySelector("#contrasena").value;
      console.log(usuario, contrasena);
  
      // Creamos un objeto JSON con las propiedades de usuario y contraseña
      let mensaje = { "usuario": usuario, "contrasena": contrasena };
  
      // Iniciamos una solicitud fetch para enviar al servidor
      fetch("../servidor/?o=buscar&tabla=usuarios", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Convertimos el objeto en una cadena JSON
        body: JSON.stringify(mensaje),
      })
        .then(response => {
          // Verificamos si la respuesta es exitosa
          return response.json();
        })
        .then(data => {
          console.log(data);
  
          // Comprobamos si la longitud del array es mayor a 0, significando que el servidor encontró un usuario que coincide
          if (data.length > 0) {
            console.log("Entras correctamente");
            let nombreCompleto = data[0].nombre + " " + data[0].apellidos;  // Aquí unimos el nombre y apellidos
            localStorage.setItem('nombre_usuario', nombreCompleto);
            localStorage.setItem('crismon1_token', data[0].token);
  
            // Guardamos el nombre del usuario en el local del navegador
            localStorage.setItem('crismon1_usuario', data[0].usuario);
            document.querySelector("#comentario").style.color = "green";
            document.querySelector("#comentario").innerHTML = "Acceso correcto. Redirigiendo en 5 segundos...";
            setTimeout(function() {
              window.location = "escritorio/index.html";
            }, 5000);
          } else {
            console.log("Error al entrar");
            document.querySelector("#comentario").style.color = "red";
            document.querySelector("#comentario").innerHTML = "Usuario incorrecto. Redirigiendo en 5 segundos...";
            setTimeout(function() {
              window.location = window.location;
            }, 5000);
          }
        })
        .catch(error => {
          // Muestra el toast con el mensaje de error
          const toast = document.querySelector("#toast");
          toast.style.display = "block";  // Asegúrate de que el toast sea visible
          toast.classList.add("animado");  // Añade la animación
          toast.textContent = "Error en acceso. Inténtalo de nuevo más tarde";
  
          console.warn("Error:", error);
        });
    }
  }