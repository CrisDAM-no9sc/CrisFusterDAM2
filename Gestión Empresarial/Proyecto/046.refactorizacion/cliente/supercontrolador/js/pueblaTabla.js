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