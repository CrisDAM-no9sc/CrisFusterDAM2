//Cuando la pagina carge s eejecutara esta funcion
window.onload = function() {
  /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
  //hacemos una solicitud para coje la lista de las tablas desde el servidor
  fetch("../../servidor/listas_tablas.php")
      //se utiliza para manejar la respuesta de fetch y response continen la informacion devuelta por el servidor                
      .then(response => {
        //convertimos la respuesta en json
          return response.json();                           
      })
      //aqui manejamos los datos devueltos del json, datos contiene la lista de tablas que le hemos solicitado
      .then(datos => {
        // en el menu es donde se agregaran las tablas 
          let menu = document.querySelector("nav ul");  
          //iteramos sobre los elementos array de datos y la funcion se ejecuta para cada tabla del array   
          datos.forEach(function(tabla) {  
              //cojemos el nombre de la tabla que viene de la consola                  
              let nombre_tabla = tabla['Tables_in_crismon1']; 
              //creamos un nuevo elemento li en memoria
              let elemento = document.createElement("li");
              //al li le ponemos el nombre de la tabla 
              elemento.textContent = nombre_tabla; 
              //cuando hagamos click en el li se ejecutara        
              elemento.onclick = function() {  
                  //hace referencia al nombre de la tablas clikada             
                  let texto = this.textContent;   
                  //la funcion se encargara de pasar los datos de la tabla         
                  cargaDatosTabla(texto);                 
              }
              //aqui lo que hacemos es que la tabla salga en el menu
              menu.appendChild(elemento);                 
          });
      });

  /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
  //arrancamos el programa y le ponemos por defecto una tabla 
  cargaDatosTabla("clientes");                             
}

///////////////////////////////////  FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla) {
 
  /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
  //esto nos da la lista de las columnas y le pasamos la tabla
  fetch("../../servidor/columnas_tabla.php?tabla=" + tabla) 
      .then(response => {
        //le pedidmos que nos devuelva el json
          return response.json();                           
      })
      //manejamos los json que representan als columnas de la tabla seleccionada
      .then(datos => {
        //seleccionamos donde vamos a poner la cabecera de la tabla
          let cabeceras_tabla = document.querySelector("table thead tr"); 
          //vaciamos la cabecera para asegurarnos de que no hay datos antiguos 
          cabeceras_tabla.innerHTML = "";  
          //recorremos los datos del hemos recibido del servidor                   
          datos.forEach(function(dato) {  
            //creamos un elemento para la cabecera de la tabla                    
              let elemento = document.createElement("th"); 
              //el texto que contiene es el nombre del campo de la base de datos   
              elemento.textContent = dato['Field'];
              //y añadimos ese elemento a las cabeceras de las tablas          
              cabeceras_tabla.appendChild(elemento);         
          });
      });

  /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
 
  /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////

  fetch("../../servidor/datos_tabla.php?tabla=" + tabla)     
      .then(response => {
          return response.json();                             
      })
      .then(datos => {
          //SELECCIONAMOS DNDE SE VAN A ENSEÑAR LSO REGISTROS
          let contenidotabla = document.querySelector("section table tbody"); 
          //limpiar cualquier contenido anterior
          contenidotabla.innerHTML = "";      
          //itera sobre cada registro de la tabla                 
          datos.forEach(function(registro) {    
              //crea una nueva fila para el cuerpo de la tabla                
              let nuevafila = document.createElement("tr");  
              //obtenemos todas las claves (nombre de columnas)  
              Object.keys(registro).forEach(clave => {   
                  //crea una nueva celda      
                  let nuevacolumna = document.createElement("td"); 
                  //asigna del contenido de cada celda basado en el valor por cada registro
                  nuevacolumna.textContent = registro[clave]; 
                  //añade la celda a la fila  
                  nuevafila.appendChild(nuevacolumna);         
              });
              //muestra todos los registros añadiendo la fila de la tabla 
              contenidotabla.appendChild(nuevafila);           
          });
      });

  /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////
}
