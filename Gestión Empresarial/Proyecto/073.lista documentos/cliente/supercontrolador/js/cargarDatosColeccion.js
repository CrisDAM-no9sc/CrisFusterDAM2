function cargarDatosColeccion(coleccion) {
    console.log("Vamos a cargar los datos");

    // Asegúrate de usar un selector válido (por ejemplo, un ID o clase).
    const tabla = document.querySelector("table"); 

    tabla.innerHTML = "";

    // Realiza la solicitud al servidor
    fetch("../../servidor/?o=listacolecciones&coleccion=" + coleccion)
        .then(response => response.json())
        .then(datos => {
            console.log(datos);

            // Muestra la tabla si estaba oculta
            //tabla.style.display = "block";

            
            datos.forEach(function(){
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