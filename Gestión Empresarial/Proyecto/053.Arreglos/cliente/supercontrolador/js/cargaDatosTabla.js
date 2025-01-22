/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla){
    let campoclave;                                                          
    /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
     
     fetch("../../servidor/?o=columnastabla&tabla="+tabla)                
         .then(response => {
           return response.json();                                           
         })
         .then(datos => {
             columnas_tabla = []                                         
             tipos_tabla = []																
             claves_tabla = []																
             campos_busqueda = []														
             let cabeceras_tabla = document.querySelector("table thead tr"); 
             cabeceras_tabla.innerHTML = ""                                 
             datos.forEach(function(dato){                                
                 let elemento = document.createElement("th")             
                 columnas_tabla.push(dato['Field'])                       
                  
                 elemento.textContent = dato['Field']                       
                 campos_busqueda.push(document.createElement("input"))											
                 campos_busqueda[campos_busqueda.length-1].setAttribute("placeholder",dato['Field'] )	
                 
                 claves_tabla.push(dato['Key'])										
                 
                 campos_busqueda[campos_busqueda.length-1].setAttribute("type",convierteTipoDato(dato['Type']) )
                 tipos_tabla.push(convierteTipoDato(dato['Type']))
                 
                 elemento.appendChild(campos_busqueda[campos_busqueda.length-1])										
                 cabeceras_tabla.appendChild(elemento)                     
                 if(dato['Key'] == "PRI"){                                 
                     campoclave = dato['Field']                            
                 }
             })
             let elemento = document.createElement("th") 					
             elemento.textContent = "🔍"												
             cabeceras_tabla.appendChild(elemento) 								
             elemento.onclick = function(){											
 
                 mensaje = {}															
                 campos_busqueda.forEach(function(campo){							
                     let columna = campo.getAttribute("placeholder")				
                     let valor = campo.value												
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
                               pueblaTabla(datos,campoclave)							
                       })
             }
             
             
                 /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
                 let coleccioncampos = []                                                                
                 let contiene_modal = document.querySelector("#contienemodal")                           
                 contiene_modal.innerHTML = "<h1>Formulario de inserción: "+tabla+"</h1>"                                                           
                 let seccion = document.createElement("section")
                 columnas_tabla.forEach(function(columna,index){                                           
                     let contenedor = document.createElement("div")
                     let texto = document.createElement("p")
                     texto.textContent = "Inserta un nuevo elemento para: "+columna+""
                     contenedor.appendChild(texto)
                     if(claves_tabla[index] != "MUL"){
                          coleccioncampos.push(document.createElement("input"))                              
                          coleccioncampos[coleccioncampos.length-1].setAttribute("type",tipos_tabla[index]) 
                                                               
                         coleccioncampos[coleccioncampos.length-1].setAttribute("placeholder",columna)                                                  
                         contenedor.appendChild(coleccioncampos[coleccioncampos.length-1])                                                                            
                     
                     }else{
                             let selectElement = document.createElement("select");
                     coleccioncampos.push(selectElement);
 
                     let defaultOption = document.createElement("option");
                     defaultOption.textContent = "Selecciona una opción:";
                     selectElement.appendChild(defaultOption);
 
                     fetchOptionsForSelect(selectElement, columna);
                     selectElement.setAttribute("placeholder", columna);
                     
                     contenedor.appendChild(selectElement);
                     selectjv(selectElement)
                     }  
                      

                     seccion.appendChild(contenedor)                                               
                         
                     })
                 contiene_modal.appendChild(seccion) 
                 
                 let boton_enviar = document.createElement("button")                                    
                 boton_enviar.textContent = "Enviar"                                                    
                 boton_enviar.onclick = function(){                                        
                     console.log("Vamos a procesar el formulario")                                      
                     console.log(coleccioncampos)
                     let mensaje = {}
                     coleccioncampos.forEach(function(campo){
                         if(campo.getAttribute('placeholder') != "Identificador"){
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
                     .then(function(datos){
                         console.log(datos)
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
                     pueblaTabla(datos,campoclave)
                 })
            
             /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////
             
             
             /////////////////////////////////// CONTENIDO DE LA VENTANA MODAL /////////////////////////////////////////////
         })
     
  }
  
  /////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////
  
  
  
  function fetchOptionsForSelect(selectElement, column) {
     fetch("../../servidor/?o=tabla&tabla=" + column.split("_")[0])
         .then(response => response.json())
         .then(datos => {
             datos.forEach(function(dato) {
                 let option = document.createElement("option");
                 option.value = dato['Identificador'];
                 option.textContent = Object.values(dato).join(' - ');
                 selectElement.appendChild(option);
             });
         });
 }