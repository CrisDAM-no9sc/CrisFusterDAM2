/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas = []; // Creo una variable global para almacenar las columnas

/////////////////////////////////// CUANDO CARGUE LA PÁGINA /////////////////////////////////////////////

window.onload = function () {
  /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////

  fetch("../../servidor/listas_tablas.php") // LLamo a un microservicio que me da la lista de tablas
    .then((response) => {
      return response.json(); // Quiero que el servidor me devuelva un json
    })
    .then((datos) => {
      let menu = document.querySelector("nav ul"); // Selecciono el menu donde voy a poner las entradas dinámicas
      datos.forEach(function (tabla) {
        let nombre_tabla = tabla["Tables_in_crismon1"]; // Atrapo el nombre de la tabla que viene del fetch
        let elemento = document.createElement("li"); // Creo en memoria un nuevo elemento li
        elemento.textContent = nombre_tabla; // A ese elemento li le pongo como texto el nombre de la tabla
        elemento.onclick = function () {
          // Cuando hago click en los elementos de la tabla
          let texto = this.textContent; // Atrapo el texto del elemento de navegación
          cargaDatosTabla(texto); // Y lo paso como parámetro a la llamada que carga los datos de la tabla
        };
        menu.appendChild(elemento); // Lo añado al menú
      });
    });

  /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////

  cargaDatosTabla("clientes"); // Cuando arranca el programa, le pongo una tabla por defecto

  /////////////////////////////////// CLICK VENTANA MODAL PARA INSERTAR /////////////////////////////////////////////

  document.querySelector("#insertar").onclick = function () {
    document.querySelector("#modal").style.display = "flex"; // Muestra el modal
  };
  document.querySelector("#modal").onclick = function () {
    document.querySelector("#modal").style.display = "none"; // Oculta el modal cuando se hace clic en cualquier parte fuera del contenido
  };
  document.querySelector("#contenidomodal").onclick = function (event) {
    event.stopPropagation(); // Evita que el clic dentro del contenido cierre el modal
  };
};

/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla) {
  let campoclave; // Creo una variable que va a almacenar el nombre del campo que es clave primaria

  /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////

  fetch("../../servidor/columnas_tabla.php?tabla=" + tabla) // LLamo a un microservicio que me da la lista de tablas y le paso la tabla como parámetro
    .then((response) => {
      return response.json(); // Quiero que el servidor me devuelva un json
    })
    .then((datos) => {
      columnas = []; // Vacía las columnas anteriores para cargar solo las nuevas
      let cabeceras_tabla = document.querySelector("table thead tr"); // Selecciono donde tengo que poner las cabeceras en la tabla
      cabeceras_tabla.innerHTML = ""; // Por si acaso hay columnas previamente cargadas, vacio la cabecera
      datos.forEach(function (dato) {
        let elemento = document.createElement("th"); // Creo un elemento que es una cabecera de tabla
        columnas.push(dato["Field"]); // Al listado de columnas le añades la columna actual
        elemento.textContent = dato["Field"]; // Su texto es el nombre del campo de la base de datos
        cabeceras_tabla.appendChild(elemento); // Añado ese elemento a las cabeceras de la tabla
        if (dato["Key"] == "PRI") {
          // Si este campo es clave primaria
          campoclave = dato["Field"]; // Recordamos cual es el nombre del campo que hace de clave primaria
        }
      });
      let elemento = document.createElement("th");
      cabeceras_tabla.appendChild(elemento); // Agregar un espacio para la columna de eliminar

      /////////////////////////////////// CONTENIDO DE LA VENTANA MODAL /////////////////////////////////////////////

      let coleccioncampos = []; // Reiniciar colección de campos
      let contenido_modal = document.querySelector("#contenidomodal");
      contenido_modal.innerHTML = ""; // Limpiar el contenido anterior
      let encabezado = document.createElement("h1");
      encabezado.textContent = "Formulario de Inserción: " + tabla;
      contenido_modal.appendChild(encabezado);

      columnas.forEach(function (columna) {
        let contenedor = document.createElement("div"); // Crear contenedor para cada campo
        contenedor.classList.add("input-container"); // Añadir clase para los estilos de input
        let texto = document.createElement("p");
        texto.textContent = "Inserta un nuevo " + columna + ":";
        contenedor.appendChild(texto); // Añadir el texto al contenedor

        let campo = document.createElement("input"); // Crear campo de input
        campo.setAttribute("placeholder", columna); // Poner el placeholder con el nombre de la columna
        coleccioncampos.push(campo); // Añadir campo al array de coleccioncampos
        contenedor.appendChild(campo); // Añadir el input al contenedor

        contenido_modal.appendChild(contenedor); // Añadir el contenedor completo al modal
      });

      let boton_enviar = document.createElement("button"); // Crear botón de enviar
      boton_enviar.textContent = "ENVIAR";
      boton_enviar.onclick = function () {
        console.log("Vamos a insertar la información");
        let mensaje = {};
        coleccioncampos.forEach(function (campo) {
          let valorInput = campo.value;
          let nombreCampo = campo.getAttribute("placeholder");
          mensaje[nombreCampo] = valorInput;
        });
        console.log(mensaje); // Mostrar los valores en la consola
      };
      contenido_modal.appendChild(boton_enviar); // Añadir el botón al modal

      /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////

      fetch("../../servidor/datos_tabla.php?tabla=" + tabla) // Llamar al microservicio para obtener los datos de la tabla
        .then((response) => {
          return response.json();
        })
        .then((datos) => {
          let contenidotabla = document.querySelector("section table tbody"); // Selecciono el contenido vacío de la tabla
          contenidotabla.innerHTML = ""; // Vacio la tabla por si había algo

          datos.forEach(function (registro) {
            let clave_primaria;
            let nuevafila = document.createElement("tr"); // Creo una nueva fila
            Object.keys(registro).forEach((clave) => {
              if (clave == campoclave) {
                clave_primaria = registro[clave]; // Guardo la clave primaria
              }
              let nuevacolumna = document.createElement("td"); // Creo una nueva columna
              nuevacolumna.textContent = registro[clave]; // Le pongo el contenido de la columna
              nuevafila.appendChild(nuevacolumna); // Introduzco la columna en la fila
            });

            let nuevacolumna = document.createElement("td"); // Crear columna para el icono de eliminar
            nuevacolumna.textContent = "🗑️"; // Emoji de la papelera
            nuevacolumna.setAttribute("claveprimaria", clave_primaria); // Atributo con la clave primaria
            nuevafila.appendChild(nuevacolumna); // Añadir la columna de eliminar
            nuevacolumna.onclick = function () {
              console.log("Vamos a eliminar");
              let identificador = this.getAttribute("claveprimaria");
              fetch("../../servidor/eliminar.php?tabla=" + tabla + "&id=" + identificador); // Llamada para eliminar el registro
              this.parentElement.remove(); // Eliminar visualmente la fila
            };

            contenidotabla.appendChild(nuevafila); // Introduzco la fila dentro de la tabla
          });
        });
    });
}

/////////////////////////////////// FIN DE LA FUNCIÓN DE CARGA DINÁMICA /////////////////////////////////////////////
