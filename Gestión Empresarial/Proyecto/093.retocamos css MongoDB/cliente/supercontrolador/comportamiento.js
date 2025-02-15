/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = []                                             
var aplicaciones;
window.onload = function(){

    const nombreUsuario = localStorage.getItem('nombre_usuario');  // Obtenemos el nombre completo desde localStorage

    if (nombreUsuario) {
        // Si el nombre completo está en localStorage, lo mostramos
        const usuarioElement = document.getElementById('nombre-usuario');
        if (usuarioElement) {
            usuarioElement.textContent = `${nombreUsuario}`;  // Actualizamos el texto con el nombre completo
        }
    }
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    let aplicacion = localStorage.getItem("crismon1_aplicacion")
    console.log("La aplciacion es:"+aplicacion)
    
    fetch("../../servidor/?o=listatablasaplicacion&aplicacion="+aplicacion)                        
        .then(response => {
          return response.json();                                 
        })
        .then(datos => {
            console.log(datos)
            crearMenuTablas(datos,"tabla");
        })

    //////////////////////////////////////INTEGRAMOS LA GRAFICA EN EL PROYECTO ////////////////////////////////////////
    
    fetch("../../servidor/?o=datosgrafica") 
    .then(function(result){
        return result.json();
    })   

    .then(function(datos){
        let graficoPastel = new GeneradorGrafica(datos, "#20B2AA", "table tbody", "AQUI VA EL TITULO DE LA GRÁFICA");
        graficoPastel.creargrafica();
        
    })
    //cargaDatosTabla("clientes")

    //////////////////////////////////// LISTA DE COLECCIONES MONGODB //////////////////////////////////

    fetch("../../servidor/?o=listacolecciones")
    .then(response => {
        return response.json();
    })
    .then(datos => {
        console.log("Vamos con las colecciones")
        console.log(datos)
        crearMenuTablas(datos,"coleccion")
    })


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

    /////////////////////////////////// FUNCION DE CERRAR SESIÓN /////////////////////////////////////////////
    // Añadimos la funcionalidad al botón de salir
    document.querySelector("#logout").onclick = function() {
        // Eliminamos los datos de usuario del localStorage
        localStorage.removeItem('nombre_usuario');
        localStorage.removeItem('crismon1_usuario');

        // Redirigimos al usuario a la página de inicio
        window.location = "../index.html"; 
    }

    /////////////////////////////////// FUNCION ABRIR CORREO ELECTRONICO /////////////////////////////////////////////
   

    document.querySelector("#correo").onclick = function() {

            document.querySelector("section").innerHTML = ""
    		document.querySelector("section").style.display = "block"
    		let marco = document.createElement("iframe")
    		marco.setAttribute("src","http://localhost:5000/")
            marco.setAttribute("id", "correo-iframe"); 
    		document.querySelector("section").appendChild(marco)
    
        

    }
/////////////////////////////////// CARGAMOS LAS APLICACIONES /////////////////////////////////////////////

    fetch("apps/apps.json")
    .then(function(response){
        return response.json()
    })
    .then(function(datos){
        console.log(datos);
        aplicaciones = datos;
    })
}

/////////////////////////////////// BOTN IMPRIMIR  /////////////////////////////////////////////

// Evento para imprimir la página
document.querySelector("#imprimir").onclick = function() {
    var iframe = document.querySelector("section iframe");
    if (iframe) {
        try {
            iframe.contentWindow.focus(); // Enfoca el contenido del iframe
            iframe.contentWindow.print(); // Intenta imprimir solo el iframe
        } catch (error) {

            window.print(); 
        }
    } else {
        window.print(); // Si no hay iframe, imprime normalmente
    }
};

/////////////////////////////////// BOTN IMPRIMIR  /////////////////////////////////////////////

let ayudaBtn = document.querySelector("#ayuda");
let modalAyuda = document.querySelector("#modal-ayuda");
let iframeAyuda = document.querySelector("#iframe-ayuda");
let cerrarAyuda = document.querySelector("#cerrar-ayuda");


ayudaBtn.onclick = function() {
    //Mostrar el modal
    modalAyuda.style.display = "block";
    // Cargar la página de ayuda en el iframe
    iframeAyuda.setAttribute("src", "ayuda/");
};

cerrarAyuda.onclick = function() {
    modalAyuda.style.display = "none";
    iframeAyuda.setAttribute("src", ""); // Limpiar el iframe
};
window.onclick = function(event) {
    if (event.target === modalAyuda) {
        modalAyuda.style.display = "none";
        iframeAyuda.setAttribute("src", ""); // Limpiar el iframe
    }
};