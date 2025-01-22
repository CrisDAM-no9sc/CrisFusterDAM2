/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = []                                             

window.onload = function(){

    const nombreUsuario = localStorage.getItem('nombre_usuario');  // Obtenemos el nombre completo desde localStorage

    if (nombreUsuario) {
        // Si el nombre completo está en localStorage, lo mostramos
        const usuarioElement = document.getElementById('nombre-usuario');
        if (usuarioElement) {
            usuarioElement.textContent = `Bienvenido, ${nombreUsuario}`;  // Actualizamos el texto con el nombre completo
        }
    }
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    fetch("../../servidor/?o=listatablas")                        
        .then(response => {
          return response.json();                                 
        })
        .then(datos => {
            crearMenuTablas(datos,"tabla");
        })



    //////////////////////////////////////INTEGRAMOS LA GRAFICA EN EL PROYECTO ////////////////////////////////////////
    
    // Datos de las porciones para generar la gráfica
    let datos = [
        { "texto": "Porción 1", "valor": 50 },
        { "texto": "Porción 2", "valor": 60 },
        { "texto": "Porción 3", "valor": 120 },
        { "texto": "Porción 4", "valor": 10 },
        { "texto": "Porción 5", "valor": 30 },
        { "texto": "Porción 6", "valor": 70 },
        { "texto": "Porción 7", "valor": 40 }
    ];

    // Crear una instancia de GeneradorGrafica con los datos, color y selector
    let nuevografico = new GeneradorGrafica(datos, "#20B2AA", "table tbody");

    // Llamar al método para generar la gráfica
    nuevografico.creargrafica();    
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

    }

    document.querySelector("#correo").onclick = function() {
    // Mostrar el nombre de usuario en el contenedor adecuado
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    if (nombreUsuario) {
        // Actualizar el contenido del div #nombre-usuario
        document.querySelector("#nombre-usuario").textContent = `👤 Bienvenido, ${nombreUsuario}`;
    } else {
        // Si no se encuentra el nombre del usuario
        document.querySelector("#nombre-usuario").textContent = "👤 Bienvenido, cargando nombre...";
    }

    // Limpiar la sección y mostrarla
    document.querySelector("section").innerHTML = "";
    document.querySelector("section").style.display = "block";

    // Crear un iframe para mostrar el contenido
    let marco = document.createElement("iframe");
    marco.setAttribute("src", "http://localhost:5000/"); // Cambia esta URL si es necesario
    document.querySelector("section").appendChild(marco);
}

}

