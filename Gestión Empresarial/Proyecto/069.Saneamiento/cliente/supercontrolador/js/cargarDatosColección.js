function cargarDatosColeccion(coleccion){
    console.log("Vamos a cargar los datos")
    document.querySelector("tabla").innerHTML = "";
    fetch("../../servidor/?o=listadocumentos&coleccion="+coleccion)
    .then(response => {
        return response.json();
    })
    .then(datos => {
        console.log(datos)
        datos.forEach(function(){
            document.querySelector("table").style.display = "block";
            document.querySelector("table").innerHTML+= `<article><h3>Documento</h3></article>;`
        })
    })
}