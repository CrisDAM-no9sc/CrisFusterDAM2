function crearMenuTablas(datos,tipoentidad) {

    console.log(datos,)
    // Selecciono el menu donde voy a poner las entradas dinamicas
    let menu = document.querySelector("nav ul")
    // Para cada una de las tablas que han venido de la base de datos             
    datos.forEach(function(tabla){     
        // Atrapo el nombre de la tabla que viene del fetch                     
        let nombre_de_la_tabla = tabla['Tables_in_crismon1'];
        // Creo en memoria un nuevo elemento li    
        let elemento = document.createElement("li")
        
        let icono;
        switch(tipoentidad){
            case "tabla":
                icono = "<span class='boton botontabla'><img src='../img/icnotabla.png'></span>";
                break;
            case "coleccion":
                icono= "<span class='boton botondocumento'><img src='../img/documento.png'></span>";
        }
        elemento.innerHTML = icono+""+nombre_de_la_tabla;
        elemento.setAttribute("destino",nombre_de_la_tabla)
        //le ponemos como texto el nombre d ela tabla          
        ///elemento.textContent = nombre_de_la_tabla 
        elemento.setAttribute("tooltip", "Haz click para cargar la informacion de la tabla"+nombre_de_la_tabla);
        //aqui vamos a crear una etiqueta html para sacar los comentarios de cada tabla 
        elemento.setAttribute("comentario",tabla['Comentario'])
        //cuando apretemos en los nombres de las tablas           
        elemento.onclick = function(){     
            //atrapamos el contenido del elemento                 
            let texto = this.getAttribute("destino")
            switch(tipoentidad){
                case "tabla":
                    cargaDatosTabla(texto);
                    break;
                case "coleccion":
                    cargarDatosColeccion(texto);
                    console.log("ok coleccion");
                    break;
            } 
            // Y lo paso como parametro a la llamada que carga los datos de la tabla                  
            cargaDatosTabla(texto)
            // Aqui vamos a cargar los titulos y comentarios
            document.querySelector(".titulotabla h5").textContent = this.textContent;
            document.querySelector(".titulotabla p").textContent = this.getAttribute("comentario");    
    

            //Primero quitamos todas las clases 
            let elementosmenu = document.querySelectorAll("nav ul li")
            elementosmenu.forEach(function(){
                elemento.classList.remove("menuseleccionado")
            })
            this.classList.add("menuseleccionado")

        }
        
        //lo añadimos al menu
        menu.appendChild(elemento)                          
        
    })
}