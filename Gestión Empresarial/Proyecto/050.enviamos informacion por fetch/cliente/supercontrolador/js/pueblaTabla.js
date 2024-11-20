//////////////////////////////////// FUNCION PARA RELLENAR LA TABLA CON INFORMACION ////////////////////////////////
//en esta funcion cojemos como parametros datos para contruir las filas de la tabla 
//y campo clave para identificar de manera unica cada elemento
function pueblaTabla(datos,campoclave,tabla){
    //seleccionamos el contenido vacio de la tabla 
    let contenidotabla = document.querySelector("section table tbody") 
    //vaciamos el contenido de la tabla      
    contenidotabla.innerHTML = ""    

    //recorrer cada objeto dentro del arreglo donde cada registro representa una fila 
    datos.forEach(function(registro){  
        //declaramos una variable para guardar la clave primaria del registro                                     
        let clave_primaria;
        //creamos una nueva fila de la tabla
        let nuevafila = document.createElement("tr")
        //recorremos las propiedades del objeto                        
        Object.keys(registro).forEach(clave => {    
            //si el campo que estamos recorriendo es una clave primaria                         
            if(clave == campoclave){  
                //guarda la calve como identificador del registro                                      
                clave_primaria = registro[clave]                            
            }
            // Creo una nueva celda para la tabla
            let nuevacolumna = document.createElement("td") 
            // asignamos el valor actual como el contenido de la celda               
            nuevacolumna.textContent = registro[clave] 
            //le asignamos unos atributos, para ayudar a identificar a que tabla pertenece esta celda
            nuevacolumna.setAttribute("tabla",tabla)
            //asignamos un atributo con el nombre de la propiedad de casa objeto
            nuevacolumna.setAttribute("columna",clave)
            //contiene el valor de la clave primaria de ese registro
            nuevacolumna.setAttribute("Identificador",clave_primaria)

            //-------- hacer la celda editable al hacer docle click ----------//
            //para hacer el doble clcick enla casillla que sea editable 
            nuevacolumna.ondblclick = function(){
                console.log("has echo click en una celda")
                //es un atributo que permite se editable directamente 
                this.setAttribute("contenteditable","true")
                //da el enfoque a la celda, colocandolo en modo edicion
                this.focus()
            }
            //------------ Guardar los cambios cuando se salga de la celda ------//
            //para cuando salgamos de la casilla
            nuevacolumna.onblur = function(){
                //desactivamos el modo edicion 
                this.setAttribute("contenteditable","false")
                //creamos un objeto que va incluir
                let mensaje = {
                    "tabla":this.getAttribute("tabla"),                     //nombre de la tabla
                    "columna":this.getAttribute("columna"),                 //nombre de la columna
                    "Identificador":this.getAttribute("Identificador"),     //el identificador único del registro
                    "valor":this.textContent                                //y el valor que hayamos editado
                }
                //realizamos un envio al servidor y le pasaoms el mensaje 
                fetch("../../servidor/?o=actualizar", {							
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
                    console.log(datos)
                })
                console.log(mensaje)
            }
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