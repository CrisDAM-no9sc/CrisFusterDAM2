/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = []                                             

window.onload = function(){
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    fetch("../../servidor/?o=listatablas")                        
        .then(response => {
          return response.json();                                 
        })
        .then(datos => {
            // Selecciono el menu donde voy a poner las entradas dinamicas
            let menu = document.querySelector("nav ul")
            // Para cada una de las tablas que han venido de la base de datos             
            datos.forEach(function(tabla){     
                // Atrapo el nombre de la tabla que viene del fetch                     
                let nombre_de_la_tabla = tabla['Tables_in_crismon1'];
                // Creo en memoria un nuevo elemento li    
                let elemento = document.createElement("li")
                //le ponemos como texto el nombre d ela tabla          
                elemento.textContent = nombre_de_la_tabla 
                //cuando apretemos en los nombres de las tablas           
                elemento.onclick = function(){     
                    //atrapamos el contenido del elemento                 
                    let texto = this.textContent 
                    // Y lo paso como parametro a la llamada que carga los datos de la tabla                  
                    cargaDatosTabla(texto)                          
                }
                //lo añadimos al menu
                menu.appendChild(elemento)                          
                
            })
        })
    // Cuando arranca el programa, le pongo una tabla por defecto 
    cargaDatosTabla("clientes")                                 
    
    /////////////////////////////////// CLICK VENTANA MODAL PARA INSERTAR /////////////////////////////////////////////
    
    document.querySelector("#insertar").onclick = function(){
        document.querySelector("#modal").style.display = "block"
        document.querySelector("#modal").classList.remove("desaparece")
        document.querySelector("#modal").classList.add("aparece")
    }
    document.querySelector("#modal").onclick = function(){
        
        document.querySelector("#modal").classList.remove("aparece")
        document.querySelector("#modal").classList.add("desaparece")
        setTimeout(function(){
            document.querySelector("#modal").style.display = "none"
        },1000)
    }
    document.querySelector("#contienemodal").onclick = function(event){
        event.stopPropagation()
    }
}

