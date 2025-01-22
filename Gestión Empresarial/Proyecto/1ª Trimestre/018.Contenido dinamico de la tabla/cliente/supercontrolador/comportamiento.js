window.onload = function(){
//////////////////////////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////////////////////
    fetch("../../servidor/listas_tablas.php")               //llamamos al archivo de aplicciones
        .then(response => {
          // Quiero que el servidor me devuelva un json
          return response.json();                       
        })
        .then(datos => {
          //seleccionamos el menu de donde vamos a sacar las tablas de la base de datos 
          let menu = document.querySelector("nav ul");
          //para cada tabla de la base de datos 
            datos.forEach(function(tabla){
              //cojemos el nombre de la tabla que viene de la consola 
              let nombre_tabla = (tabla['Tables_in_crismon1']);
              //creamos un nuevo elemento li en memoria
              let elemento = document.createElement("li");
              //al li le ponemos el nombre de la tabal
              elemento.textContent = nombre_tabla;
              //aqui lo añadimos al menu
              menu.appendChild(elemento);
            });
        })
  ////////////////////////////////////////////////////// LISTADO DE TABLAS ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////// LISTADO DE COLUMNAS DE TABLAS ///////////////////////////////////////////////////////
    fetch("../../servidor/columnas_tabla.php")               
    .then(response => {
      return response.json();                       
    })
    .then(datos => {
      //seleccionamos donde quiero las cabeceras de la tabla 
      let cabeceras_tabla = document.querySelector("table thead tr");
      datos.forEach(function(dato){
        //para cada uno de los datos creamos el elemento th como columna de cabecera de tabla 
        let elemento = document.createElement("th");
        //el texto lo sacamos de la consola de navegardor quee s donde aparece el nombre del campor de la base de datos 
        elemento.textContent = dato['Field'];
        //añadimos ese elemento a las cabeceras de la tabla 
        cabeceras_tabla.appendChild(elemento);
      })
    });
  /////////////////////////////////////////////// LISTADO DE COLUMNAS DE TABLAS ///////////////////////////////////////////////////////

  ///////////////////////////////////////////////// CONTENIDO DE LA TABLA ////////////////////////////////////////////////////////////
    fetch("../../servidor/datos_tabla.php")               
    .then(response => {
      return response.json();                       
    })
    .then(datos => {
      //seleccionamos el constenido vaxio de la tabla 
      let contenidotabla = document.querySelector("section table tbody");  
      //tenemos que hacer un forEach porque los datos son un array para repasarlo   
      datos.forEach(function(registro){  
          //Creamos una nueva fila como elemento vacio                                     
          let nuevafila = document.createElement("tr");
          //como no podemos recorrer las propiedades de un objeto tenemos que usar esta formula                        
          Object.keys(registro).forEach(clave => {  
              // creamos una nueva columna                            
              let nuevacolumna = document.createElement("td");
              //le ponemos el contenido en text.. sacando la informacion con registro[clave]                 
              nuevacolumna.textContent = registro[clave];
              //Introducimos la columna dentro de la fila                      
              nuevafila.appendChild(nuevacolumna);                             
          });
          //y introducimos la columna dentro de la fila
          contenidotabla.appendChild(nuevafila);                               
      })
    });
  ///////////////////////////////////////////////// CONTENIDO DE LA TABLAS ///////////////////////////////////////////////////////////
}