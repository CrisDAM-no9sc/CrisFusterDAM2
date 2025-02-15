// Función para inicializar la ventana modal (abrir, cerrar y evitar cierre al hacer clic en el contenido)
function inicializarModal() {
    document.querySelector("#insertar").onclick = function() {
        const modal = document.querySelector("#modal");
        modal.style.display = "block";
        modal.classList.remove("desaparece");
        modal.classList.add("aparece");
    };

    document.querySelector("#modal").onclick = function() {
        const modal = document.querySelector("#modal");
        modal.classList.remove("aparece");
        modal.classList.add("desaparece");
        setTimeout(function() {
            modal.style.display = "none";
        }, 1000);
    };

    document.querySelector("#contienemodal").onclick = function(event) {
        event.stopPropagation();
    };
}