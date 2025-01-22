/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////
//declaramos la funcion que recibe el nombre de una tabla 
function cargaDatosTabla(tabla){
    //declaramos una variable para guardar el nombre de la columna que actuua como primaria
    let campoclave;                                                          
    /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
     //realizamos una peticion para obtener el nombre de las columnas 
     fetch("../../servidor/?o=columnastabla&tabla="+tabla)                 
         .then(response => {
           return response.json();                                         
         })
         .then(datos => {
            //.. iniciamos arrayas vacios para guadar ..//
            //nombres de columna 
             columnas_tabla = [] 
             //tipo de datos                                        
             tipos_tabla = []	
             //claves 															
             claves_tabla = []	
             //para los elementos inputs															
             campos_busqueda = []
             //obtenemos el elemento de la final de encabezados y lo limpiamos para evitar duplcaciones														
             let cabeceras_tabla = document.querySelector("table thead tr"); 
             cabeceras_tabla.innerHTML = ""  
             //Recorremos cada coumna y para cada una                                 
             datos.forEach(function(dato){       
                //crea un elemento para el encabezado                           
                 let elemento = document.createElement("th") 
                 //y agregamos el nombre al array de columnas_tabla            
                 columnas_tabla.push(dato['Field'])                         
                 //Establecemos el nombre de la columna como texto de encabezado 
                 elemento.textContent = dato['Field']             
                 //creamos un campo de netrada para las busquiedas           
                 campos_busqueda.push(document.createElement("input"))		
                 //le ponemos el nombre de la columna en el campo de busqueda									
                 campos_busqueda[campos_busqueda.length-1].setAttribute("placeholder",dato['Field'] )	
                 //gvuardamos la clave de la columna en el array de claves_tabla
                 claves_tabla.push(dato['Key'])										
                 //convertimos el tippo de dato para establecer el tipo de campo de entrad
                 campos_busqueda[campos_busqueda.length-1].setAttribute("type",convierteTipoDato(dato['Type']) )
                 tipos_tabla.push(convierteTipoDato(dato['Type']))
                 //Añade el campo de entrada al encabezado y el encabezado a la fila de encabezados.
                 elemento.appendChild(campos_busqueda[campos_busqueda.length-1])											
                 cabeceras_tabla.appendChild(elemento)  
                 //si la columna es una clave primaria                     
                 if(dato['Key'] == "PRI"){  
                    //guarda su nombre en campoclave                                 
                     campoclave = dato['Field']                              
                 }
             })

             ///------------------- AGREGAMOS UNA COLUMNA DE BUSQUEDA .---------///
             //creamos un icono y lo añadimos al final de los encabezados
             let elemento = document.createElement("th") 							
             elemento.textContent = "🔍"												
             cabeceras_tabla.appendChild(elemento) 	
             //definimos la funcion para cuando hagamos click encima de esta								
             elemento.onclick = function(){											
                //crea un objeto para guardar los valores de busqueda ingresaados 
                 mensaje = {}	
                 //Recorre los campos de busqueda y agrega el objeto														
                 campos_busqueda.forEach(function(campo){							
                     let columna = campo.getAttribute("placeholder")
                     //a mensaje le añadimos las columnas y valores ingresados por el usuario			
                     let valor = campo.value	
                     //solo si el valor no esta vacio											
                     if(valor != ""){														
                         mensaje[columna] = valor										
                     }
                 })
                 fetch("../../servidor/?o=buscarSimilar&tabla="+tabla, {		
                           method: 'POST', 
                           headers: {
                             'Content-Type': 'application/json', 
                           },
                           body: JSON.stringify(mensaje), 
                         })
                       .then(response => {
                          return response.json();                                                      
                       })
                       .then(datos => {			  
                               pueblaTabla(datos,campoclavem,tabla)									
                       })
             }
             //console.log(columnas_tabla);
             
                 /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
                 //inicia un array para los campos del formulario
                 let coleccioncampos = []                   
                 //seleccionamos el contenedor modal                                            
                 let contiene_modal = document.querySelector("#contienemodal")
                 //le agregamos un titulo                           
                 contiene_modal.innerHTML = "<h1>Formulario de inserción: "+tabla+"</h1>" 
                 //creamos una seccion para agrupar los campos                                                         
                 let seccion = document.createElement("section")

                 //Para cada columna se crea un contenedor div con una descripcion 
                 columnas_tabla.forEach(function(columna,index){                                              
                     let contenedor = document.createElement("div")
                     let texto = document.createElement("p")
                     texto.textContent = "Inserta un nuevo elemento para: "+columna+""
                     contenedor.appendChild(texto)

                     //si la columna no es una clave foranea 
                     if(claves_tabla[index] != "MUL"){
                        //creamos un  campo de entrada simple con el tipo correspondiente a la columna
                          coleccioncampos.push(document.createElement("input"))                              
                          coleccioncampos[coleccioncampos.length-1].setAttribute("type",tipos_tabla[index]) 
                                                                   // Le pongo una leyenda al campo 
                         coleccioncampos[coleccioncampos.length-1].setAttribute("placeholder",columna)                                                 
                         contenedor.appendChild(coleccioncampos[coleccioncampos.length-1])                                                                            
                     
                     }else{
                            //creamos un menu desplegable
                            let selectElement = document.createElement("select");
                            coleccioncampos.push(selectElement);
                            //agregamos una opcion por defecto
                            let defaultOption = document.createElement("option");
                            //y llamamos a la funcion  para poblar el menu conn datos del servidor 
                            defaultOption.textContent = "Selecciona una opción:";
                            selectElement.appendChild(defaultOption);
        
                            fetchOptionsForSelect(selectElement, columna);
                            selectElement.setAttribute("placeholder", columna);
                            
                            contenedor.appendChild(selectElement);
                            selectjv(selectElement)
                     }  
                      
                     /*
                     try{
                         
                     }catch(Error){
                         console.log("no aplica")
                     }
                     */
                    //añadimos vcada contenedor de campo a la seccion del formulario
                     seccion.appendChild(contenedor)                                                   
                         
                     })
                //y lo añadimos a la ventana mnodal
                 contiene_modal.appendChild(seccion) 
                 
                 //////-------------------BOTON PARA ENVIAR FORMULARIO ------------------///

                 let boton_enviar = document.createElement("button")                                    
                 boton_enviar.textContent = "Enviar"                                                     
                 boton_enviar.onclick = function(){                                                    
                     console.log("Vamos a procesar el formulario") 
                     //nos enseñara el contenido de coleccion campos                                     
                     console.log(coleccioncampos)
                     let mensaje = {}

                     ///CONTRUIMOS UN OBBJETO CON LOS DATOS DEL FORMULARIO ///
                     //recorre todos los campos
                     coleccioncampos.forEach(function(campo){
                        //obtenemos el valor del placeholder  y lo usamos como calve identificadora
                         if(campo.getAttribute('placeholder') != "Identificador"){
                            if(campo.getAttribute('type') == "file"){
                                console.log("veo un archivo")
                                let archivo = campo.files[0]
                                //intentamos obtener el contenido binario de un archivo 
                                //Esto devuelve una promesa que contiene los datos del archivo en formato de un ArrayBuffer.
                                let buffer = archivo.arrayBuffer()
                                //Esto asegura que el archivo se esté guardando en el objeto con la clave correspondiente.
                                mensaje[campo.getAttribute('placeholder')] = buffer
                            }else{
                                //añadimos una entrada de objeto
                                mensaje[campo.getAttribute('placeholder')] = campo.value
                            }

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
                     .then(function(datos){
                         console.log(datos)
                         //parsa cerrar el modal tras enviar el formulario
                         document.querySelector("#modal").classList.remove("aparece")
                         document.querySelector("#modal").classList.add("desaparece")
                         setTimeout(function(){
                             document.querySelector("#modal").style.display = "none"
                         },1000)
                     })
                     
                 }
                 contienemodal.appendChild(boton_enviar)                                                 
                 /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
             
             /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////
  
             fetch("../../servidor/?o=tabla&tabla="+tabla)                           
                 .then(response => {
                   return response.json();                                                   
                 })
                 .then(datos => {
                     pueblaTabla(datos,campoclave,tabla)
                 })
            
          
         })
     
  }
  
  /////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////
  
  /////////////////////////// FUNCION AUXXILIAR PARA LLENAR LAS OPCIONES DEL SELECT /////////////////////////
  
  function fetchOptionsForSelect(selectElement, column) {
    //envia una solicitud al servidor 
    //divide el string en partes por el caracter_ y coje la primera parte
     fetch("../../servidor/?o=tabla&tabla=" + column.split("_")[0])
         .then(response => response.json())
         .then(datos => {
            //Recorre cada objeto (fila) de la respuesta
             datos.forEach(function(dato) {
                //crea un elemento option
                 let option = document.createElement("option");
                 //asigna el valor dle campo al atributo value
                 option.value = dato['Identificador'];
                 //covierte todos los valores de objeto concatenados con -
                 option.textContent = Object.values(dato).join(' - ');
                 //insertamos la opcion recien creada como un hijo del elemento
                 selectElement.appendChild(option);
             });
         });
 }