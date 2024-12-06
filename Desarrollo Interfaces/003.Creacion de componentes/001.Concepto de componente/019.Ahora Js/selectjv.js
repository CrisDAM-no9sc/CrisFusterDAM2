window.onload = function() {
    // Array para almacenar los divs que reemplazarán a cada select
    let contenedores = []; 
  
    // Selecciona todos los elementos <select> en el documento
    let selectores = document.querySelectorAll(".selectjv");
  
    // Itera sobre cada select para personalizarlo
    selectores.forEach(function(selector) {
      // Crea un nuevo div y lo almacena en el array 'contenedores'
      contenedores.push(document.createElement("div"));
  
      // Aplica la clase 'selectjv' al nuevo div para darle estilo
      contenedores[contenedores.length - 1].classList.add("selectjv");
  
      // Agrega el nuevo div al body del documento
      document.querySelector("body").appendChild(contenedores[contenedores.length - 1]);
  
      // Elimina el select original del DOM
      selector.remove();
  
      // Crea un div que actuará como la caja visible del select personalizado
      let caja = document.createElement("div");
      caja.classList.add("caja");
  
      // Muestra el texto del primer <option> en el div 'caja' para simular el valor inicial del select
      caja.textContent = selector.querySelector("option:first-child").value;
  
      // Agrega 'caja' al div contenedor del select personalizado
      contenedores[contenedores.length - 1].appendChild(caja);
  
      // para desplegar las opciones del select
      caja.onclick = function(e) {
        //evita que se propage fuera del contenedor
        e.stopPropagation(); 
        // Aplica la clase 'radio2' para cambiar el estilo al hacer clic
        caja.classList.add("radio2"); 
  
        // Crea un div para contener las opciones del select (resultados)
        let resultados = document.createElement("div");
        resultados.classList.add("resultados");
  
        // Agrega el div de resultados al contenedor
        contenedores[contenedores.length - 1].appendChild(resultados);
  
        // Crea un campo de búsqueda dentro del div de resultados
        let buscador = document.createElement("input");
        buscador.setAttribute("type", "search");
        buscador.setAttribute("placeholder", "busca...");
        resultados.appendChild(buscador);
  
        // Evento para filtrar las opciones cuando se escribe en el buscador
        buscador.onkeyup = function() {
          let busca = this.value; // Guarda el valor actual del buscador
          contieneresultados.innerHTML = ""; // Limpia el contenido de los resultados previos
  
          // Filtra y muestra solo las opciones que coinciden con el texto buscado
          opciones.forEach(function(opcion) {
            if (opcion.value.includes(busca)) {
              let texto = document.createElement("p"); // Crea un <p> para cada opción filtrada
              texto.textContent = opcion.value;
              contieneresultados.appendChild(texto); // Agrega la opción filtrada al contenedor de resultados
            }
          });
        };
  
        // Crea un contenedor para los resultados filtrados del select
        let contieneresultados = document.createElement("div");
  
        // Obtiene todas las opciones del select original
        let opciones = selector.querySelectorAll("option");
  
        // Agrega cada opción del select original al contenedor de resultados
        opciones.forEach(function(opcion) {
          let texto = document.createElement("p"); // Crea un <p> para cada opción
          texto.textContent = opcion.value;
          contieneresultados.appendChild(texto); // Agrega cada opción al contenedor de resultados
        });
  
        // Agrega el contenedor de resultados filtrados al div de resultados
        resultados.appendChild(contieneresultados);
      };
    });
  
    // Evento que se ejecuta al hacer clic fuera del select personalizado para cerrarlo
    document.onclick = function() {
      console.log("ok body");
  
      // Para cada contenedor personalizado de select
      contenedores.forEach(function(contenedor) {
        console.log(contenedor);
        try {
          // Intenta remover el div de resultados y quitar la clase 'radio2'
          contenedor.querySelector(".resultados").remove();
          contenedor.classList.remove("radio2");
        } catch (error) {
          console.log("error pero no pasa nada"); // Ignora errores si ya se ha cerrado
        }
      });
    };
  };
  