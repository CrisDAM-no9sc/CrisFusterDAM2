/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = []                                             

window.onload = function(){
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    fetch("../../servidor/?o=listatablas")                        
        .then(response => {
          return response.json();                                 
        })
        .then(datos => {
            console.log(datos)
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
                //aqui vamos a crear una etiqueta html para sacar los comentarios de cada tabla 
                elemento.setAttribute("comentario",tabla['Comentario'])
                //cuando apretemos en los nombres de las tablas           
                elemento.onclick = function(){     
                    //atrapamos el contenido del elemento                 
                    let texto = this.textContent 
                    // Y lo paso como parametro a la llamada que carga los datos de la tabla                  
                    cargaDatosTabla(texto)
                    // Aqui vamos a cargar los titulos y comentarios
                    document.querySelector(".titulotabla h5").textContent = this.textContent;
                    document.querySelector(".titulotabla p").textContent = this.getAttribute("comentario");                         
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
            //------------------------- INICIALIZACION ARRAYS VACIOS ---------------------------------//
            // guarda los nombre de las columnas de la tabla 
            columnas_tabla = []  
            // guardar los tipos de datos de cada columnas 
            tipos_tabla = []    
            //guarda las claves de las columnas 
            claves_tabla = []
            //guardara todos los inputs asociados a cada columna, utilizados para buscar registros
            campos_busqueda  = []     

            //----------------------- PREPARAMOS LA CABECERA DE LA TABLA -----------------------------//
            // Selecciono donde tengo que poner las cabeceras en la tabla                                
            let cabeceras_tabla = document.querySelector("table thead tr"); 
            //limpia las cabeceras para evitar duplicaciones 
            cabeceras_tabla.innerHTML = ""      

            //---------------------- ITERAMOS SOBRE LOS DATOS DE LAS COLUMNAS -------------------------//    
            //aqui vamos a recorrer cada columna de la tabla recibida por el servidor         
            datos.forEach(function(dato){     

                //-------------- CREAMOS UNA CABECERA -------------------//
                //creamos una nueva celda de cabecera                             
                let elemento = document.createElement("th") 
                //guardamos el nombre de la columna en el array
                //utilizamos en nombre de field para etiquetar el encabezado                 
                columnas_tabla.push(dato['Field'])    
                // Su texto es el nombre del campo de la base de datos     
                //añade el nombre de la columna al array columnas_tabla                 
                elemento.textContent = dato['Field']

                //-------------  CREACION CAMPO DE BUSQUEDA ------------//
                //por cada columna se genera un input para buscar los registros basados en los valores ingresados 
                //creamos un campo de entrada para buscar en la columna 
                campos_busqueda.push(document.createElement("input"))
                //a cada uno de los campos del buscador le ponemos un placeholder
                campos_busqueda[campos_busqueda.length-1].setAttribute("placeholder",dato['Field'])
                //al array le añadimos el valor de la clave que viene de la base de datos
                claves_tabla.push(dato['Key'])
                //consultamos el tipo de dato 
                console.log(dato['Type'])

                //------------------------- CONFIGURACIÓN DINAMICA  --------------------------//

                //aqui estamos haciendo que en cada casilla contyenga el datos que le corresponde 
                //si la columna es varchar, el input sera del tipo text
                if(dato['Type'].includes("varchar")){
                    campos_busqueda[campos_busqueda.length-1].setAttribute("type","text") 
                    tipos_tabla.push("text")
                //si es int, sera del tipo number
                }else if(dato['Type'].includes("int")){
                    campos_busqueda[campos_busqueda.length-1].setAttribute("type","number") 
                    tipos_tabla.push("number")
                //si es date, sera un selector de fecha 
                }else if(dato['Type'].includes("date")){
                    campos_busqueda[campos_busqueda.length-1].setAttribute("type","date") 
                    tipos_tabla.push("date")
                }else if(dato['Type'].includes("decimal")){
                    campos_busqueda[campos_busqueda.length-1].setAttribute("type","number") 
                    tipos_tabla.push("number")
                }

                //añadimos el inut correspondienre a la celda de la cabecera (th) 
                //y la cabecera completa se agrega a (tr)
                //y en cada una de las cabeceras ponermos un campo input
                elemento.appendChild(campos_busqueda[campos_busqueda.length-1])
                // Añado ese elemento a las cabeceras de la tabla                        
                cabeceras_tabla.appendChild(elemento)
                
                //--------------------------- IDENTIFICAMOS LA CLAVE PRIMARIA --------------------//
                //si la clave primaria de la columna es PRI, guardaremos el nombre de la columna en campoclave
                // Si este campo es clave primaria                      
                if(dato['Key'] == "PRI"){    
                    // en ese caso, recordamos cual es el nombre del campo que hace de clave primaria                               
                    campoclave = dato['Field']                              
                }
            })
            //-------------------  AGREGAMOS LA LUPA AL BUSCADOR -----------------------//

            let elemento = document.createElement("th") 
            //en la ultima cabecera de la columna ponemos la lupa 
            elemento.textContent = "🔍";
            cabeceras_tabla.appendChild(elemento) 

            //------------------------ HACEMOS FUNCIONAR LA BUSQUEDA --------------------//
            //aqui vamos a recolectar el contenido de los campos de busqueda 
            //definimos una funcion que se ejecutara al hacer click en la lupa
            elemento.onclick = function(){
                //creamos un objeto vacio , que se llenara con los datos ingresados por los usuarios
                mensaje = {}
                //Recorremos el array de campo_busqueda que es donde va a contener todos los inputs creados 
                campos_busqueda.forEach(function(campo){
                    //onbtenemos el nombre de la columna con el campo de busqueda actual
                    //esto nos va ayudar a identificar a que columna de la tabla corresponde el input
                    let columna = campo.getAttribute("placeholder");
                    //recuperamos el valor ingresado en el input de busqueda
                    let valor = campo.value;
                    //solo se agregara al objeto mensaje las columnas que han sido rellenadas por el usuario
                    //comprovamos si el campo tinee un valor 
                    if(valor != ""){
                        //y si lo tinee, lo añadimos al objeto mensaje con el formato
                        //el noombre de la columna se usa como clave y el valor ingresado como su valor  
                        mensaje[columna]= valor;
                    }
                })
                console.log(mensaje)
                //------------------------- ENVIAMOS LOS DATOS AL SERVIDOR ----------------//
                //envia los datos al servidor y actualiza la tabla llamanado a la funcion pueblaTabla
                //para renderizar las filas con los nuevos resultados
                fetch("../../servidor/?o=buscarSimilar&tabla="+tabla, {
                        method: 'POST', 
                        headers: {
                        'Content-Type': 'application/json', 
                        },
                        //aqui convertimos el objeto en una cadena JSON
                        body: JSON.stringify(mensaje), 
                  })
                //manejamos la respuesta del servidor, y cuando este responde devulve la respuesta en json
                .then(response => {
                    return response.json();                                                       
                })
                .then(datos => {
                    pueblaTabla(datos,campoclave)
                })
  
            }
            console.log(columnas_tabla);
            
            /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////

            // Creo una colección vacía de campos
            let coleccioncampos = []    
            //------------------- CREAMOS UN FORMULARIO DINAMICO ----------------//  
            // Selecciono el contenedor del modal                                                          
            let contiene_modal = document.querySelector("#contienemodal") 
            // limpia cualquier contenido dentro del modal  
            //y ñadimos un titulo indicando el nombre de la tabla                         
            contiene_modal.innerHTML = "<h1>Formulario de inserción: "+tabla+"</h1>"  
            //creamos una secccion para los campos del formulario
            let seccion = document.createElement("section")
            //------------------- GENERAR LOS CAMPOS DEL FORMULARIO ---------------//
             // PAra cada una de las columnas de la tabla
             //index es la posicion en el arreglo
            columnas_tabla.forEach(function(columna,index){     
                //creamos un div donde vamos a agrupar los campos y su descirpcion                                         
                let contenedor = document.createElement("div")
                //le añadimos un parrafo, donde indicara el nombre de la columna 
                let texto = document.createElement("p")
                texto.textContent = "Inserta un nuevo elemento para: "+columna+""
                contenedor.appendChild(texto)
                //------------CREAMOS EL CAMPO DE ENTRADA SI NO ES UNA CLAVE FORANEA-----------//
                //si la columna no es una clave foranea, crera un campos de entrada
                if(claves_tabla[index] != "MUL"){
                    // Creo un campo input
                    coleccioncampos.push(document.createElement("input"))  
                    //aqui definiremos el tipo de campo segun el valor de 
                    coleccioncampos[coleccioncampos.length-1].setAttribute("type",tipos_tabla[index])
                    // le añadimos un placeholder al campo con el nombre de la columna                            
                    coleccioncampos[coleccioncampos.length-1].setAttribute("placeholder",columna) 
                //------------------SI LO ES CREA UN MENU DESPLEGABLE------------------------// 
                //de lo contrario si tiene una clave foranea 
                }else{
                    //crearemos un menu desplegable
                    coleccioncampos.push(document.createElement("select"))
                    let opcion = document.createElement("option")
                    opcion.textContent = "Selecciona una opción: "
                    coleccioncampos[coleccioncampos.length-1].appendChild(opcion)
                    //------------------- CREAMOS OPCIONES DINAMICAS----------------//
                    //hacemos una llamada al servidor para obtener los datos relacionados con la clave foranea 
                    //y el nombre de la tabla la obtenemos dividiendo el nombre de la columna 
                    fetch("../../servidor/?o=tabla&tabla="+columna.split("_")[0])
                    //procesamos la respuesta del servidor
                    .then(function(response){
                        return response.json()
                    })
                    //----- AQUI ES DONDE VAMOS A GENERAR LAS OPCIONES DINAMICAS -------//
                    .then(function(datos){
                        console.log(datos) 
                        //para cada dato recibido 
                        datos.forEach(function(dato){
                            let opcion = document.createElement("option")
                            //combina las propiedades del registro formando una cadena
                            let cadena = Object.values(dato).join(' - ')
                            //creamos unna opcion con el texto de la cadena devuelto 
                            opcion.textContent = cadena
                            //añadimos la opcion al menu desplegable
                            coleccioncampos[coleccioncampos.length-1].appendChild(opcion)
                        })
                    })
                }
                // Lo añado al modal                                                                          
                contenedor.appendChild(coleccioncampos[coleccioncampos.length-1]) 
                // Lo añado al modal                                                   
                seccion.appendChild(contenedor)                                                    
            })
            //----------- AÑADIR EL FORMULARIO AL CONTENEDOR DEL MODAL ------//
            contiene_modal.appendChild(seccion) 
            // Por último creo un boton
            let boton_enviar = document.createElement("button")  
            // Le pongo texto al boton                                   
            boton_enviar.textContent = "Enviar" 
            // Cuando haga click en el boton                                                    
            boton_enviar.onclick = function(){                                                      
                console.log("Vamos a procesar el formulario")                                       
                console.log(coleccioncampos)
                //creamos un objeto vacio donde guaradaremos los datos ingresados en e l formulario
                let mensaje = {}
                //recorremnos los campos del formulario
                coleccioncampos.forEach(function(campo){
                    //si el placeholder no es un identificador 
                    if(campo.getAttribute('placeholder') != "Identificador"){
                        //usara el placeholder como clave, y guarda el valor ingresado en el campo con el valor correspondiente
                        mensaje[campo.getAttribute('placeholder')] = campo.value
                    }
                })
                console.log(mensaje)

                fetch("../../servidor/?o=insertar&tabla="+tabla, {
                        method: 'POST', 
                        headers: {
                        'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify(mensaje), 
                    })
                .then(function(response){
                    return response.text()
                })
                //ocultara el modal despues del envio
                .then(function(datos){
                    console.log(datos)
                    //elimina la clase 
                    document.querySelector("#modal").classList.remove("aparece")
                    //y le añadimos la clase desaparece 
                    document.querySelector("#modal").classList.add("desaparece")
                    //le ponemos un temporizador de 1 segundo antes de ocultarlo
                    setTimeout(function(){
                        document.querySelector("#modal").style.display = "none"
                    },1000)
                })
                
            }
            contienemodal.appendChild(boton_enviar)                                                 
            
            /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////

            // LLamo a un microservicio que me da la lista de tablas y le paso la tabla como parametro
            fetch("../../servidor/?o=tabla&tabla="+tabla)  
                //para que el servidor nos devuelva en formato json                          
                .then(response => {
                  return response.json();                                                
                })
                .then(datos => {
                    pueblaTabla(datos,campoclave)
                })
           
            /////////////////////////////////// CONTENIDO DE LA VENTANA MODAL /////////////////////////////////////////////
        })
    
 }
 //////////////////////////////////// FUNCION PARA RELLENAR LA TABLA CON INFORMACION ////////////////////////////////
//en esta funcion cojemos como parametros datos para contruir las filas de la tabla 
//y campo clave para identificar de manera unica cada elemento
 function pueblaTabla(datos,campoclave){
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
 }