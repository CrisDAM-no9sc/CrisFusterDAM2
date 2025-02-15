window.onload = function() {
  console.log("Javascript cargado");

  // Cargamos las traducciones (esto ya lo tienes)
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
        document.querySelector("#titulo").textContent = datos.titulo.contenido;
        document.querySelector("#usuario").placeholder = datos.usuario.contenido;
        document.querySelector("#contrasena").placeholder = datos.contrasena.contenido;
        document.querySelector("#login").textContent = datos.login.contenido;
    })
    .catch(function(error) {
        console.warn("Error cargando traducciones:", error);
        document.querySelector("#login").textContent = "Iniciar sesión";
        document.querySelector("#usuario").placeholder = "Usuario";
        document.querySelector("#contrasena").placeholder = "Contraseña";
    });

  // Al pulsar el botón de login se ejecuta la función login()
  document.querySelector("#login").onclick = function() {
      login();
  }

  function login() {
      console.log("Has pulsado el botón");

      // Obtenemos los valores de los inputs
      let usuario = document.querySelector("#usuario").value;
      let contrasena = document.querySelector("#contrasena").value;
      console.log("Datos ingresados:", usuario, contrasena);

      // Creamos el objeto con los datos a enviar
      let mensaje = { "usuario": usuario, "contrasena": contrasena };

      // En lugar de enviar al endpoint de usuarios, lo enviamos al archivo testSanear.php
      fetch("testSanear.php", {  // Asegúrate de que la ruta sea correcta según la ubicación del archivo
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(mensaje),
      })
      .then(response => response.json())
      .then(data => {
          console.log("Respuesta del servidor:", data);
          // Mostramos el resultado en el div "comentario"
          document.querySelector("#comentario").innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
      })
      .catch(error => {
          console.error("Error:", error);
          document.querySelector("#comentario").innerHTML = "Se produjo un error en la petición.";
      });
  }
}

/// SIN MODIFICAR

/* window.onload = function() {
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
        document.querySelector("#titulo").textContent = datos.titulo.contenido;
        // Actualizar el placeholder del campo de usuario
        document.querySelector("#usuario").placeholder = datos.usuario.contenido;
        // Actualizar el placeholder del campo de contraseña
        document.querySelector("#contrasena").placeholder = datos.contrasena.contenido;
        // Actualizar el texto del botón de login
        document.querySelector("#login").textContent = datos.login.contenido;
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

*/