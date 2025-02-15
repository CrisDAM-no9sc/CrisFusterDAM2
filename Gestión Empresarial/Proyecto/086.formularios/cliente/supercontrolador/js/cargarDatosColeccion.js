function cargarDatosColeccion(coleccion) {
    console.log("Vamos a cargar los datos");

    // Asegúrate de usar un selector válido (por ejemplo, un ID o clase).
    document.querySelector("table").innerHTML = "";

    // Realiza la solicitud al servidor
    fetch("../../servidor/?o=listacolecciones&coleccion=" + coleccion)
        .then(response => response.json())
        .then(datos => {
            console.log(datos);

            datos.forEach(function(){
                document.querySelector("table").style.display = "block"
                document.querySelector("table").innerHTML += `
                    <article>
                        <h3>Documentos</h3>
                    </article>
                `;
            });
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
        });
}