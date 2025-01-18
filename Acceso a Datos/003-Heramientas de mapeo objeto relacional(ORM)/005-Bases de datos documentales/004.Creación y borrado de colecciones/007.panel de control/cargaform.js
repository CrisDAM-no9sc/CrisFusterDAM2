
/// esperamos a que el dom este cargado completamene antes de jecutar el script
document.addEventListener('DOMContentLoaded', async () => {
    // obtenemos los parametros de la URL
    const url = new URLSearchParams(window.location.search);
    const contenedorFormulario = document.getElementById('formularioDinamico');
    const contenedorCamposEstaticos = document.getElementById('camposEstaticos');
    const contenedorCamposDinamicos = document.getElementById('contenedorCamposDinamicos');

    try {
        // Carga el archivo XML indicado por el parámetro "f" en la URL.
        const respuesta = await fetch('modelo/' + url.get('f') + '.xml');
        const textoXml = await respuesta.text();
        /// // Convierte el texto del XML en un documento DOM manipulable.
        const parser = new DOMParser();
        const xml = parser.parseFromString(textoXml, 'application/xml');
        // Selecciona y procesa los campos estáticos del XML.
        const camposEstaticos = xml.querySelectorAll('fields > field');
        camposEstaticos.forEach(campo => {
            //Generamos los campos en el contenedor.
            renderizarCampo(campo, contenedorCamposEstaticos);
        });
        // Selecciona y procesa los grupos de campos dinámicos del XML.
        const gruposCamposDinamicos = xml.querySelectorAll('dynamicFields > fieldGroup');
        gruposCamposDinamicos.forEach(grupoCampo => {
            //generamos los grupos dinamicos 
            renderizarGrupoCampoDinamico(grupoCampo, contenedorCamposDinamicos);
        });
        //manejamos el envio del formulario
        contenedorFormulario.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            //recopilamos los datos de los campos dinamicos 
            const datosEstaticos = {};
            camposEstaticos.forEach(campo => {
                const nombre = campo.querySelector('name').textContent;
                datosEstaticos[nombre] = document.querySelector(`[name="${nombre}"]`).value;
            });

            const datosDinamicos = [];
            contenedorCamposDinamicos.querySelectorAll('.grupo-dinamico').forEach(grupo => {
                const grupoNombre = grupo.getAttribute('data-grupo-nombre');
                const datosGrupo = Array.from(grupo.querySelectorAll('.linea-dinamica')).map(linea => {
                    const datosLinea = {};
                    linea.querySelectorAll('input').forEach(input => {
                        datosLinea[input.name.replace(`${grupoNombre}_`, '')] = input.value;
                    });
                    return datosLinea;
                });
                datosDinamicos.push({ [grupoNombre]: datosGrupo });
            });

            const datosFormulario = {
                datosEstaticos,
                datosDinamicos,
            };

            try {
                const respuesta = await fetch('guardarxml.php?f=' + url.get('f'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosFormulario),
                });

                const resultado = await respuesta.text();
                console.log(resultado);
                alert('Formulario enviado correctamente.');
            } catch (error) {
                console.error('Error:', error);
                alert('Ocurrió un error al enviar el formulario.');
            }
        });
        
    } catch (error) {
        console.error('Error al cargar el XML:', error);
    }

    ////////////////////////////// FUNCION PARA RENDERIZAR UN CAMPO ESTATICO ////////////////////////// 
    function renderizarCampo(campo, contenedor) {
        const nombre = campo.querySelector('name').textContent;
        const tipo = campo.querySelector('type').textContent;
        const marcador = campo.querySelector('placeholder').textContent;
        const obligatorio = campo.querySelector('required').textContent === 'true';

        const entrada = document.createElement('input');
        entrada.type = tipo;
        entrada.name = nombre;
        entrada.placeholder = marcador;
        entrada.required = obligatorio;

        contenedor.appendChild(entrada);
        contenedor.appendChild(document.createElement('br'));
    }
    //////////////////////////////// FUNCION PARA UN GRUPO DINAMICO DE CAMPOS ///////////////////////////////
    function renderizarGrupoCampoDinamico(grupoCampo, contenedor) {
        const nombreGrupo = grupoCampo.getAttribute('name');
        const campos = Array.from(grupoCampo.querySelectorAll('field'));

        const contenedorGrupo = document.createElement('div');
        contenedorGrupo.classList.add('grupo-dinamico');
        contenedor.appendChild(contenedorGrupo);

        const botonAgregarLinea = document.createElement('button');
        botonAgregarLinea.type = 'button';
        botonAgregarLinea.textContent = `+ ${nombreGrupo}`;
        botonAgregarLinea.classList.add('btn-agregar');
        contenedor.appendChild(botonAgregarLinea);

        
        ////////////////////////////////////// FUNCION PARA RENDERIZAR UNA LINEA DINAMICA /////////////////////////

        function renderizarLineaDinamica() {
            const linea = document.createElement('div');
            linea.classList.add('linea-dinamica');
            //////////////////////// CREAMOS LOS CAMPOS DINAMICOS ///////////////////////////////////
            campos.forEach(campo => {
                const nombre = campo.querySelector('name').textContent;
                const tipo = campo.querySelector('type').textContent;
                const marcador = campo.querySelector('placeholder').textContent;
                const obligatorio = campo.querySelector('required').textContent === 'true';

                const entrada = document.createElement('input');
                entrada.type = tipo;
                entrada.name = `${nombreGrupo}_${nombre}`; 
                entrada.placeholder = marcador;
                entrada.required = obligatorio;
                linea.appendChild(entrada);
            });
            ///////////////////////// BOTON PARA ELIMIANR UNA LINEA DINAMICA /////////////////////
            const botonEliminar = document.createElement('button');
            botonEliminar.type = 'button';
            botonEliminar.textContent = '-';
            botonEliminar.classList.add('btn-eliminar');
            botonEliminar.addEventListener('click', () => {
                contenedorGrupo.removeChild(linea);
            });
            linea.appendChild(botonEliminar);

            contenedorGrupo.appendChild(linea);
        }
        // manejamos el evento de agregar una limnea dinamica 
        botonAgregarLinea.addEventListener('click', renderizarLineaDinamica);

        renderizarLineaDinamica();  // Añadir una línea dinámica inicialmente
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////// funcion para  enviar que recarge la pagina //////////////////////
function guardarYRecargar(event) {
    // Aquí puedes agregar más lógica antes de enviar, si es necesario
    event.preventDefault();  // Evitar el comportamiento por defecto del formulario
    alert('Formulario Guardado!');
    window.location.reload(); // Recargar la página al hacer submit
}
//////////////////////////////  PARA ENSEÑAR LA VENTANA MODAL ////////////////////////
function viewContent(filePath) {
    // realizamos una solicitud para obtener el archivo
    fetch(filePath)
        // si va bien nos envia una respuesta exitosa y la convierte en text
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch file content.');
            return response.text();
        })
        // cuando se a cargado el contenido se inderta en contentViewr 
        .then(content => {
            const viewer = document.getElementById('contentViewer');
            viewer.textContent = content;
            const modal = document.getElementById('contentModal');
            modal.style.display = 'flex';
        })
        .catch(error => {
            alert('Error loading file content: ' + error.message);
        });
}
//////////////////////// funcion para cerrar la ventana modal /////////////////
function closeModal() {
    const modal = document.getElementById('contentModal');
    modal.style.display = 'none';
}