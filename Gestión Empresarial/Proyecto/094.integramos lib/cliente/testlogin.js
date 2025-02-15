
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



/*
  window.onload = function() {
    console.log("Javascript cargado");

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
        document.querySelector("#usuario").placeholder = datos.usuario.contenido;
        document.querySelector("#contrasena").placeholder = datos.contrasena.contenido;
        document.querySelector("#login").textContent = datos.login.contenido;
    })
    .catch(function(error) {
        console.warn("Error cargando traducciones:", error);

        // Valores predeterminados en caso de error
        document.querySelector("#usuario").placeholder = "Usuario";
        document.querySelector("#contrasena").placeholder = "Contraseña";
        document.querySelector("#login").textContent = "Iniciar sesión";
    });

    // Evento para el botón de login
    document.querySelector("#login").onclick = function() {
        login();
    };

    function login() {
        console.log("Has pulsado el botón");

        let usuario = document.querySelector("#usuario").value;
        let contrasena = document.querySelector("#contrasena").value;
        console.log(usuario, contrasena);

        let mensaje = { "usuario": usuario, "contrasena": contrasena };

        fetch("../servidor/?o=buscar&tabla=usuarios", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mensaje),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.length > 0) {
                console.log("Entras correctamente");
                let nombreCompleto = data[0].nombre + " " + data[0].apellidos;
                localStorage.setItem('nombre_usuario', nombreCompleto);
                localStorage.setItem('crismon1_token', data[0].token);
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
            const toast = document.querySelector("#toast");
            toast.style.display = "block";
            toast.classList.add("animado");
            toast.textContent = "Error en acceso. Inténtalo de nuevo más tarde";

            console.warn("Error:", error);
        });
    }
};
*/