/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla) {
    /////////////////////////////////// COMPROBAMOS SI TENEMOS APLICACIONES /////////////////////////////////////////////
    listaaplicaciones = [];

    console.log("Cargando datos para la tabla:", tabla);

    try {
        console.log("Aplicaciones disponibles:", aplicaciones);
        aplicaciones.forEach(function (aplicacion) {
            if (aplicacion.entidad == tabla) {
                console.log("Aplicaciones encontradas:", aplicacion.aplicaciones);
                listaaplicaciones = aplicacion.aplicaciones;
            }
        });
    } catch (error) {
        console.error("Error al cargar las aplicaciones:", error);
    }

    let campoclave;
    /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////

    // Mostrar la tabla si está oculta
    let tablaElement = document.querySelector("table");
    if (!tablaElement) {
        console.error("ERROR: La tabla no existe en el DOM.");
        return;
    }
    tablaElement.style.display = "table";

    // Mostrar la tabla y ocultar los documentos si estaban visibles
    tablaElement.style.display = "table";

    let docsContainer = document.querySelector("#docsContainer");
    if (docsContainer) {
        docsContainer.remove(); // Eliminar documentos cuando se vuelve a mostrar la tabla
    }
    
    // Hacer la petición al servidor para obtener las columnas de la tabla

    fetch("../../servidor/?o=columnastabla&tabla=" + tabla)
    .then(response => response.json())
    .then(datos => {
        console.log("Datos de la tabla recibidos:", datos);
        
        // Comprobación: si la respuesta contiene un error, se detiene
        if (datos.error) {
            console.error("Error en la respuesta:", datos.error);
            alert("Error: " + datos.error);
            return; // Detener la ejecución
        }
        // Comprobación: si la respuesta no es un array, se detiene
        if (!Array.isArray(datos)) {
            console.error("La respuesta no es un array:", datos);
            return;
        }
        
        // Ahora sí, se puede recorrer el array
        let columnas_tabla = [];
        let tipos_tabla = [];
        let claves_tabla = [];
        let campos_busqueda = [];

        let thead = tablaElement.querySelector("thead");
        if (!thead) {
            thead = document.createElement("thead");
            tablaElement.appendChild(thead);
        }

        let cabeceras_tabla = thead.querySelector("tr");
        if (!cabeceras_tabla) {
            cabeceras_tabla = document.createElement("tr");
            thead.appendChild(cabeceras_tabla);
        }
        cabeceras_tabla.innerHTML = "";

        datos.forEach(function (dato) {
            let elemento = document.createElement("th");
            columnas_tabla.push(dato["Field"]);
            elemento.textContent = dato["Field"];

            // Crear input de búsqueda para cada columna
            let inputBusqueda = document.createElement("input");
            inputBusqueda.setAttribute("placeholder", dato["Field"]);
            inputBusqueda.setAttribute("type", convierteTipoDato(dato["Type"]));

            campos_busqueda.push(inputBusqueda);
            claves_tabla.push(dato["Key"]);
            tipos_tabla.push(convierteTipoDato(dato["Type"]));

            elemento.appendChild(inputBusqueda);
            cabeceras_tabla.appendChild(elemento);

            if (dato["Key"] == "PRI") {
                campoclave = dato["Field"];
            }
        });
            //////////////// AQUI AGREGAMOS LA COLUMNAS DE APLICACIONES //////////////////
            if (listaaplicaciones.length > 0) {
                let elemento = document.createElement("th");
                elemento.textContent = "APPS";
                cabeceras_tabla.appendChild(elemento);
            }

            ////////////////// AQUI AGREGAMOS LA COLUMNA DE BÚSQUEDA //////////////////
            let elemento = document.createElement("th");
            elemento.innerHTML = "<span class='boton botonlupa'><img src='../img/lupa.png'></span>";
            cabeceras_tabla.appendChild(elemento);

            elemento.onclick = function () {
                let mensaje = {};
                campos_busqueda.forEach(function (campo) {
                    let columna = campo.getAttribute("placeholder");
                    let valor = campo.value;
                    if (valor != "") {
                        mensaje[columna] = valor;
                    }
                });

                fetch("../../servidor/?o=buscarSimilar&tabla=" + tabla, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mensaje),
                })
                    .then(response => response.json())
                    .then(datos => {
                        pueblaTabla(datos, campoclave);
                    });
            };

            /////////////////////////////////// FORMULARIO DE INSERCIÓN /////////////////////////////////////////////
            let coleccioncampos = [];

            let contiene_modal = document.querySelector("#contienemodal");
            contiene_modal.innerHTML = "<h1>Formulario de inserción: " + tabla + "</h1>";

            let seccion = document.createElement("section");
            columnas_tabla.forEach(function (columna, index) {
                let contenedor = document.createElement("div");
                let texto = document.createElement("p");
                texto.textContent = "Inserta un nuevo elemento para: " + columna;
                contenedor.appendChild(texto);

                if (claves_tabla[index] != "MUL") {
                    if (tipos_tabla[index] == "textarea") {
                        coleccioncampos.push(document.createElement("textarea"));
                    } else {
                        coleccioncampos.push(document.createElement("input"));
                    }
                    coleccioncampos[coleccioncampos.length - 1].setAttribute("type", tipos_tabla[index]);
                    coleccioncampos[coleccioncampos.length - 1].setAttribute("placeholder", columna);
                    contenedor.appendChild(coleccioncampos[coleccioncampos.length - 1]);

                } else {
                    let selectElement = document.createElement("select");
                    coleccioncampos.push(selectElement);
                    let defaultOption = document.createElement("option");
                    defaultOption.textContent = "Selecciona una opción:";
                    selectElement.appendChild(defaultOption);
                    fetchOptionsForSelect(selectElement, columna);
                    selectElement.setAttribute("placeholder", columna);
                    contenedor.appendChild(selectElement);
                    selectjv(selectElement);
                }

                seccion.appendChild(contenedor);
            });

            contiene_modal.appendChild(seccion);

            let boton_enviar = document.createElement("button");
            boton_enviar.textContent = "Enviar";
            boton_enviar.onclick = function () {
                console.log("Procesando formulario...");
                let mensaje = {};
                coleccioncampos.forEach(function (campo) {
                    if (campo.getAttribute('placeholder') != "Identificador") {
                        mensaje[campo.getAttribute('placeholder')] = campo.value;
                    }
                });

                fetch("../../servidor/?o=insertar&tabla=" + tabla, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mensaje),
                })
                    .then(response => response.text())
                    .then(datos => {
                        console.log("Respuesta del servidor:", datos);
                        document.querySelector("#modal").classList.remove("aparece");
                        document.querySelector("#modal").classList.add("desaparece");
                        setTimeout(function () {
                            document.querySelector("#modal").style.display = "none";
                        }, 1000);
                    });
            };

            contiene_modal.appendChild(boton_enviar);

            /////////////////////////////////// CARGAR CONTENIDO DE LA TABLA /////////////////////////////////////////////

                fetch("../../servidor/?o=tabla&tabla=" + tabla)
                    .then(response => response.json())
                    .then(datos => {
                        console.log("Datos de la colección recibidos:", datos);
                        if (datos.error) {
                            console.error("Error en la respuesta:", datos.error);
                            alert("Error: " + datos.error);
                            return;
                        }
                        pueblaTabla(datos, campoclave, tabla, listaaplicaciones);
                    })
                    .catch(error => {
                        console.error("Error al cargar los datos de la colección:", error);
                    });
            })
            .catch(error => {
                console.error("Error al cargar las columnas de la tabla:", error);
            });
}

  
  /////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////


function fetchOptionsForSelect(selectElement, column) {
    fetch("../../servidor/?o=tabla&tabla=" + column.split("_")[0])
        .then(response => response.json())
        .then(datos => {
            // Verifica si se devolvió un error
            if (datos.error) {
                console.error("Error en fetchOptionsForSelect:", datos.error);
                alert("Error: " + datos.error);
                return;
            }
            // Verifica que datos sea un array
            if (!Array.isArray(datos)) {
                console.error("La respuesta no es un array:", datos);
                return;
            }
            datos.forEach(function(dato) {
                let option = document.createElement("option");
                option.value = dato['Identificador'];
                option.textContent = Object.values(dato).join(' - ');
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar opciones:", error);
        });
}