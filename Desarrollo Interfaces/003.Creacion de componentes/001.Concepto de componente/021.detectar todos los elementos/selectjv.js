window.onload = function() {
    let contenedores = [];
    let selectores = document.querySelectorAll(".selectjv"); // Selecciona todos los selectores con la clase 'selectjv'
  
    selectores.forEach(function(selector) {
      // Crea un nuevo div contenedor y agrega la clase "selectjv"
      let contenedor = document.createElement("div");
      contenedor.classList.add("selectjv");
      contenedores.push(contenedor); // Agrega el contenedor al array
      document.body.appendChild(contenedor); // Agrega el contenedor al body
  
      // Elimina el select original del DOM
      selector.remove();
  
      // Crea un div "caja" que mostrará el valor inicial del select
      let caja = document.createElement("div");
      caja.classList.add("caja");
      caja.textContent = selector.querySelector("option:first-child").value;
      contenedor.appendChild(caja); // Añade la caja al contenedor
  
      // Evento para desplegar las opciones del select al hacer clic en la caja
      caja.onclick = function(e) {
        e.stopPropagation();
        caja.classList.add("radio2"); // Cambia el estilo de la caja
  
        // Crea un div de resultados
        let resultados = document.createElement("div");
        resultados.classList.add("resultados");
        contenedor.appendChild(resultados); // Añade los resultados al contenedor
  
        // Crea un campo de búsqueda dentro del div de resultados
        let buscador = document.createElement("input");
        buscador.setAttribute("type", "search");
        buscador.setAttribute("placeholder", "busca...");
        resultados.appendChild(buscador); // Añade el buscador al div de resultados
  
        // Crea un contenedor para los resultados filtrados del select
        let contieneresultados = document.createElement("div");
        resultados.appendChild(contieneresultados); // Añade el contenedor de resultados
  
        // Obtiene todas las opciones del select original
        let opciones = selector.querySelectorAll("option");
  
        // Agrega todas las opciones al contenedor de resultados inicialmente
        opciones.forEach(function(opcion) {
          let texto = document.createElement("p");
          texto.textContent = opcion.value;
          contieneresultados.appendChild(texto); // Añade cada opción al contenedor de resultados
          texto.onclick = function() {
            console.log("Has hecho clic en una opción:", texto.textContent);
            caja.textContent = texto.textContent; // Actualiza la caja con la opción seleccionada
            resultados.remove(); // Cierra el menú de resultados
            caja.classList.remove("radio2"); // Quita la clase para estilizar como cerrado
          };
        });
  
        // Evento de búsqueda para filtrar las opciones cuando se escribe en el buscador
        buscador.onkeyup = function() {
          let busca = this.value.toLowerCase(); // Convierte el texto de búsqueda a minúsculas para mejorar la precisión
          contieneresultados.innerHTML = ""; // Limpia el contenido previo de resultados
  
          opciones.forEach(function(opcion) {
            // Filtra las opciones que coincidan con el texto de búsqueda
            if (opcion.value.toLowerCase().includes(busca)) {
              let texto = document.createElement("p");
              texto.textContent = opcion.value;
              contieneresultados.appendChild(texto); // Agrega la opción filtrada
              texto.onclick = function() {
                console.log("Has hecho clic en una opción:", texto.textContent);
                caja.textContent = texto.textContent; // Actualiza la caja con la opción seleccionada
                resultados.remove(); // Cierra el menú de resultados
                caja.classList.remove("radio2"); // Quita la clase para estilizar como cerrado
              };
            }
          });
        };
      };
    });
  
    // Evento para cerrar el menú de resultados al hacer clic fuera de los contenedores
    document.onclick = function() {
      contenedores.forEach(function(contenedor) {
        try {
          let resultados = contenedor.querySelector(".resultados");
          if (resultados) resultados.remove(); // Elimina el div de resultados si existe
          let caja = contenedor.querySelector(".caja");
          if (caja) caja.classList.remove("radio2"); // Quita la clase 'radio2' de la caja
        } catch (error) {
          console.log("Error, pero no pasa nada"); // Ignora errores si ya se ha cerrado
        }
      });
    };
  };
  