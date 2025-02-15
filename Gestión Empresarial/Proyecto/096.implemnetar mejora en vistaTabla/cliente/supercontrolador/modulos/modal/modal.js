// --- Ventana modal para INSERTAR REGISTROS ---
document.querySelector("#insertar").onclick = function() {
    document.querySelector("#modal").style.display = "block";
    document.querySelector("#modal").classList.remove("desaparece");
    document.querySelector("#modal").classList.add("aparece");
  };
  
  document.querySelector("#modal").onclick = function() {
    document.querySelector("#modal").classList.remove("aparece");
    document.querySelector("#modal").classList.add("desaparece");
    setTimeout(function() {
      document.querySelector("#modal").style.display = "none";
    }, 1000);
  };
  
  document.querySelector("#contienemodal").onclick = function(event) {
    event.stopPropagation();
  };
  
  // --- Ventana modal para AYUDA ---
  let ayudaBtn = document.querySelector("#ayuda");
  let modalAyuda = document.querySelector("#modal-ayuda");
  let iframeAyuda = document.querySelector("#iframe-ayuda");
  let cerrarAyuda = document.querySelector("#cerrar-ayuda");
  
  ayudaBtn.onclick = function() {
    modalAyuda.style.display = "block";
    iframeAyuda.setAttribute("src", "ayuda/");
  };
  
  cerrarAyuda.onclick = function() {
    modalAyuda.style.display = "none";
    iframeAyuda.setAttribute("src", "");
  };
  
  window.onclick = function(event) {
    if (event.target === modalAyuda) {
      modalAyuda.style.display = "none";
      iframeAyuda.setAttribute("src", "");
    }
  };
  