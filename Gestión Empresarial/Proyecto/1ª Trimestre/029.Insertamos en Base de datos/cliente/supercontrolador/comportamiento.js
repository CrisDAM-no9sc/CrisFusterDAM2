/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = []                                             // Creo una variable global para almacenar las columnas

/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

window.onload = function(){
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    fetch("../../servidor/listas_tablas.php")
    //se utiliza para manejar la respuesta de fetch y response contiene la información devuelta por el servidor                
    .then(response => {
        //convertimos la respuesta en json
        return response.json();                           
    })
    //aquí manejamos los datos devueltos del json, datos contiene la lista de tablas que le hemos solicitado
    .then(datos => {
        // en el menu es donde se agregarán las tablas 
        let menu = document.querySelector("nav ul");  
        //iteramos sobre los elementos array de datos y la función se ejecuta para cada tabla del array   
        datos.forEach(function(tabla) {  
            //cojemos el nombre de la tabla que viene de la consola                  
            let nombre_tabla = tabla['Tables_in_crismon1']; 
            //creamos un nuevo elemento li en memoria
            let elemento = document.createElement("li");
            //al li le ponemos el nombre de la tabla 
            elemento.textContent = nombre_tabla; 
            //cuando hagamos clic en el li se ejecutará        
            elemento.onclick = function() {  
                //hace referencia al nombre de la tabla clicada             
                let texto = this.textContent;   
                //la función se encargará de pasar los datos de la tabla         
                cargaDatosTabla(texto);                 
            }
            //aquí lo que hacemos es que la tabla salga en el menú
            menu.appendChild(elemento);                 
        });
    });
    
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
     
    cargaDatosTabla("clientes")                                 // Cuando arranca el programa, le pongo una tabla por defecto
    
    /////////////////////////////////// CLICK VENTANA MODAL PARA INSERTAR /////////////////////////////////////////////
    
    document.querySelector("#insertar").onclick = function(){
        document.querySelector("#modal").style.display = "flex"
    }
    document.querySelector("#modal").onclick = function(){
        document.querySelector("#modal").style.display = "none"
    }
    document.querySelector("#contienemodal").onclick = function(event){
        event.stopPropagation()
    }
}

/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla){
   let campoclave;                                                          // Creo  una variable que va a almacenar el nombre del campo que es clave primaria
   /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
    
   fetch("../../servidor/columnas_tabla.php?tabla=" + tabla)
        .then(response => response.json())
        .then(datos => {
            columnas_tabla = [];
            //seleccionamos donde vamos a poner la cabecera de la tabla
            let cabeceras_tabla = document.querySelector("table thead tr");
                if (cabeceras_tabla) {
                    cabeceras_tabla.innerHTML = "";
                    datos.forEach(function(dato) {
                        let elemento = document.createElement("th");
                        columnas_tabla.push(dato['Field']);
                        elemento.textContent = dato['Field'];
                        cabeceras_tabla.appendChild(elemento);
                        if (dato['Key'] == "PRI") {
                            campoclave = dato['Field'];
                        }
                    });

                    let elementoExtra = document.createElement("th");
                    cabeceras_tabla.appendChild(elementoExtra);
                }

            // Modal
            let contenido_modal = document.querySelector("#contienemodal");
            if (contenido_modal) {
                contenido_modal.innerHTML = ""; // Limpiar antes de agregar nuevos
                let encabezado = document.createElement("h1");
                encabezado.textContent = "Formulario de Inserción";
                contenido_modal.appendChild(encabezado);
                
                columnas_tabla.forEach(function(columna) {
                    let inputContainer = document.createElement("div");
                    inputContainer.classList.add("input-container");

                    let texto = document.createElement("p");
                    texto.textContent = "Inserta un nuevo " + columna + ":";
                    inputContainer.appendChild(texto);

                    let campo = document.createElement("input");
                    campo.setAttribute("placeholder", columna);
                    inputContainer.appendChild(campo);
                    contenido_modal.appendChild(inputContainer);
                });

                let boton_enviar = document.createElement("button");
                boton_enviar.textContent = "ENVIAR";
                boton_enviar.onclick = function() {
                    console.log("Vamos a insertar la información");
                };

                contenido_modal.appendChild(boton_enviar);
            }

                
 
    ///////////////////////////////////////// DATOS DE LA TABLA /////////////////////////////////////////////
        fetch("../../servidor/datos_tabla.php?tabla=" + tabla)     
            .then(response => {
                return response.json();                             
            })
            .then(datos => {
                //SELECCIONAMOS DONDE SE VAN A ENSEÑAR LOS REGISTROS
                let contenidotabla = document.querySelector("section table tbody"); 
                //limpiar cualquier contenido anterior
                contenidotabla.innerHTML = "";  
                
                //itera sobre cada registro de la tabla                 
                datos.forEach(function(registro) { 
                    let clave_primaria;   
                    //crea una nueva fila para el cuerpo de la tabla                
                    let nuevafila = document.createElement("tr");  
                    //obtenemos todas las claves (nombre de columnas)  
                    Object.keys(registro).forEach(clave => {
                        //si el campo que estamos viendo es la calve primaria 
                        if (clave == campoclave) {
                            //en ese caso guarda el nuemro de la clave primaria como identificador
                            clave_primaria = registro[clave];
                        }
                        //crea una nueva celda      
                        let nuevacolumna = document.createElement("td"); 
                        //asigna del contenido de cada celda basado en el valor por cada registro
                        nuevacolumna.textContent = registro[clave]; 
                        //añade la celda a la fila  
                        nuevafila.appendChild(nuevacolumna);         
                    });
                    //PARA CREAR UN NUEVA FILA CON EMOJI PAPELERA
                    //creamos una nueva columna
                    let nuevacolumna = document.createElement("td");
                    nuevacolumna.textContent = "🗑️";
                    //le ponemos un atributo que se llama clave primaria  y le ponemos el valor correspondiente
                    nuevacolumna.setAttribute("claveprimaria", clave_primaria);
                    //lo colocamos en las columnas 
                    nuevafila.appendChild(nuevacolumna);
                    //y al hacer click , eliminaremos algo 
                    nuevacolumna.onclick = function() {
                        console.log("vamos a eliminar");
                        let identificador = this.getAttribute("claveprimaria");
                        fetch("../../servidor/eliminar.php?tabla=" + tabla+"&id=" +identificador); 
                        this.parentElement.remove();
                    }
                    //muestra todos los registros añadiendo la fila de la tabla 
                    contenidotabla.appendChild(nuevafila);           
                });
            });
        


     });
    
 }