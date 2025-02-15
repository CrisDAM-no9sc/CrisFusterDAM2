// Función para integrar la gráfica en el proyecto
function integrarGrafica() {
    fetch("../../servidor/?o=datosgrafica")
        .then(response => response.json())
        .then(datos => {
            let graficoPastel = new GeneradorGrafica(datos, "#20B2AA", "table tbody", "AQUI VA EL TITULO DE LA GRÁFICA");
            graficoPastel.creargrafica();
        });
}

function ocultarGrafica(){
    const canvases = document.querySelectorAll("table tbody canvas");
    if (canvases.length > 0) {
        canvases.forEach(canvas => {
            canvas.remove();
        });
        console.log("Se eliminaron " + canvases.length + " elementos <canvas> de la gráfica.");
    } else {
        console.log("No se encontró ningún elemento <canvas> en 'table tbody'.");
    }
}
