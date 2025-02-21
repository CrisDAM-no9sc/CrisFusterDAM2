//////////////////////////// Variables Globales /////////////////////////////////

const loginSection    = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const mainSection     = document.getElementById('main-section');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink    = document.getElementById('show-login');

const logoutBtn   = document.getElementById('logout-btn');
const loginForm   = document.getElementById('login-form');
const registerForm= document.getElementById('register-form');

// Elementos de autocompletado
const textarea      = document.getElementById("entrada");
const sugerenciasDiv= document.getElementById("sugerencias");
const nValueSlider  = document.getElementById("nValue");
const nDisplay      = document.getElementById("nDisplay");


///////////////////////////// Funciones de UI ////////////////////////////////////////

function showLogin() {
  loginSection.style.display    = 'block';
  registerSection.style.display = 'none';
  mainSection.style.display     = 'none';
}

function showRegister() {
  registerSection.style.display = 'block';
  loginSection.style.display    = 'none';
  mainSection.style.display     = 'none';
}

function onLoginSuccess() {
  loginSection.style.display    = 'none';
  registerSection.style.display = 'none';
  mainSection.style.display     = 'block';
}

///////////////////////////////////Eventos de Login/Registro //////////////////////////

showRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  showRegister();
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  showLogin();
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  fetch('/login', {
    method: 'POST',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if(data.status === 'success') {
      onLoginSuccess();
    } else {
      alert('Login fallido: ' + (data.message || ''));
    }
  })
  .catch(err => console.error('Error en login:', err));
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  fetch('/register', {
    method: 'POST',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if(data.status === 'success') {
      onLoginSuccess();
    } else {
      alert('Registro fallido: ' + (data.message || ''));
    }
  })
  .catch(err => console.error('Error en registro:', err));
});

// Verificar login al cargar la página
window.addEventListener('load', () => {
  fetch('/is_logged_in')
    .then(response => response.json())
    .then(data => {
      data.logged_in ? onLoginSuccess() : showLogin();
    })
    .catch(err => console.error('Error verificando el login:', err));
});

logoutBtn.addEventListener('click', () => {
  fetch('/logout')
    .then(() => {
      mainSection.style.display = 'none';
      showLogin();
    })
    .catch(err => console.error('Error en logout:', err));
});


//////////////////////////////// Funciones del Slider ///////////////////////////////////////
nValueSlider.addEventListener("input", () => {
  nDisplay.textContent = nValueSlider.value;
});

nValueSlider.addEventListener("change", () => {
  const newN = nValueSlider.value;
  fetch('/train', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ n: newN })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error al reentrenar el modelo:', err));
});


////////////////////// Funciones de Autocompletado /////////////////////////////
// Posicionar sugerencias justo debajo del textarea
function posicionaSugerencias() {
  // Rectángulo del textarea
  const inputRect = textarea.getBoundingClientRect();
  // Rectángulo del contenedor principal (main-section)
  const containerRect = mainSection.getBoundingClientRect();
  
  // Calcula la posición relativa
  const offsetTop  = inputRect.bottom - containerRect.top;
  const offsetLeft = inputRect.left   - containerRect.left;
  
  // Ajusta la posición de sugerenciasDiv
  sugerenciasDiv.style.top  = offsetTop + "px";
  sugerenciasDiv.style.left = offsetLeft + "px";
}

// Función para buscar sugerencias según el contexto
function buscaSugerencias() {
  const contenido = textarea.value;
  const palabras   = contenido.trim().split(" ");
  const contexto   = palabras.slice(-2).join(" ");

  if (contexto.trim() === "") {
    sugerenciasDiv.style.display = "none";
    return;
  }

  fetch(`/predict?contexto=${encodeURIComponent(contexto)}`)
    .then(response => response.json())
    .then(datos => {
      sugerenciasDiv.innerHTML = "";
      if (datos.length > 0) {
        datos.forEach(dato => {
          const p = document.createElement("p");
          p.textContent = dato;
          p.onclick = () => {
            textarea.value += " " + dato + " ";
            // Mantener el foco en el textarea
            textarea.focus();
            // Mover el cursor al final del texto
            const end = textarea.value.length;
            textarea.setSelectionRange(end, end);
            
            enviarFeedback(contexto, dato);
            sugerenciasDiv.style.display = "none";
          };
          sugerenciasDiv.appendChild(p);
        });
        posicionaSugerencias();
        sugerenciasDiv.style.display = "block";
      } else {
        sugerenciasDiv.style.display = "none";
      }
    })
    .catch(err => {
      console.error(err);
      sugerenciasDiv.style.display = "none";
    });
}

// Función debounce para optimizar las búsquedas
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const buscaSugerenciasDebounced = debounce(buscaSugerencias, 300);

// Asignar evento de input con debounce
textarea.addEventListener("input", buscaSugerenciasDebounced);
window.addEventListener("resize", posicionaSugerencias);

// Función para enviar feedback al backend
function enviarFeedback(contexto, accepted) {
  fetch('/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contexto: contexto, accepted: accepted })
  })
  .then(response => response.json())
  .then(data => console.log('Feedback:', data))
  .catch(err => console.error('Error enviando feedback:', err));
}
