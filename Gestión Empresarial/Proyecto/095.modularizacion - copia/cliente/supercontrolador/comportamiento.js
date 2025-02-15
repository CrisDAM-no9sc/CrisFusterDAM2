var columnas_tabla = [];  // Variable global para almacenar columnas
var aplicaciones;

window.onload = function() {
  // Desde el módulo de cabecera
  mostrarUsuario();
  logout();
  abrirCorreo();
  imprimir();
  
  // Obtenemos la aplicación seleccionada
  let aplicacion = localStorage.getItem("crismon1_aplicacion");
  console.log("La aplicación es: " + aplicacion);
  
  // Desde el módulo principal
  listadoTablas(aplicacion);
  listadoDocumentos();
  cargaGraficas();
  cargoAplicaciones();
  

};