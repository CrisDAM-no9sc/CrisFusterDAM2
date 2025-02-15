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
window.onload = function() {
    inicializarEncabezado();                    // Encabezado: nombre de usuario, logout, correo
    cargarListadoTablas();                      // Listado de tablas
    integrarGrafica();                          // Integración de la gráfica
    cargarListadoColecciones();                 // Listado de colecciones MongoDB
    inicializarModal();                         // Ventana modal
    cargarAplicaciones();                       // Cargar aplicaciones desde JSON
    inicializarContenedorConsulta();            // Evento para cargar el análisis
};
