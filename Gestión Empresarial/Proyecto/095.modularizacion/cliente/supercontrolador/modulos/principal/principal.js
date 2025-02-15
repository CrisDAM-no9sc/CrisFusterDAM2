// Función para listar las tablas según la aplicación seleccionada
function listadoTablas(aplicacion) {
    fetch("../../servidor/?o=listatablasaplicacion&aplicacion=" + aplicacion)
      .then(response => response.json())
      .then(datos => {
        console.log(datos);
        // Se asume que la función crearMenuTablas está definida en otro módulo o archivo
        crearMenuTablas(datos, "tabla");
      })
      .catch(error => console.error("Error al cargar tablas:", error));
  }
  
  // Función para listar las colecciones de MongoDB
  function listadoDocumentos() {
    fetch("../../servidor/?o=listacolecciones")
      .then(response => response.json())
      .then(datos => {
        console.log("Vamos con las colecciones");
        console.log(datos);
        crearMenuTablas(datos, "coleccion");
      })
      .catch(error => console.error("Error al cargar colecciones:", error));
  }
  
  // Función para cargar la gráfica
  function cargaGraficas() {
    fetch("../../servidor/?o=datosgrafica")
      .then(result => result.json())
      .then(datos => {
        let graficoPastel = new GeneradorGrafica(datos, "#20B2AA", "table tbody", "AQUI VA EL TITULO DE LA GRÁFICA");
        graficoPastel.creargrafica();
      })
      .catch(error => console.error("Error al cargar gráfica:", error));
  }
  
  // Función para cargar las aplicaciones desde el JSON
  function cargoAplicaciones() {
    fetch("apps/apps.json")
      .then(response => response.json())
      .then(datos => {
        console.log(datos);
        aplicaciones = datos;
      })
      .catch(error => console.error("Error al cargar aplicaciones:", error));
  }
  