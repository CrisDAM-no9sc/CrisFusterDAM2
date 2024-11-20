window.onload = function() {
    fetch("../../servidor/aplicaciones.php") // LLamo a un microservicio que me da la lista de aplicaciones
        .then(response => {
            return response.json(); // Quiero que el servidor me devuelva un json
        })
        .then(data => {
            const plantilla = document.getElementById('plantilla_aplicacion'); // Cargo el template HTML como una plantilla en memoria
            console.log(data); // Vomito el json en pantalla
            data.forEach(function(elemento) { // Para cada uno de los elementos que vienen en el json de la base de datos
                console.log(elemento); // Comprobar que el elemento funciona
                const instancia = plantilla.content.cloneNode(true); // Creo una nueva instancia de la clase
                const nombre = instancia.querySelector('p'); // Selecciono a uno de los elementos
                nombre.innerHTML = elemento.nombre; // Y le pongo el contenido que saco del json
                const imagen = instancia.querySelector("img");
                imagen.setAttribute("src", "img/" + elemento.icono); // Actualizo el src de la imagen
                document.querySelector('main').appendChild(instancia); // Coloco la instancia en el árbol HTML
            });
            
            let aplicaciones = document.querySelectorAll(".aplicacion"); // Selecciono todas las aplicaciones
            aplicaciones.forEach(function(aplicacion) { // Para cada una de las aplicaciones
                aplicacion.onclick = function() { // Cuando haga clic en esa aplicación
                    window.location = "../supercontrolador/"; // Redirecciona
                }
            });
        })
        .catch(error => console.error('Error fetching applications:', error)); // Manejo de errores
}