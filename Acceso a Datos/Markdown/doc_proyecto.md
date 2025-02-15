# Estructura del Proyecto

_Documento generado el 2025-02-15 10:41:59_

- **096.implemnetar mejora en vistaTabla/**
    - **api/**
        - formulario.html
        - index.php
        - ip.php
        - **inc/**
            - damepedidos.php
            - error.php
            - insertarCliente.php
    - **cliente/**
        - estilologin.css
        - index.php
        - login.js
        - **analisis/**
            - cosigo.js
            - estilo.css
            - index.html
        - **aplicaciones/**
            - **cms/**
            - **crm/**
        - **escritorio/**
            - comportamiento.js
            - estilo.css
            - index.html
            - **img/**
                - cerrar_sesion.png
                - icono.png
                - logo.png
        - **img/**
            - aplicacioenes.png
            - clientes.png
            - documento.png
            - eliminar.png
            - icnotabla.png
            - icono.png
            - iconodocumento.png
            - informe.png
            - listapedidos.png
            - lupa.png
            - nombrecliente.png
            - pedidos.png
            - productos.png
            - usuarios.png
        - **include/**
            - idiomas.php
        - **supercontrolador/**
            - comportamiento.js
            - estilo.css
            - index.php
            - **apps/**
                - apps.json
                - **clientes/**
                    - **ficha_clientes/**
                        - index.html
                    - **historico_compra/**
                        - index.html
                - **pedidos/**
                    - **detalle_pedido/**
                        - index.html
            - **ayuda/**
                - index.php
                - **docs/**
                    - 003.Preguntas Frecuentes.html
            - **img/**
                - icono.png
                - iconoconsola.png
                - informe.png
            - **js/**
                - cargaDatosTabla.js
                - cargarDatosColeccion.js
                - convierteTipoDato.js
                - crearMenuTablas.js
                - funciones.js
                - pueblaTabla.js
            - **lib/**
                - **ampliador/**
                    - ampliador.css
                    - ampliador.js
                - **graficos/**
                    - graficos.js
                - **selectjv/**
                    - selectjv.css
                    - selectjv.js
                - **textEditor/**
                    - TextEditor.css
                    - TextEditor.js
                - **tooltip/**
                    - tooltip.css
                    - tooltip.js
                - **vistaTabla/**
                    - vistaTabla.css
                    - vistaTabla.js
            - **modulos/**
                - **cabecera/**
                    - cabecera.css
                    - cabecera.js
                    - cabecera.php
                - **cierre/**
                    - cierre.css
                    - cierre.php
                - **librerias/**
                    - librerias.php
                - **modal/**
                    - modal.css
                    - modal.js
                    - modal.php
                - **principal/**
                    - principal.css
                    - principal.js
                    - principal.php
        - **traductor/**
            - en.json
            - es.json
    - **documentación/**
        - diagrama cliente_servidor.odg
        - diagrama.odg
    - **formularios/**
        - envia.php
        - estilo.css
        - index.php
        - panel.php
        - vista.php
        - **documentos/**
            - 1738667300.json
            - 1738667456.json
            - 1738668266.json
        - **forms/**
            - cliente.json
            - productos.json
            - registro.json
        - **lib/**
            - **validadorForm/**
                - validadorForm.css
                - validadorForm.js
    - **public/**
        - index.php
    - **servidor/**
        - ConectorMongoDB.php
        - conexionDB.php
        - index.php
        - **antiguo/**
            - columnas_tabla.php
            - datos_tabla.php
            - eliminar_dato.php
            - insertar.php
            - lista_aplicaciones.php
            - lista_tablas.php
            - loginusuario.php
        - **lib/**
            - codificador.php
            - fuerza_bruta.php
            - registros.php
            - sanear.php

# Documentación de Archivos

## Índice
- [api\formulario.html](#archivo_1-api-formulario.html)
- [api\inc\damepedidos.php](#archivo_2-api-inc-damepedidos.php)
- [api\inc\insertarCliente.php](#archivo_3-api-inc-insertarcliente.php)
- [cliente\estilologin.css](#archivo_4-cliente-estilologin.css)
- [cliente\login.js](#archivo_5-cliente-login.js)
- [cliente\analisis\cosigo.js](#archivo_6-cliente-analisis-cosigo.js)
- [cliente\analisis\estilo.css](#archivo_7-cliente-analisis-estilo.css)
- [cliente\analisis\index.html](#archivo_8-cliente-analisis-index.html)
- [cliente\escritorio\comportamiento.js](#archivo_9-cliente-escritorio-comportamiento.js)
- [cliente\escritorio\estilo.css](#archivo_10-cliente-escritorio-estilo.css)
- [cliente\supercontrolador\comportamiento.js](#archivo_11-cliente-supercontrolador-comportamiento.js)
- [cliente\supercontrolador\estilo.css](#archivo_12-cliente-supercontrolador-estilo.css)
- [cliente\supercontrolador\index.php](#archivo_13-cliente-supercontrolador-index.php)
- [cliente\supercontrolador\ayuda\index.php](#archivo_14-cliente-supercontrolador-ayuda-index.php)
- [cliente\supercontrolador\ayuda\docs\003.Preguntas Frecuentes.html](#archivo_15-cliente-supercontrolador-ayuda-docs-003.preguntas-frecuentes.html)
- [cliente\supercontrolador\js\cargaDatosTabla.js](#archivo_16-cliente-supercontrolador-js-cargadatostabla.js)
- [cliente\supercontrolador\js\cargarDatosColeccion.js](#archivo_17-cliente-supercontrolador-js-cargardatoscoleccion.js)
- [cliente\supercontrolador\js\convierteTipoDato.js](#archivo_18-cliente-supercontrolador-js-conviertetipodato.js)
- [cliente\supercontrolador\js\crearMenuTablas.js](#archivo_19-cliente-supercontrolador-js-crearmenutablas.js)
- [cliente\supercontrolador\js\pueblaTabla.js](#archivo_20-cliente-supercontrolador-js-pueblatabla.js)
- [cliente\supercontrolador\lib\ampliador\ampliador.css](#archivo_21-cliente-supercontrolador-lib-ampliador-ampliador.css)
- [cliente\supercontrolador\lib\ampliador\ampliador.js](#archivo_22-cliente-supercontrolador-lib-ampliador-ampliador.js)
- [cliente\supercontrolador\lib\graficos\graficos.js](#archivo_23-cliente-supercontrolador-lib-graficos-graficos.js)
- [cliente\supercontrolador\lib\selectjv\selectjv.css](#archivo_24-cliente-supercontrolador-lib-selectjv-selectjv.css)
- [cliente\supercontrolador\lib\selectjv\selectjv.js](#archivo_25-cliente-supercontrolador-lib-selectjv-selectjv.js)
- [cliente\supercontrolador\lib\textEditor\TextEditor.css](#archivo_26-cliente-supercontrolador-lib-texteditor-texteditor.css)
- [cliente\supercontrolador\lib\textEditor\TextEditor.js](#archivo_27-cliente-supercontrolador-lib-texteditor-texteditor.js)
- [cliente\supercontrolador\lib\tooltip\tooltip.css](#archivo_28-cliente-supercontrolador-lib-tooltip-tooltip.css)
- [cliente\supercontrolador\lib\tooltip\tooltip.js](#archivo_29-cliente-supercontrolador-lib-tooltip-tooltip.js)
- [cliente\supercontrolador\lib\vistaTabla\vistaTabla.css](#archivo_30-cliente-supercontrolador-lib-vistatabla-vistatabla.css)
- [cliente\supercontrolador\lib\vistaTabla\vistaTabla.js](#archivo_31-cliente-supercontrolador-lib-vistatabla-vistatabla.js)
- [cliente\supercontrolador\modulos\cabecera\cabecera.css](#archivo_32-cliente-supercontrolador-modulos-cabecera-cabecera.css)
- [cliente\supercontrolador\modulos\cabecera\cabecera.js](#archivo_33-cliente-supercontrolador-modulos-cabecera-cabecera.js)
- [cliente\supercontrolador\modulos\cierre\cierre.css](#archivo_34-cliente-supercontrolador-modulos-cierre-cierre.css)
- [cliente\supercontrolador\modulos\modal\modal.css](#archivo_35-cliente-supercontrolador-modulos-modal-modal.css)
- [cliente\supercontrolador\modulos\modal\modal.js](#archivo_36-cliente-supercontrolador-modulos-modal-modal.js)
- [cliente\supercontrolador\modulos\principal\principal.css](#archivo_37-cliente-supercontrolador-modulos-principal-principal.css)
- [cliente\supercontrolador\modulos\principal\principal.js](#archivo_38-cliente-supercontrolador-modulos-principal-principal.js)
- [formularios\envia.php](#archivo_39-formularios-envia.php)
- [formularios\estilo.css](#archivo_40-formularios-estilo.css)
- [formularios\index.php](#archivo_41-formularios-index.php)
- [formularios\panel.php](#archivo_42-formularios-panel.php)
- [formularios\lib\validadorForm\validadorForm.css](#archivo_43-formularios-lib-validadorform-validadorform.css)
- [formularios\lib\validadorForm\validadorForm.js](#archivo_44-formularios-lib-validadorform-validadorform.js)
- [public\index.php](#archivo_45-public-index.php)
- [servidor\ConectorMongoDB.php](#archivo_46-servidor-conectormongodb.php)
- [servidor\conexionDB.php](#archivo_47-servidor-conexiondb.php)
- [servidor\index.php](#archivo_48-servidor-index.php)
- [servidor\antiguo\insertar.php](#archivo_49-servidor-antiguo-insertar.php)
- [servidor\lib\codificador.php](#archivo_50-servidor-lib-codificador.php)
- [servidor\lib\fuerza_bruta.php](#archivo_51-servidor-lib-fuerza_bruta.php)
- [servidor\lib\registros.php](#archivo_52-servidor-lib-registros.php)

## api\formulario.html
<a name="archivo_1-api-formulario.html"></a>

```
cuando el usuario rellena los datos del formulario al apretar el boton de enviar esos datos se pasaran al archivo de api
para que sean procesados e insertados en la base de datos
```

## api\inc\damepedidos.php
<a name="archivo_2-api-inc-damepedidos.php"></a>

```
/es un archivo con la lógica para consultar los pedidos de los clientes y organizarlos en formato JSON.
Definimos la consulta SQL que vamos a ejecutar
Construir la estructura JSON
Reorganizar el array para eliminar índices de cliente y pedidos
```

## api\inc\insertarCliente.php
<a name="archivo_3-api-inc-insertarcliente.php"></a>

```
Si estás trabajando en un entorno local, puede ser tanto IPv4 como IPv6
Si la IP coincide, continuamos con la inserción
if($_SERVER['SERVER_ADDR'] == "192.168.0.22"){}
/////////////// AQUI VAMOS APONER LA LOGICA DE INSERTAR ////////////
```

## cliente\estilologin.css
<a name="archivo_4-cliente-estilologin.css"></a>

```
Estilo General del Cuerpo
Fondo verde claro suave
Altura completa de la ventana
Texto principal en azul oscuro
Contenedor del Formulario de Login
Fondo azul claro
Esquinas redondeadas
Sombra para profundidad
Texto en azul oscuro
Logo
Campos de Entrada y Botón
Borde verde azulado medio
Esquinas redondeadas
Campos de Entrada
Fondo blanco para los inputs
Texto azul oscuro
Borde azul oscuro al enfocar
Estilo del Botón
Verde azulado medio
Texto blanco
Color azul oscuro al pasar el cursor
Mensaje de error o comentarios
Se puede modificar dependiendo del mensaje
Responsividad para Dispositivos Móviles
```

## cliente\login.js
<a name="archivo_5-cliente-login.js"></a>

```
////////////////////////// ACCEDER A TRADUCTORES DINAMICAMENTE //////////////////////////
Cargar las traducciones basadas en el idioma del navegador
Actualizar el placeholder del campo de usuario
Actualizar el placeholder del campo de contraseña
Actualizar el texto del botón de login
Usar valores predeterminados en caso de error
Cuando hagamos click se ejecutará esta función
Obtenemos el valor (texto) que ingresamos
Obtenemos el valor de la contraseña que hemos ingresado
Creamos un objeto JSON con las propiedades de usuario y contraseña
Iniciamos una solicitud fetch para enviar al servidor
Convertimos el objeto en una cadena JSON
Verificamos si la respuesta es exitosa
Comprobamos si la longitud del array es mayor a 0, significando que el servidor encontró un usuario que coincide
Guardamos el nombre del usuario en el local del navegador
Muestra el toast con el mensaje de error
```

## cliente\analisis\cosigo.js
<a name="archivo_6-cliente-analisis-cosigo.js"></a>

```
Obtiene la lista de tablas desde el servidor
*
   * Rellena el elemento select con las opciones de tablas.
   * @param {Array} tablas - Array con la información de las tablas.
*
   * Obtiene las columnas de la tabla seleccionada.
   * @param {string} nombreTabla - Nombre de la tabla.
*
   * Muestra los checkboxes correspondientes a cada columna.
   * @param {Array} columnas - Array con las columnas.
Realiza la búsqueda de datos en base a la tabla y campos seleccionados
*
   * Muestra los resultados de la búsqueda en una tabla y añade opciones de descarga.
   * @param {Array} resultados - Array de objetos con los resultados.
   * @param {Array} camposSeleccionados - Campos que se muestran.
Descarga los resultados mostrados en la tabla en formato CSV
*
   * Descarga los resultados mostrados en la tabla en formato PDF.
   * Requiere que jsPDF y autoTable estén incluidos en tu proyecto.
*
   * Crea los botones de descarga (CSV y PDF) y los agrega al contenedor de descargas.
///////////////////// FUNCIONES PARA LISTAR LAS TABLAS  /////////////////////////////
Reiniciamos el select con la opción por defecto.
//////////////////////// FUNCIONES PARA OBTENER Y MOSTRAR LAS COLUMNAS DE LA TABLA /////////////////////////////
///////////// FUNCIONES PARA REALIZAR LA BÚSQUEDA Y MOSTRAR RESULTADOS ////////////////////////////
Validar que se haya seleccionado al menos un campo
Crear la tabla de resultados
Crear encabezado de la tabla
Crear filas con los datos
Crear opciones de descarga (CSV y PDF)
Limpiar contenedor de descargas si no hay resultados
//////////////// FUNCIONES PARA DESCARGAR RESULTADOS (CSV Y PDF) //////////////////////////////
Usamos autoTable para convertir la tabla a PDF
Botón para descargar CSV
Botón para descargar PDF
///////////////////// INICIALIZACIÓN Y ASIGNACIÓN DE EVENTOS  ////////////////////////////
Cargar las tablas al iniciar la página
Cuando se cambia la tabla seleccionada, cargar sus columnas
Asignar el evento al botón de búsqueda
```

## cliente\analisis\estilo.css
<a name="archivo_7-cliente-analisis-estilo.css"></a>

```
********************** ESTILOS PARA EL CONTENEDOR *********************
Ajuste para pantallas grandes
Añadir margen entre selección y resultados
Estilo para la sección de selección
Estilo para la sección de resultados
Estilo del iframe dentro de los resultados
********************** ESTILOS PARA EL SELECT *********************
Efecto al pasar el mouse sobre el select
Estilo para las opciones
Estilo al seleccionar una opción
********************** ESTILOS PARA LOS CAMPOS *********************
Estilo para los labels y checkboxes
********************** ESTILOS PARA EL BOTÓN *********************
Estilo del botón Mostrar Resultados
Cambio de color de fondo
Efecto de elevación
Sombra
Cambio de color de fondo al hacer clic
Revertir la elevación
Sombra reducida
********************** ESTILOS DE LOS RESULTADOS *********************
Ancho completo
Eliminar espacios entre bordes
Espaciado superior
Sombra alrededor de la tabla
Bordes redondeados
Ocultar desbordamientos
Color de fondo de los encabezados
Color del texto de los encabezados
Espaciado interno
Alineación del texto
Tamaño de fuente
Línea divisoria
Espaciado interno
Tamaño de fuente
Color del texto
Color de fondo para filas pares
********************** ESTILOS RESPONSIVE *********************
Ajustar el botón para pantallas medianas
Para móviles
Ajustes para el botón en móviles
Ajustes para la tabla en móviles
Botones de descarga (CSV y PDF)
```

## cliente\analisis\index.html
<a name="archivo_8-cliente-analisis-index.html"></a>

```
Opciones dinámicas
Checkboxes generados dinámicamente
Mover el botón dentro del contenedor .seleccion
Resultados de la búsqueda
Botones de descarga CSV y PDF se agregarán aquí
```

## cliente\escritorio\comportamiento.js
<a name="archivo_9-cliente-escritorio-comportamiento.js"></a>

```
Token válido
LLamo a un microservicio que me da la lista de aplicaciones
Quiero que el servidor me devuelva un json
Cargo el template HTML como una plantilla en memoria (como un class)
Vomito el json en pantalla
Para cada uno de los elementos que vienen en el json de la base de datos
Pongo el elemento en pantalla simplemente para comprobar que funciona
Creo  una nueva instancia de la clase (como un instancia)
Dentro de la plantilla selecciono a uno de los elementos
Y le pongo el contenido que saco del json
Por ultimo realmente pongo la instancia en el arbol html
Selecciono todas las aplicaciones y las pongo en un array
Para cada una de las aplicaciones
Cuando haga click en esa aplicacion
```

## cliente\escritorio\estilo.css
<a name="archivo_10-cliente-escritorio-estilo.css"></a>

```
Estilo global
Fondo general verde claro
Texto principal en azul oscuro
Estilo del header
Verde azulado medio
Texto en azul claro
Línea azul oscuro
Sombra sutil
Contenedor Principal (Main)
Estilo para las Tarjetas (Aplicaciones)
Borde sutil
Para alinear imagen y texto
Mayor opacidad para mejor visibilidad
Verde azulado medio
Texto en azul claro
Esquinas más redondeadas
Sombra ligera
Espacio interno
Efecto hover en las tarjetas
Total visibilidad al hacer hover
Leve aumento al hacer hover
Sombra más pronunciada
Cambia a azul oscuro en hover
Estilo para la imagen dentro de las tarjetas
Tamaño del icono
Espacio entre la imagen y el texto
Texto en las tarjetas
Responsividad para pantallas más pequeñas
```

## cliente\supercontrolador\comportamiento.js
<a name="archivo_11-cliente-supercontrolador-comportamiento.js"></a>

```
Desde el módulo de cabecera
Obtenemos la aplicación seleccionada
Desde el módulo principal
```

## cliente\supercontrolador\estilo.css
<a name="archivo_12-cliente-supercontrolador-estilo.css"></a>

```
Estilo global
Fondo general verde claro
Texto principal en azul oscuro
```

## cliente\supercontrolador\index.php
<a name="archivo_13-cliente-supercontrolador-index.php"></a>

```
include __DIR__ . "/modulos/cabecera/cabecera.php";
  include __DIR__ . "/modulos/principal/principal.php";
  include __DIR__ . "/modulos/modal/modal.php";
  include __DIR__ . "/modulos/librerias/librerias.php";
  include __DIR__ . "/modulos/cierre/cierre.php";
```

## cliente\supercontrolador\ayuda\index.php
<a name="archivo_14-cliente-supercontrolador-ayuda-index.php"></a>

```
Función para recorrer y mostrar carpetas y archivos
Función auxiliar para escanear recursivamente las carpetas
Saltar los punteros de directorio actual y padre
Iniciar el escaneo desde la carpeta raíz proporcionada
Uso del script con la ruta de la carpeta 'docs'
```

## cliente\supercontrolador\ayuda\docs\003.Preguntas Frecuentes.html
<a name="archivo_15-cliente-supercontrolador-ayuda-docs-003.preguntas-frecuentes.html"></a>

```
Índice de navegación
Sección 2
✅ Sección 3
✅ Sección 4
```

## cliente\supercontrolador\js\cargaDatosTabla.js
<a name="archivo_16-cliente-supercontrolador-js-cargadatostabla.js"></a>

```
///////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////
///////////////////////////////// COMPROBAMOS SI TENEMOS APLICACIONES /////////////////////////////////////////////
///////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
Mostrar la tabla si está oculta
Mostrar la tabla y ocultar los documentos si estaban visibles
Hacer la petición al servidor para obtener las columnas de la tabla
Comprobación: si la respuesta contiene un error, se detiene
Comprobación: si la respuesta no es un array, se detiene
Ahora sí, se puede recorrer el array
Crear input de búsqueda para cada columna
////////////// AQUI AGREGAMOS LA COLUMNAS DE APLICACIONES //////////////////
//////////////// AQUI AGREGAMOS LA COLUMNA DE BÚSQUEDA //////////////////
///////////////////////////////// FORMULARIO DE INSERCIÓN /////////////////////////////////////////////
///////////////////////////////// CARGAR CONTENIDO DE LA TABLA /////////////////////////////////////////////
///////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////
Verifica si se devolvió un error
Verifica que datos sea un array
```

## cliente\supercontrolador\js\cargarDatosColeccion.js
<a name="archivo_17-cliente-supercontrolador-js-cargardatoscoleccion.js"></a>

```
Ocultar la tabla antes de mostrar los documentos
Obtener la sección donde se mostrarán los documentos
Eliminar contenido previo antes de cargar los nuevos documentos
Crear un nuevo contenedor para los documentos
Agregar el contenedor a la sección principal
Realizar la solicitud al servidor para obtener los documentos de la colección
Si no hay documentos, mostrar un mensaje
Generar las tarjetas de documentos dinámicamente
//////////////////////////////// funcion para elimiar datos /////////////////////////////////
///////////////////////////////// FUNCION CONVERTIR JSON EN HTML ///////////////////////////
Función recursiva para convertir JSON en HTML
Manejar arrays
Manejar objetos
```

## cliente\supercontrolador\js\convierteTipoDato.js
<a name="archivo_18-cliente-supercontrolador-js-conviertetipodato.js"></a>

```
------------------------- CONFIGURACIÓN DINAMICA  --------------------------//
aqui estamos haciendo que en cada casilla contyenga el datos que le corresponde
si la columna es varchar, el input sera del tipo text
si es date, sera un selector de fecha
si es date, sera un selector de fecha
```

## cliente\supercontrolador\js\crearMenuTablas.js
<a name="archivo_19-cliente-supercontrolador-js-crearmenutablas.js"></a>

```
////////////////////////////////////////////////////////////////////////////////////////////
para evitar duplicados
////////////////////////////////////////////////////////////////////////////////////////////
Verificamos si 'datos' es un array antes de iterar
```

## cliente\supercontrolador\js\pueblaTabla.js
<a name="archivo_20-cliente-supercontrolador-js-pueblatabla.js"></a>

```
console.log("Datos recibidos en pueblaTabla:", datos);
Comprueba si la respuesta contiene un error
Verifica que datos sea un array
Obtener la tabla y su <tbody>
Limpiar el contenido previo del tbody
Recorrer los datos y crear una fila para cada registro
Recorrer cada propiedad del registro para crear sus celdas
Hacer la celda editable al doble clic
Al perder el foco, desactivar la edición y enviar la actualización al servidor
Agregar columna de aplicaciones si la lista no está vacía
GENERAMOS BOTÓN ELIMINAR
GENERAMOS BOTÓN INFORME
Se asigna el atributo 'claveprimaria' para identificar el registro
Limpiar el contenido de la sección y renderizar la nueva tabla con la función 'renderizarTabla'
Agregar la fila completa al tbody de la tabla
```

## cliente\supercontrolador\lib\ampliador\ampliador.css
<a name="archivo_21-cliente-supercontrolador-lib-ampliador-ampliador.css"></a>

```
Estilo de la Página General
Estilo General del Contenedor
Esquinas redondeadas
Asegura que siempre esté encima
Estilo de los Botones
Forma circular
Botones más pequeños
Anchura fija
Altura fija
Texto ajustado
Botón Activo
Restablecer escala al hacer clic
```

## cliente\supercontrolador\lib\ampliador\ampliador.js
<a name="archivo_22-cliente-supercontrolador-lib-ampliador-ampliador.js"></a>

```
/////////////////////////////// FUENTE ///////////////////////////////
/////////////////////////////// AUMENTAR ///////////////////////////////
/para añadir el efecto de disminuir cuando le damos al bioton de +
/////////////////////////////// CONTRATSE ///////////////////////////////
/////////////////////////////// INVERTIR CONTRATSE ///////////////////////////////
/////////////////////////////// DISMINUIR ///////////////////////////////
/para añadir el efecto de disminuir cuando le damos al bioton de -
/////////////////////////////// RESTABLECER ///////////////////////////////
/////////////////////////////// AÑADIR AL DOCUMENTO ///////////////////////////////
```

## cliente\supercontrolador\lib\graficos\graficos.js
<a name="archivo_23-cliente-supercontrolador-lib-graficos-graficos.js"></a>

```
Dibujar la porción del gráfico
Calcular el ángulo medio para posicionar el texto
Calcular la posición del texto
Guardar el estado del contexto antes de rotar
Trasladar y rotar el contexto
Dibujar el texto principal (nombre del dato)
Dibujar el porcentaje debajo del texto principal
Restaurar el estado original del contexto
Actualizar el ángulo de inicio para la siguiente porción
Dibujar el círculo central
Dibujar el título
Método para generar un gráfico de barras
Dimensiones del gráfico
Crear el lienzo
Obtener el contexto 2D
Añadir el lienzo al contenedor
Calcular valores de referencia
Dibujar cada barra
Altura proporcional de la barra
Posición de la barra
Colores aleatorios para cada barra
Dibujar barra
Dibujar etiquetas
Método para convertir un color hexadecimal a RGB
```

## cliente\supercontrolador\lib\selectjv\selectjv.css
<a name="archivo_24-cliente-supercontrolador-lib-selectjv-selectjv.css"></a>

```
box-shadow:0px 2px 4px rgba(0,0,0,0.3) inset;
```

## cliente\supercontrolador\lib\selectjv\selectjv.js
<a name="archivo_25-cliente-supercontrolador-lib-selectjv-selectjv.js"></a>

```
Definir contenedores correctamente
////////////////// CREACION DEL CONTENEDOR PARA EL SELECT ///////////////
Creo un div
Le asigno la clase
Esta funcion se ejecuta cuando se hace click dentro del contenedor, evita que se propague a otros elementos padres
Útil para manejar la visibilidad de los elementos relacionados como una lista de resultados
Reemplazo el select original con el nuevo div
El select ahora será parte del nuevo contenedor
////////////////////// VISUALIZACION DE LAS OPCIONES ////////////////////
Creo una nueva caja
Le asigno como texto, el de la primera opción
Agrego el div.caja y el select al contenedor original
Al hacer click en la caja
----------------- CREACION DE LAS OPTION DEL SELECT -------------//
Creo un nuevo contenedor para los resultados
Creo un campo de búsqueda
------------------ FILTRADO DE LAS OPCIONES -------------//
Creo un contenedor intermedio para las opciones filtradas
Selecciono todas las opciones del select original
Recorro todas las opciones y las agrego a los resultados
------------------------- FILTRAMOS LAS OPCIONES ---------------------------//
Se ejecutará cada vez que el usuario escriba algo en el campo de búsqueda
Cojo el valor escrito
Vacío el contenedor de resultados antes de agregar las nuevas opciones
Si el texto de la opción coincide con lo que se está buscando (sin importar mayúsculas/minúsculas)
Al hacer click en una opción filtrada
----------------- CERRAR LA LISTA DE OPCIONES --------------//
Cuando hago click en cualquier parte del documento
Elimino la lista de opciones y la clase radio de la caja
```

## cliente\supercontrolador\lib\textEditor\TextEditor.css
<a name="archivo_26-cliente-supercontrolador-lib-texteditor-texteditor.css"></a>

```
Fondo gris muy claro, casi blanco
Borde sutil con baja opacidad
Elimina el contorno por defecto
Fondo gris muy suave, casi blanco
Borde sutil con baja opacidad
Alinear los botones horizontalmente
Bordes redondeados para un diseño más suave
Flexbox para centrar el contenido
Centrar horizontalmente
Centrar verticalmente
Espaciado entre elementos
Fondo más oscuro al pasar el cursor
Fondo gris muy claro
```

## cliente\supercontrolador\lib\textEditor\TextEditor.js
<a name="archivo_27-cliente-supercontrolador-lib-texteditor-texteditor.js"></a>

```
Enumeramos los elementos textarea
Indicamos cuántos tenemos
Creamos un contenedor para los textos
////////////////// Creamos un div que va a ser el contenedor de los botones /////////////
//////////////// Botón de negrita ///////////////////////
//////////////// Botón de cursiva ///////////////////////
//////////////// Botón de subrayado ///////////////////////
//////////////// Botón para color ///////////////////////
//////////////// Botón Pra el Tamaño de la fuente  ///////////////////////
////////////////// Selector de Fuente /////////////////////
////////////////////// PARA HACER LISTAS  //////////////////////////
////////////////// ALINEACION DE TEXTO ////////////////////////////
Botón de alineación a la izquierda
Botón de alineación al centro
Botón de alineación a la derecha
///////////////// Creamos el "textarea" editable ///////////////////
////////////////// PARA HACER LISTAS  /////////////////
/////////////// Función para aplicar la alineación de texto////////////
////////////////// Funcion actualizar //////////////////////
////////////////// Función para reemplazar con etiquetas ////////////////////////
Si el argumento es "color", aplica el color seleccionado
Si el argumento es "font-size", aplica el tamaño de la fuente
Si el argumento es "font-family", aplica la fuente seleccionada
Si no es un color ni tamaño, aplica el estilo de la etiqueta correspondiente (b, i, u)
```

## cliente\supercontrolador\lib\tooltip\tooltip.css
<a name="archivo_28-cliente-supercontrolador-lib-tooltip-tooltip.css"></a>

```
Asegúrate de tener esto
Opcional: para darle un poco de espacio interno
Opcional: para bordes redondeados
```

## cliente\supercontrolador\lib\tooltip\tooltip.js
<a name="archivo_29-cliente-supercontrolador-lib-tooltip-tooltip.js"></a>

```
Actualizamos la posición del tooltip
```

## cliente\supercontrolador\lib\vistaTabla\vistaTabla.css
<a name="archivo_30-cliente-supercontrolador-lib-vistatabla-vistatabla.css"></a>

```
Asegura que se muestre arriba de la tabla
Fondo blanco para resaltarlo
Texto oscuro
Cabecera con el color más intenso de la paleta
Filas del cuerpo
Filas alternas para mejorar la legibilidad
Efecto hover para resaltar la fila
```

## cliente\supercontrolador\lib\vistaTabla\vistaTabla.js
<a name="archivo_31-cliente-supercontrolador-lib-vistatabla-vistatabla.js"></a>

```
Función que configura la tabla, la ordena y la actualiza
Recorremos las cabeceras y asignamos los eventos de ordenación
Evento click para ordenar
Ordenamos el contenido
Extraemos el contenido de la tabla y lo almacenamos en `contenido`
Función para poblar la tabla con los datos almacenados
Añadimos la columna "N°" como contador
Añadimos las cabeceras originales
Evento click para reordenar
Ordenamos el contenido de nuevo
Limpiar el cuerpo de la tabla antes de repoblar
Recorremos los datos y reconstruimos las filas de la tabla
Añadimos la celda de "Contador" con el número de fila
Añadimos las celdas de los datos
Añadimos la fila al cuerpo de la tabla
Inicializamos las tablas con el ID "vistaTabla"
Observamos nuevos elementos en el DOM
Observamos todo el cuerpo para agregar nuevas tablas dinámicamente
```

## cliente\supercontrolador\modulos\cabecera\cabecera.css
<a name="archivo_32-cliente-supercontrolador-modulos-cabecera-cabecera.css"></a>

```
Estilo del header
Verde azulado medio
Texto en azul claro
Línea azul oscuro
Sombra sutil
Posicionar el contenedor en la esquina superior izquierda
Espacio desde la parte superior
Espacio desde la parte izquierda
Espaciado entre los elementos
Alinear los elementos a la izquierda
Espaciado dentro del contenedor
Bordes redondeados
Texto en azul oscuro
Estilo del nombre del usuario
Estilo de los botones
Fondo al pasar el cursor
Color de texto al pasar el cursor
Efecto de ampliación
* ESTILO CON MEDIA PRINT **
Ocultamos elementos innecesarios
Asegurar que el main section ocupe todo el espacio
Evitamos que el contenido tenga scroll o se recorte
Ajuste de imágenes para evitar que se recorten
Asegurar que toda la página use el tamaño adecuado
****************** Estilos para el modal de ayuda  *******************************
Estilos para el contenido del modal
Estilos para el botón "X"
Efecto hover para el botón "X"
Ajustar el iframe dentro del modal
```

## cliente\supercontrolador\modulos\cabecera\cabecera.js
<a name="archivo_33-cliente-supercontrolador-modulos-cabecera-cabecera.js"></a>

```
Función para mostrar el nombre de usuario guardado en localStorage
Función para cerrar sesión
Función para abrir el correo electrónico en un iframe
Función para imprimir la sección (si existe un iframe se intenta imprimir su contenido)
```

## cliente\supercontrolador\modulos\cierre\cierre.css
<a name="archivo_34-cliente-supercontrolador-modulos-cierre-cierre.css"></a>

```
Estilo del footer
```

## cliente\supercontrolador\modulos\modal\modal.css
<a name="archivo_35-cliente-supercontrolador-modulos-modal-modal.css"></a>

```
****************** ESTILO VENTANA EMERGENTE ***********************
Modal
Estilos para las animaciones de aparición y desaparición
Contenido del Modal
Título dentro del Modal
Section dentro del Modal
Divs dentro del Section del Modal
Contenedores de Inputs en Modal
Párrafos dentro del Modal
Inputs dentro del Modal
Botón Enviar en el modal
```

## cliente\supercontrolador\modulos\modal\modal.js
<a name="archivo_36-cliente-supercontrolador-modulos-modal-modal.js"></a>

```
--- Ventana modal para INSERTAR REGISTROS ---
--- Ventana modal para AYUDA ---
```

## cliente\supercontrolador\modulos\principal\principal.css
<a name="archivo_37-cliente-supercontrolador-modulos-principal-principal.css"></a>

```
Barra lateral y contenido
Estilo del nav (barra lateral)
Fondo azul muy claro
Sombra suave
Estilo de los items de la lista
Estilo para el icono dentro de los elementos de la lista
Estilo para la sección principal
Fondo azul claro
Sombra suave
Texto azul oscuro
Título de la sección
Estilos para la tabla
Ancho completo
Colapsar bordes
Espacio superior
Estilo para el encabezado de la tabla
Fondo para encabezados
Color de texto en encabezados
Aumentar el espaciado interno
Alinear texto a la izquierda
Línea debajo de cada celda
Espaciado entre letras
Estilo para filas del cuerpo
Color de fondo al hacer hover en filas
Color de texto al hacer hover
Fondo alternativo para filas
********************* ESTILO TITULO TABLA ******************
background:#4D869C;
background:#4D869C;
Ajusta el tamaño del ícono
Espacio entre ícono y texto
****************************** BOTÓN INSERTAR ******************
*************************** ESTILO PARA CARTA MONGO ***********
Contenedor de las tarjetas
Asegura que los elementos se alineen en fila
Alineación horizontal
Permite que las tarjetas pasen a la siguiente línea si no caben
Espaciado entre tarjetas
Centra las tarjetas en el contenedor
Estilos de las tarjetas
Tamaño fijo para mantener consistencia
Título de cada tarjeta
Contenido dentro de la tarjeta
Listas dentro del contenido JSON
Claves dentro del JSON
Estilos para el mensaje de "No hay documentos"
```

## cliente\supercontrolador\modulos\principal\principal.js
<a name="archivo_38-cliente-supercontrolador-modulos-principal-principal.js"></a>

```
Función para listar las tablas según la aplicación seleccionada
Se asume que la función crearMenuTablas está definida en otro módulo o archivo
Función para listar las colecciones de MongoDB
Función para cargar la gráfica
Función para cargar las aplicaciones desde el JSON
```

## formularios\envia.php
<a name="archivo_39-formularios-envia.php"></a>

```
Obtener los datos enviados por el formulario
Obtener el archivo JSON según el formulario enviado
Verificar si el archivo existe
Leer el contenido del archivo JSON
Decodificar el JSON en un array asociativo
Recorrer cada campo en el JSON para validar los datos enviados
Mostrar el límite mínimo según el JSON y el valor enviado desde el formulario
Validar que el dato enviado cumpla con el límite mínimo de caracteres
Guardar los datos recibidos en un archivo JSON con la fecha y hora actual
```

## formularios\estilo.css
<a name="archivo_40-formularios-estilo.css"></a>

```
Estilo general del formulario
Fondo claro
Sombra suave
Estilo del título del formulario
Estilo del contenedor de cada artículo (input, textarea, select)
Estilo para los textos dentro de cada artículo (títulos y descripciones)
Estilo para los labels (si los hubiera)
Estilo para los campos de entrada (input, textarea, select)
Permite cambiar el tamaño del textarea solo en vertical
Limitar altura máxima para el textarea
Foco en los campos de entrada
Color de borde cuando está enfocado
Sombra
Placeholder
Color gris claro
Estilo del botón de envío
Hover del botón de envío
Estilos para los errores de validación
Estilo para los mensajes o placeholders
Estilo para los selects
Fondo gris claro
```

## formularios\index.php
<a name="archivo_41-formularios-index.php"></a>

```
Ruta del archivo JSON
Verificar si el archivo existe
Leer el archivo
Decodificar el JSON
Comprobar si la decodificación fue exitosa
Verificar si la clave 'campos' existe en la estructura
Recorrer los campos del formulario (ya sea dentro de 'campos' o directamente el array)
Verificar que cada campo tiene lo necesario
Si el campo es un 'select', manejar las opciones
Si no es un select, generar el input normal
Agregar validadores si existen
```

## formularios\panel.php
<a name="archivo_42-formularios-panel.php"></a>

```
Comprobar si el archivo es un JSON
```

## formularios\lib\validadorForm\validadorForm.css
<a name="archivo_43-formularios-lib-validadorform-validadorform.css"></a>

```
Clase para campos inválidos (error)
Borde rojo para error
Fondo rojo claro
Clase para campos válidos (éxito)
Borde verde para éxito
Fondo verde claro
```

## formularios\lib\validadorForm\validadorForm.js
<a name="archivo_44-formularios-lib-validadorform-validadorform.js"></a>

```
Seleccionamos todos los elementos <input> del documento
Filtramos los inputs que tienen el atributo 'validadorForm', ya que solo esos necesitan validación
Función que verifica si el valor del input cumple con la expresión regular
```

## public\index.php
<a name="archivo_45-public-index.php"></a>

```
Habilitar CORS
```

## servidor\ConectorMongoDB.php
<a name="archivo_46-servidor-conectormongodb.php"></a>

```
///////////////////////////// FUNCION PARA SELECCIONAR ////////////////////
Consulta vacía para obtener todos los documentos
Usar la conexión correctamente
Convertir el resultado a JSON y devolverlo
///////////////////////////// FUNCION PARA SELECCIONAR ////////////////////
///////////////////////////// FUNCION PARA INSERTAR ////////////////////
///////////////////////// FUNCION ELIMIAR DOCUMENTOS //////////////////////
Crear un filtro para encontrar el documento por su _id
Ejecutar la eliminación
```

## servidor\conexionDB.php
<a name="archivo_47-servidor-conexiondb.php"></a>

```
Propiedades para la conexión a la base de datos
Constructor que inicializa las propiedades y establece la conexión
INICIA LAS PROPIEDADES DE CONEXION
Establecer la conexión a la base de datos
///////////////////////////////////////// FUNCION BUSCAR SELECCIONADO ////////////////////////////////////////////
Verificar si los campos seleccionados están presentes
Verificar que al menos un campo haya sido seleccionado
Sanitizar los nombres de los campos para prevenir inyecciones SQL
Construir la parte de la consulta SELECT con los campos seleccionados
Iniciar la consulta SQL
Verificar si se proporcionaron valores de búsqueda
Sanitizar los valores de búsqueda
Construir la parte de la consulta WHERE con los valores de búsqueda
Añadir la cláusula WHERE a la consulta
Ejecutar la consulta SQL
Recoger los resultados de la consulta
Devolver los resultados como JSON
//////////////////////////////////////////   FUNCION DE BUSCAR     ////////////////////////////////////////////////
Sanitizamos los datos antes de construir la consulta
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// BUSCAR SIMILARES EN EL SELECTOR //////////////////////////////////////
////////////////////////////////////////// SELECCIONAR TABLA ///////////////////////////////////////
/////////////////////////////////////// SACAR EL LISTADO DE TABLAS /////////////////////////////////////////////
La consulta SQL
echo $query;
Ejecutamos la consulta
Recorremos los resultados de la consulta
Almacenamos cada fila en el arreglo resultado
Enviar la respuesta como JSON
/////////////////////////////////////// SACAR EL LISTADO DE TABLAS /////////////////////////////////////////////
La consulta SQL
Ejecutamos la consulta
Recorremos los resultados de la consulta
Almacenamos cada fila en el arreglo resultado
Enviar la respuesta como JSON
/////////////////////////////////////// SACAR EL LISTADO DE TABLAS /////////////////////////////////////////////
//////////////////////////////////////////// PARA SACRA TODAS LAS COLUMNAS DE LA TABLA /////////////////////////////////
/////////////////////////////////////////// INSERTAR EN LA TABLA /////////////////////////////////////////////////
/////////////////////////////////////// FUNCION DE ACTUALIZAR TABLA ////////////////////////////////////////////////////////
///////////////////////////////////////////// FUNCION PARA OBTENER REGISTRO //////////////////////////////////////////////
///////////////////////////////////////////// FUNCION PARA ELIMINAR REGISTRO //////////////////////////////////////////////
/////////////////////////////////// FUNCIONES DESCODIFICA Y CODIFICAR //////////////////////////////////////////////////
////////////////////////////////////////////// metemos metodo de datos grafica ////////////////////////////////////////////
Get the list of tables in the database
Debug: Verifica si hay resultados
Loop through each table and count its rows
Encode the result as a JSON string
```

## servidor\index.php
<a name="archivo_48-servidor-index.php"></a>

```
*ACTUA COMO UN CONTROLADOR , PARA INTERACTURA CON LA BASE DE DATOS MANEJANDO DIFERNETES SOLICITUDES HTTP (GET O POST)*
//activamos la visualizacion de errores
	ini_set('display_errors', 1);		
	// activa los errors durante el proceso de inicio de php																						
	ini_set('display_startup_errors', 1);		
	//configura el php para recojer todos los tipos de errores,advertencias y notificaciones																		
	error_reporting(E_ALL);																											
	
	include "conexionDB.php";
	include "ConectorMongoDB.php";

	//include "antiguo/codificador.php";
$codificador = new Cifrado();
				foreach($datos as $clave => $valor){
					if($clave != "Identificador"){
						$datos[$clave] = $codificador->codifica($valor);
					}
				}
activamos la visualizacion de errores
activa los errors durante el proceso de inicio de php
configura el php para recojer todos los tipos de errores,advertencias y notificaciones
include "antiguo/codificador.php";
///////////////////////////////////////// vamos a probar a integrar /////////////////////////////////
Activamos la visualización de errores
Incluir archivos de conexión y seguridad
Instancias de las clases
/////////////////////////////////////////////////////////////////////////////////////////////////////
verificamos si existe el parametro o
y dependiendo del valor se realizara una accion diferente
para ir a la aplicaicon que le corresponda al departamento
echo $_GET['token'];
si llamamo
si llamamos a este metodo, nos devolvera todoas las listas de las tablas
///////////////////////////// OPERACIONES PARA MOONGODB //////////////////////
/////// REALIZAR LAS BUSQUEDAS EN EL CAMPO DE BUSQUEDA ///////////////////////
nos seleccionara y devolvera los datos de una tabla especifica
nos devolvera todos los nombres de las columanas de una tabla especifica
elimina una fila de una tabla específica, utilizando un identificador único que se pasa
el script recoje los datos de la solicitud y lo descodifica y luego llama al metodo buscar
pasandole el nomrbe de la tabla y los datos descodificados
y relaimos la busqueda con esos conparametros
de estos casos se espera una solicitud POST
/ SE ENCARGA DE HACER LA PETICION A LA BASE DE DATOS DESDE EL BOTON DE BUSQUEDA
Si hay algún error, devolver un mensaje JSON de error
/para hacer funcionar la barra del buscador
igual que en el de busqueda, esperamos la solicitud POST con cuerpod e JSON
recoge los datos y los descodifica
y inserta un nuevo registor en la tabla especifica
/metemos nuesstra clase de cifrado
```

## servidor\antiguo\insertar.php
<a name="archivo_49-servidor-antiguo-insertar.php"></a>

```
Atrapo lo que viene de formulario
lo descodificamos como JSON
para cada una de lasclaves del objeto
Siempre que no sea el identificador
Lo encadeno con la petición SQL
Comienzo a formatear la peticion
Para cada una de las claves del objeto
Siempre que no sea el identificador
lo encadenamos con la peticion SQL
Le quito la última coma
Le encadeno el último paréntesis
Lanzo la petición por pantalla
```

## servidor\lib\codificador.php
<a name="archivo_50-servidor-lib-codificador.php"></a>

```
Método para codificar
Método para decodificar
Deshacer el cambio en los caracteres
```

## servidor\lib\fuerza_bruta.php
<a name="archivo_51-servidor-lib-fuerza_bruta.php"></a>

```
Habilita la visualización de errores para depuración
INICIA LAS PROPIEDADES DE CONEXION
Establece la conexión con la base de datos
Consulta SQL para contar el número de intentos desde una IP específica en los últimos 60 segundos
echo $query; // Esta línea está comentada, podría usarse para depuración
Recorre el resultado de la consulta
Verifica si el número de intentos excede 100
Inserta un registro en la tabla 'registros' indicando un bloqueo por fuerza bruta
Detiene la ejecución del script y devuelve un mensaje de error en formato JSON
```

## servidor\lib\registros.php
<a name="archivo_52-servidor-lib-registros.php"></a>

```
INICIA LAS PROPIEDADES DE CONEXION
Consulta SQL corregida
```
