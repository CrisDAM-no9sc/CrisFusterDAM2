/**
 * # Comportamiento de la Aplicación
 *
 * ## Descripción:
 * Script encargado de la inicialización de la aplicación y el manejo de eventos principales.
 *
 * ## Funciones principales:
 * - `mostrarUsuario()`: Muestra el usuario autenticado.
 * - `logout()`: Maneja la acción de cierre de sesión.
 * - `abrirCorreo()`: Permite abrir el correo corporativo.
 * - `imprimir()`: Habilita la función de impresión de contenido.
 * - `listadoTablas(aplicacion)`: Carga las tablas asociadas a la aplicación seleccionada.
 * - `listadoDocumentos()`: Muestra la lista de documentos disponibles.
 * - `cargaGraficas()`: Carga y renderiza las gráficas de datos.
 * - `cargoAplicaciones()`: Carga la lista de aplicaciones disponibles.
 */

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