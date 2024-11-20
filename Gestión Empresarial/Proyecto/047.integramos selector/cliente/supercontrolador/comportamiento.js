/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = []                                             

window.onload = function(){
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    fetch("../../servidor/?o=listatablas")                        
        .then(response => {
          return response.json();                                 
        })
        .then(datos => {
            crearMenuTablas(datos)
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

