console.log("Archivo JavaScript cargado correctamente");

window.onload = function() {
    console.log("Javascript cargando");

    const modal = document.getElementById("miModal");
    const cerrar = document.querySelector(".cerrar");

    document.querySelector("#login").onclick = function() {
        let usuario = document.querySelector("#usuario").value;
        let contrasena = document.querySelector("#contrasena").value;

        if (usuario === "" || contrasena === "") {
            // Mostrar la ventana modal si algún campo está vacío
            modal.style.display = "flex";
            return; // Evitar que se ejecute el resto del código
        }

        // Imprimir los valores de usuario y contraseña en la consola
        console.log(usuario, contrasena);

        // Crear un objeto con los datos y mostrarlo en la consola
        let envio = { "usuario": usuario, "contrasena": contrasena };
        console.log(envio);  

        // Configuración de la petición fetch con método POST
        fetch("../servidor/loginusuario.php", {
            method: 'POST', // Método de la petición
            headers: {
                'Content-Type': 'application/json' // Especifica que se envían datos JSON
            },
            body: JSON.stringify(envio) // Convertir los datos a una cadena JSON
        })
        .then(response => {
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(data => {
            console.log('Respuesta recibida:', data);
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
    }

    // Cierra la ventana modal al hacer clic en la 'X'
    cerrar.onclick = function() {
        modal.style.display = "none";
    }

    // Cierra la ventana modal al hacer clic fuera de ella
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
