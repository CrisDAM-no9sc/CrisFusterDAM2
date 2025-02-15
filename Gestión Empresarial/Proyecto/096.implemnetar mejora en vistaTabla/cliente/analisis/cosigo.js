

/////////////////////// FUNCIONES PARA LISTAR LAS TABLAS  /////////////////////////////

/*Obtiene la lista de tablas desde el servidor*/
function obtenerTablas() {
    fetch("../../servidor/?o=listatablas")
      .then(response => response.json())
      .then(data => {
        console.log("Tablas recibidas:", data);
        renderizarOpcionesTablas(data);
      })
      .catch(error => console.error("Error al obtener las tablas:", error));
  }
  
  /**
   * Rellena el elemento select con las opciones de tablas.
   * @param {Array} tablas - Array con la información de las tablas.
   */
  function renderizarOpcionesTablas(tablas) {
    const selectTablas = document.querySelector("#tablas");
    // Reiniciamos el select con la opción por defecto.
    selectTablas.innerHTML = '<option value="">Selecciona una tabla</option>';
    tablas.forEach(tablaObj => {
      const nombreTabla = tablaObj.Tables_in_crismon1;
      const opcion = document.createElement("option");
      opcion.value = nombreTabla;
      opcion.textContent = nombreTabla;
      selectTablas.appendChild(opcion);
    });
  }
  
 
  ////////////////////////// FUNCIONES PARA OBTENER Y MOSTRAR LAS COLUMNAS DE LA TABLA /////////////////////////////
  
  /**
   * Obtiene las columnas de la tabla seleccionada.
   * @param {string} nombreTabla - Nombre de la tabla.
   */
  function obtenerColumnas(nombreTabla) {
    fetch(`../../servidor/?o=columnastabla&tabla=${nombreTabla}`)
      .then(response => response.json())
      .then(data => {
        renderizarColumnas(data);
      })
      .catch(error =>
        console.error("Error al obtener las columnas de la tabla:", error)
      );
  }
  
  /**
   * Muestra los checkboxes correspondientes a cada columna.
   * @param {Array} columnas - Array con las columnas.
   */
  function renderizarColumnas(columnas) {
    const contenedor = document.querySelector("#campotabla");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar
    columnas.forEach(columna => {
      const etiqueta = document.createElement("label");
      etiqueta.textContent = columna.Field;
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = columna.Field;
      checkbox.name = "campos";
      checkbox.id = `checkbox-${columna.Field}`;
      
      etiqueta.appendChild(checkbox);
      contenedor.appendChild(etiqueta);
    });
  }
  

  /////////////// FUNCIONES PARA REALIZAR LA BÚSQUEDA Y MOSTRAR RESULTADOS ////////////////////////////

  /* Realiza la búsqueda de datos en base a la tabla y campos seleccionados */
  function realizarBusqueda() {
    const tablaSeleccionada = document.querySelector("#tablas").value;
    const checkboxesSeleccionados = document.querySelectorAll("#campotabla input:checked");
    const camposSeleccionados = Array.from(checkboxesSeleccionados).map(cb => cb.value);
    
    // Validar que se haya seleccionado al menos un campo
    if (camposSeleccionados.length === 0) {
      alert("Por favor, selecciona al menos un campo para la búsqueda.");
      return;
    }
    
    const datosEnvio = { campos: camposSeleccionados };
    console.log("Datos a enviar:", datosEnvio);
    
    fetch(`../../servidor/?o=buscarseleccion&tabla=${tablaSeleccionada}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosEnvio)
    })
    .then(response => response.json())
    .then(resultados => {
      renderizarResultadosBusqueda(resultados, camposSeleccionados);
    })
    .catch(error => console.error("Error en la búsqueda:", error));
  }
  
  /**
   * Muestra los resultados de la búsqueda en una tabla y añade opciones de descarga.
   * @param {Array} resultados - Array de objetos con los resultados.
   * @param {Array} camposSeleccionados - Campos que se muestran.
   */
  function renderizarResultadosBusqueda(resultados, camposSeleccionados) {
    const contenedorResultados = document.querySelector(".resultados");
    contenedorResultados.innerHTML = "<h2>Resultados de la Búsqueda</h2>";
    
    if (resultados.length > 0) {
      // Crear la tabla de resultados
      const tablaResultados = document.createElement("table");
      tablaResultados.id = "tablaResultados"; // ID para identificar la tabla
      
      // Crear encabezado de la tabla
      const filaEncabezado = document.createElement("tr");
      camposSeleccionados.forEach(campo => {
        const th = document.createElement("th");
        th.textContent = campo;
        filaEncabezado.appendChild(th);
      });
      tablaResultados.appendChild(filaEncabezado);
      
      // Crear filas con los datos
      resultados.forEach(fila => {
        const tr = document.createElement("tr");
        camposSeleccionados.forEach(campo => {
          const td = document.createElement("td");
          td.textContent = fila[campo];
          tr.appendChild(td);
        });
        tablaResultados.appendChild(tr);
      });
      
      contenedorResultados.appendChild(tablaResultados);
      
      // Crear opciones de descarga (CSV y PDF)
      crearOpcionesDescarga();
      
    } else {
      contenedorResultados.innerHTML += "<p>No se encontraron resultados.</p>";
      // Limpiar contenedor de descargas si no hay resultados
      document.querySelector("#descargas").innerHTML = "";
    }
  }
  

  ////////////////// FUNCIONES PARA DESCARGAR RESULTADOS (CSV Y PDF) //////////////////////////////
  
  /*Descarga los resultados mostrados en la tabla en formato CSV */
  function descargarCSV() {
    const tabla = document.querySelector("#tablaResultados");
    if (!tabla) {
      alert("No hay resultados para descargar.");
      return;
    }
    
    let csv = [];
    const filas = tabla.querySelectorAll("tr");
    
    filas.forEach(fila => {
      const columnas = fila.querySelectorAll("th, td");
      let filaDatos = [];
      columnas.forEach(columna => {
        let texto = columna.innerText;
        texto = texto.replace(/"/g, '""'); // Escapar comillas dobles
        filaDatos.push(`"${texto}"`);
      });
      csv.push(filaDatos.join(","));
    });
    
    const contenidoCSV = csv.join("\n");
    const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.setAttribute("href", url);
    enlace.setAttribute("download", "resultados.csv");
    enlace.style.display = "none";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  }
  
  /**
   * Descarga los resultados mostrados en la tabla en formato PDF.
   * Requiere que jsPDF y autoTable estén incluidos en tu proyecto.
   */
  function descargarPDF() {
    const tabla = document.querySelector("#tablaResultados");
    if (!tabla) {
      alert("No hay resultados para descargar.");
      return;
    }
    
    const doc = new jsPDF();
    // Usamos autoTable para convertir la tabla a PDF
    doc.autoTable({ html: "#tablaResultados" });
    doc.save("resultados.pdf");
  }
  
  /**
   * Crea los botones de descarga (CSV y PDF) y los agrega al contenedor de descargas.
   */
  function crearOpcionesDescarga() {
    const contenedorDescargas = document.querySelector("#descargas");
    contenedorDescargas.innerHTML = ""; // Limpiar el contenedor
    
    // Botón para descargar CSV
    const botonCSV = document.createElement("button");
    botonCSV.textContent = "Descargar CSV";
    botonCSV.classList.add("boton-descarga");
    botonCSV.addEventListener("click", descargarCSV);
    
    // Botón para descargar PDF
    const botonPDF = document.createElement("button");
    botonPDF.textContent = "Descargar PDF";
    botonPDF.classList.add("boton-descarga");
    botonPDF.addEventListener("click", descargarPDF);
    
    contenedorDescargas.appendChild(botonCSV);
    contenedorDescargas.appendChild(botonPDF);
  }
  

  /////////////////////// INICIALIZACIÓN Y ASIGNACIÓN DE EVENTOS  ////////////////////////////
  
  document.addEventListener("DOMContentLoaded", function() {
    // Cargar las tablas al iniciar la página
    obtenerTablas();
    
    // Cuando se cambia la tabla seleccionada, cargar sus columnas
    document.querySelector("#tablas").addEventListener("change", function() {
      const nombreTabla = this.value;
      if (nombreTabla) {
        obtenerColumnas(nombreTabla);
      } else {
        document.querySelector("#campotabla").innerHTML = "";
      }
    });
    
    // Asignar el evento al botón de búsqueda
    document.querySelector("#buscarBtn").addEventListener("click", realizarBusqueda);
  });
  