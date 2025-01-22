/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = []                                             

window.onload = function(){

    actualizarNombreUsuario();

    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    fetch("../../servidor/?o=listatablas")                        
        .then(response => {
          return response.json();                                 
        })
        .then(datos => {
            crearMenuTablas(datos,"tabla");
        })
    cargaDatosTabla("clientes")

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
    document.querySelector("#logout").onclick = function() {
        localStorage.removeItem('nombre_usuario');
        localStorage.removeItem('crismon1_usuario');
        window.location = "../index.html";
    };

        /////////////////////////////////// FUNCION ABRIR CORREO ELECTRONICO /////////////////////////////////////////////
    document.querySelector("#correo").onclick = abrirCorreoElectronico;

};
    /////////////////////////////////////////// REVONOCER NOMBRE USUARIO //////////////////////////////////////////////
    function actualizarNombreUsuario() {
        const nombreUsuario = localStorage.getItem('nombre_usuario');
        const usuarioElement = document.querySelector("#nombre-usuario");
        if (usuarioElement) {
            usuarioElement.textContent = nombreUsuario ? 
                `Bienvenido, ${nombreUsuario}` : 
                "Bienvenido, cargando nombre...";
        }
    }

    /////////////////////////////////// FUNCION ABRIR CORREO ELECTRONICO /////////////////////////////////////////////
    function abrirCorreoElectronico() {
        const section = document.querySelector("section");
        section.innerHTML = "";
        section.style.display = "block";
    
        const marco = document.createElement("iframe");
        marco.setAttribute("src", "http://localhost:5000/");
        section.appendChild(marco);
    }