/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla){
   // Creo  una variable que va a almacenar el nombre del campo que es clave primaria
   let campoclave;                                                          
   /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
    // LLamo a un microservicio que me da la lista de tablas y le paso la tabla como parametro
    fetch("../../servidor/?o=columnastabla&tabla="+tabla)                 
        .then(response => {
          return response.json();                                           
        })
        .then(datos => {
            // Vacía las columnas anteriores para cargar solo las nuevas
            columnas_tabla = []             
            // Selecciono donde tengo que poner las cabeceras en la tabla                                
            let cabeceras_tabla = document.querySelector("table thead tr"); 
            // Por si acaso hay columnas previamente cargadas, vacio la cabecera
            cabeceras_tabla.innerHTML = ""                   
            // PAra cada uno de los datos               
            datos.forEach(function(dato){      
                // Creo un elemento que es una cabecera de tabla                             
                let elemento = document.createElement("th") 
                // Al listado de columnas le añades la columna actual                
                columnas_tabla.push(dato['Field'])    
                // Su texto es el nombre del campo de la base de datos                      
                elemento.textContent = dato['Field']
                // Añado ese elemento a las cabeceras de la tabla                        
                cabeceras_tabla.appendChild(elemento) 
                // Si este campo es clave primaria                      
                if(dato['Key'] == "PRI"){    
                    // en ese caso, recordamos cual es el nombre del campo que hace de clave primaria                               
                    campoclave = dato['Field']                              
                }
            })
            let elemento = document.createElement("th") 
            cabeceras_tabla.appendChild(elemento) 
            console.log(columnas_tabla);
            
            /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////

            // Creo una colección vacía de campos
            let coleccioncampos = []      
            // Selecciono el contenedor del modal                                                          
            let contiene_modal = document.querySelector("#contienemodal") 
            // Si el modal contenía algo, lo vaćio                          
            contiene_modal.innerHTML = "<h1>Formulario de inserción: "+tabla+"</h1>"  
            let seccion = document.createElement("section")

             //recorre cada columna y ejecuta la funcion para cada una de ellas
            columnas_tabla.forEach(function(columna){    
                //creamos un contenedor de entrada donde se va a agrupar el texto y el campo de entrada                                          
                let contenedor = document.createElement("div")
                //creamos una etiqueta que se usara para describir el campo de entrada
                let texto = document.createElement("p")
                //y aqui es donde le ponemos las columnas de la tabla dinamicamente para mostar lo que hay que escribir en cada campo
                texto.textContent = "Inserta un nuevo elemento para: "+columna+""
                //modo que el mensaje explicativo esté junto al campo de entrada
                contenedor.appendChild(texto)
                // Creo un campo input
                coleccioncampos.push(document.createElement("input"))  
                // accede al último campo de entrada en coleccioncampos y le asigna un placeholder con el nombre de la columna actual.                           
                coleccioncampos[coleccioncampos.length-1].setAttribute("placeholder",columna)  
                //Se añade el campo de entrada (input) al contenedor para que aparezca después de la etiqueta texto                                                                           
                contenedor.appendChild(coleccioncampos[coleccioncampos.length-1]) 
                //finalmente el contenedor que incluye la etiqueta como el campo de entradase añade a seccion                                                  
                seccion.appendChild(contenedor)                                                    
            })

            contiene_modal.appendChild(seccion) 
            // Por último creo un boton
            let boton_enviar = document.createElement("button")  
            // Le pongo texto al boton                                   
            boton_enviar.textContent = "Enviar" 
            // Cuando haga click en el boton                                                    
            boton_enviar.onclick = function(){                                                      
                console.log("Vamos a procesar el formulario")                                       
                console.log(coleccioncampos)
                let mensaje = {}
                //para cada campo agregamos el valor del campo al objeto del mesnaje 
                coleccioncampos.forEach(function(campo){
                    //si el campo no es identificador, lo agregamos al cuepor del mensaje
                    if(campo.getAttribute('placeholder') != "Identificador"){
                        mensaje[campo.getAttribute('placeholder')] = campo.value
                    }
                })
                console.log(mensaje)
                //hacemos una solicitud al servidor para enviar los datos del formulario y realizamos la operaciond e insertar
                fetch("../../servidor/?o=insertar&tabla="+tabla, {
                        method: 'POST', 
                        headers: {
                        'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify(mensaje), 
                    })
                // Manejo de la respuesta:se ejecuta una vez a conestado el servidor 
                .then(function(response){
                    return response.text()
                })
                //Procesamiento de la respuesta 
                .then(function(datos){
                    console.log(datos)
                    //Este paso oculta visualmente el formulario de inserción tras el envío de datos.
                    document.querySelector("#modal").classList.remove("aparece")
                    document.querySelector("#modal").classList.add("desaparece")
                    //para que desaparezca suavemente 
                    setTimeout(function(){
                        document.querySelector("#modal").style.display = "none"
                    },1000)
                })
                
            }
            //añadimos el boton de envio a la ventana modal
            contienemodal.appendChild(boton_enviar)                                                 
            
            /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////

            // LLamo a un microservicio que me da la lista de tablas y le paso la tabla como parametro
            fetch("../../servidor/?o=tabla&tabla="+tabla)  
                //para que el servidor nos devuelva en formato json                          
                .then(response => {
                  return response.json();                                                
                })
                .then(datos => {
                    //seleccionamos el contenido vacio de la tabla 
                    let contenidotabla = document.querySelector("section table tbody") 
                    //vaciamos el contenido de la tabla      
                    contenidotabla.innerHTML = ""                                           
                    
                    datos.forEach(function(registro){                                       
                        let clave_primaria;
                        //creamos una nueva fila como elemento vacio
                        let nuevafila = document.createElement("tr")
                        //recorremos las propiedades del objeto                        
                        Object.keys(registro).forEach(clave => {    
                            //si el campo que estamos recorriendo es una clave primaria                         
                            if(clave == campoclave){  
                                //guarda la calve como identificador del registro                                      
                                clave_primaria = registro[clave]                            
                            }
                            // Creo una nueva columna html
                            let nuevacolumna = document.createElement("td") 
                            // Le pongo el contenido en texto                
                            nuevacolumna.textContent = registro[clave] 
                            // Introduzco la columna dentro de la fila                     
                            nuevafila.appendChild(nuevacolumna)                             
                        })
                        // Creo una nueva columna
                        let nuevacolumna = document.createElement("td")  
                        // Le doy el emoji de la papelera                   
                        nuevacolumna.textContent = "🗑️" 
                        // Ademas le pongo un atributo que se llama claveprimaria y le pongo el valor correspondiente                                    
                        nuevacolumna.setAttribute("claveprimaria",clave_primaria)  
                        // Lo pongo en las columnas         
                        nuevafila.appendChild(nuevacolumna) 
                        // Cuando haga click en la papelera                                
                        nuevacolumna.onclick = function(){   
                            // Vamos a eliminar algo                               
                            console.log("Vamos a eliminar algo")      
                            //cojemos el identificador                      
                            let identificador = this.getAttribute("claveprimaria")  
                            //hacemos la peticion para eliminar un  registro        
                            fetch("../../servidor/?o=eliminar&tabla="+tabla+"&id="+identificador)
                            // Ademas de enviar la peticion al servidor, elimino visualmente el elemento     
                            this.parentElement.remove()                                     
                        }
                        // Introduzco la fila dentro de la tabla
                        contenidotabla.appendChild(nuevafila)                               
                    })
                })
           
            /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////
            
            
            /////////////////////////////////// CONTENIDO DE LA VENTANA MODAL /////////////////////////////////////////////
        })
    
 }