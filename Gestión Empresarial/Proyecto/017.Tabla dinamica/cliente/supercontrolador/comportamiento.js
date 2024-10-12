window.onload = function(){
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
}