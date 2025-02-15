/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////
var columnas_tabla = [];
var aplicaciones;


// Función para cargar las aplicaciones desde el archivo JSON
function cargarAplicaciones() {
    fetch("apps/apps.json")
        .then(response => response.json())
        .then(datos => {
            console.log(datos);
            aplicaciones = datos;
        });
}



//////////////////////////// LLAMAMOS A TODAS LAS FUNCIONES //////////////////////////////
/*
window.onload = function() {
    inicializarEncabezado();                    // Encabezado: nombre de usuario, logout, correo
    cargarListadoTablas();                      // Listado de tablas
    integrarGrafica();                          // Integración de la gráfica
    cargarListadoColecciones();                 // Listado de colecciones MongoDB
    inicializarModal();                         // Ventana modal
    cargarAplicaciones();                       // Cargar aplicaciones desde JSON
    inicializarContenedorConsulta();            // Evento para cargar el análisis
    cargarDatosColeccion("usuarios", "json");
};
*/
document.addEventListener("DOMContentLoaded", function () {
    inicializarEncabezado();                    // Encabezado: nombre de usuario, logout, correo
    cargarListadoTablas();                      // Listado de tablas
    cargarListadoColecciones();                 // Listado de colecciones MongoDB
    inicializarModal();                         // Ventana modal
    cargarAplicaciones();                       // Cargar aplicaciones desde JSON
    inicializarContenedorConsulta();            // Evento para cargar el análisis
    setTimeout(() => {
        integrarGrafica();                      // Integración de la gráfica (esperar carga del DOM)
        cargarDatosColeccion("usuarios", "json"); // Cargar datos de MongoDB
    }, 500); // 🔥 Retraso de 500ms para evitar conflictos
});
