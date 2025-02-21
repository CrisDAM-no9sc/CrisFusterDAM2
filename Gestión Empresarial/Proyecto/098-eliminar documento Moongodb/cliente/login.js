/**
 * # Sistema de Login Dinámico
 *
 * ## Descripción:
 * Este script maneja el proceso de autenticación del usuario mediante un formulario dinámico.
 *
 * ## Funciones principales:
 * - Carga las traducciones según el idioma del navegador.
 * - Maneja eventos del formulario de login.
 * - Valida la entrada del usuario antes de enviarla al servidor.
 * - Autenticación del usuario con `fetch` enviando JSON.
 * - Muestra mensajes y errores en la interfaz.
 */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Javascript cargado");

  // Seleccionar elementos del DOM
  const titulo = document.querySelector("#titulo");
  const usuarioInput = document.querySelector("#usuario");
  const contrasenaInput = document.querySelector("#contrasena");
  const loginBtn = document.querySelector("#login");
  const comentario = document.querySelector("#comentario");
  const toast = document.querySelector("#toast");

  if (!usuarioInput || !contrasenaInput || !loginBtn) {
    console.error("Error: No se encontraron los elementos del formulario.");
    return;
  }

  await cargarTraducciones();

  loginBtn.addEventListener("click", login);

  /**
   * Carga las traducciones según el idioma del navegador.
   */
  async function cargarTraducciones() {
    const idioma = navigator.language.split('-')[0];
    const url = `traductor/${idioma}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Archivo de traducción no encontrado");

      const datos = await response.json();
      console.log("Traducciones cargadas:", datos);

      if (titulo) titulo.textContent = datos.titulo.contenido;
      usuarioInput.placeholder = datos.usuario.contenido;
      contrasenaInput.placeholder = datos.contrasena.contenido;
      loginBtn.textContent = datos.login.contenido;
    } catch (error) {
      console.warn("Error cargando traducciones:", error);

      // Usar valores predeterminados en caso de error
      usuarioInput.placeholder = "Usuario";
      contrasenaInput.placeholder = "Contraseña";
      loginBtn.textContent = "Iniciar sesión";
    }
  }

  /**
   * Maneja el proceso de login.
   */
  async function login() {
    console.log("Has pulsado el botón");

    const usuario = usuarioInput.value.trim();
    const contrasena = contrasenaInput.value.trim();

    if (!usuario || !contrasena) {
      mostrarMensaje("Por favor, completa todos los campos.", "red");
      return;
    }

    const datos = { usuario, contrasena };

    try {
      const response = await fetch("../servidor/?o=buscar&tabla=usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.length > 0) {
        const nombreCompleto = `${data[0].nombre} ${data[0].apellidos}`;

        localStorage.setItem("nombre_usuario", nombreCompleto);
        localStorage.setItem("crismon1_token", data[0].token);
        localStorage.setItem("crismon1_usuario", data[0].usuario);

        mostrarMensaje("Acceso correcto. Redirigiendo en 5 segundos...", "green");

        setTimeout(() => {
          window.location.href = "escritorio/index.html";
        }, 5000);
      } else {
        mostrarMensaje("Usuario incorrecto. Redirigiendo en 5 segundos...", "red");

        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      mostrarToast("Error en acceso. Inténtalo de nuevo más tarde.");
      console.warn("Error:", error);
    }
  }

  /**
   * Muestra un mensaje en la página.
   * @param {string} texto - Texto del mensaje.
   * @param {string} color - Color del texto.
   */
  function mostrarMensaje(texto, color) {
    if (comentario) {
      comentario.style.color = color;
      comentario.textContent = texto;
    }
  }

  /**
   * Muestra un mensaje de error en un toast.
   * @param {string} mensaje - Mensaje a mostrar.
   */
  function mostrarToast(mensaje) {
    if (toast) {
      toast.style.display = "block";
      toast.classList.add("animado");
      toast.textContent = mensaje;
    }
  }
});