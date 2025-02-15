// Función para cargar el listado de tablas según la aplicación
function cargarListadoTablas() {
    let aplicacion = localStorage.getItem("crismon1_aplicacion");
    console.log("La aplicación es:" + aplicacion);
    fetch("../../servidor/?o=listatablasaplicacion&aplicacion=" + aplicacion)
        .then(response => response.json())
        .then(datos => {
            console.log(datos);
            crearMenuTablas(datos, "tabla");
        });
}

// Función para cargar el listado de colecciones de MongoDB
function cargarListadoColecciones() {
    fetch("../../servidor/?o=listacolecciones")
        .then(response => response.json())
        .then(datos => {
            console.log("Vamos con las colecciones");
            console.log(datos);
            crearMenuTablas(datos, "coleccion");
        });
}

// Función para inicializar el evento en el contenedor de consulta (carga el iframe de análisis)
function inicializarContenedorConsulta() {
    document.querySelector("#contenedorconsulta").onclick = function() {
        const seccion = document.querySelector("section");
        seccion.innerHTML = "";
        let iframeAnalisis = document.createElement("iframe");
        iframeAnalisis.setAttribute("src", "../analisis/");
        seccion.appendChild(iframeAnalisis);
    };
}