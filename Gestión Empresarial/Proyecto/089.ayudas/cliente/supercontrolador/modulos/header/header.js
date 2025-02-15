// Función para inicializar el encabezado: muestra el nombre del usuario, asigna el evento de cierre de sesión y el de abrir el correo
function inicializarEncabezado() {
    const nombreUsuario = localStorage.getItem('nombre_usuario'); // Obtenemos el nombre completo desde localStorage
    if (nombreUsuario) {
        const elementoUsuario = document.getElementById('nombre-usuario');
        if (elementoUsuario) {
            elementoUsuario.textContent = nombreUsuario; // Actualizamos el texto con el nombre completo
        }
    }
    
    // Evento para cerrar sesión
    document.querySelector("#logout").onclick = function() {
        localStorage.removeItem('nombre_usuario');
        localStorage.removeItem('crismon1_usuario');
        window.location = "../index.php";
    };

    // Evento para abrir el correo electrónico
    document.querySelector("#correo").onclick = function() {
        const seccion = document.querySelector("section");
        seccion.innerHTML = "";
        seccion.style.display = "block";
        let iframeCorreo = document.createElement("iframe");
        iframeCorreo.setAttribute("src", "http://localhost:5000/");
        iframeCorreo.setAttribute("id", "correo-iframe");
        seccion.appendChild(iframeCorreo);
    };
    // Evento para imprimir la página
    document.querySelector("#imprimir").onclick = function() {
        var iframe = document.querySelector("section iframe");
        if (iframe) {
            try {
                iframe.contentWindow.focus(); // Enfoca el contenido del iframe
                iframe.contentWindow.print(); // Intenta imprimir solo el iframe
            } catch (error) {

                window.print(); 
            }
        } else {
            window.print(); // Si no hay iframe, imprime normalmente
        }
    };
    document.querySelector("#ayuda").onclick = function(){
        const seccion = document.querySelector("section");
        seccion.innerHTML = "";
        seccion.style.display = "block";
        let iframeAyuda = document.createElement("iframe");
        iframeAyuda.setAttribute("src", "ayuda/");
        seccion.appendChild(iframeAyuda);
    }



}