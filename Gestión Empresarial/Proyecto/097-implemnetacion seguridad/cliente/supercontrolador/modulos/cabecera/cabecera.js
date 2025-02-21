// Función para mostrar el nombre de usuario guardado en localStorage
function mostrarUsuario() {
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    if (nombreUsuario) {
      const usuarioElement = document.getElementById('nombre-usuario');
      if (usuarioElement) {
        usuarioElement.textContent = nombreUsuario;
      }
    }
  }
  
  // Función para cerrar sesión
  function logout() {
    document.querySelector("#logout").onclick = function() {
      localStorage.removeItem('nombre_usuario');
      localStorage.removeItem('crismon1_usuario');
      window.location = "../index.html"; 
    }
  }
  
  // Función para abrir el correo electrónico en un iframe
  function abrirCorreo() {
    document.querySelector("#correo").onclick = function() {
      const section = document.querySelector("section");
      section.innerHTML = "";
      section.style.display = "block";
      let marco = document.createElement("iframe");
      marco.setAttribute("src", "http://localhost:5000/");
      marco.setAttribute("id", "correo-iframe");
      section.appendChild(marco);
    }
  }
  
  // Función para imprimir la sección (si existe un iframe se intenta imprimir su contenido)
  function imprimir() {
    document.querySelector("#imprimir").onclick = function() {
      var iframe = document.querySelector("section iframe");
      if (iframe) {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (error) {
          window.print();
        }
      } else {
        window.print();
      }
    };
  }
  