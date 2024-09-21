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
