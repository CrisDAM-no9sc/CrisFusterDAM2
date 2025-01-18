<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XML Control Panel</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="cargaform.js"></script>
</head>
<body>
    <h1>XML Control Panel</h1>

 
    <div id="controlPanel">
        <h2>Archivos Disponibles</h2>

        
        <?php
        //toma el parametro que representa la ruta del directorio desde donde debe emepezar a leer
        function analizarDirectorio($baseDir) {
            
            $items = scandir($baseDir);
            //recorremos todos los elementos de item 
            foreach ($items as $item) {
                //si el elemento contine esto, se salta al sigue¡iente elemento con continue
                if ($item === '.' || $item === '..') continue;
                // aqui indicamos la ruta absoluta del elemento 
                $rutacompleta = $baseDir . '/' . $item;
                //comprobamos si e elemento es un directorio 
                if (is_dir($rutacompleta)) {
                    //si es , se generea una estructura html
                    echo "<div class='folder'>";               
                    echo "<h3>Carpeta: $item</h3>";
                    echo "<ul class='file-list'>";
                    // se lmlama para explorar el contenido de cada subdirecotio dentro del diorectorio base 
                    analizarDirectorio($rutacompleta);
                    echo "</ul></div>";
                // comporbamos si el elemento es un archivo xml
                } elseif (pathinfo($rutacompleta, PATHINFO_EXTENSION) === 'xml') {
                    //si tiene la estension xml se genera una lista con el nombre del archivo
                    echo "<li>
                            $item 
                            <button onclick=\"loadXML('$rutacompleta')\">Cargar</button>
                            <button onclick=\"viewContent('$rutacompleta')\">Ver</button>
                          </li>";
                }
            }
        }

        $baseDir = 'xml';
        if (!is_dir($baseDir)) {
            echo "<p>No existe el directorio base XML.</p>";
            exit;
        }
        echo "<ul class='file-list'>";
        analizarDirectorio($baseDir);
        echo "</ul>";
        ?>
    </div>

    <!-- Formulario Dinámico -->
    <div id="contenedorForm">
        <h2>Formulario Dinámico</h2>
        <div id="aparencia">
            <button onclick="window.location.href='?f=cliente'">Nuevo Cliente</button>
            <button onclick="window.location.href='?f=factura'">Nueva Factura</button>
        </div>
        <form id="formularioDinamico" onsubmit="guardarYRecargar(event)">
            <div id="camposEstaticos"></div>
            <div id="contenedorCamposDinamicos"></div>
            <button type="submit">Guardar</button>
        </form>
    </div>

    <!-- Modal para Visualizar XML -->
    <div id="contentModal" class="modal">
        <div class="modal-content">
            <button class="close-btn" onclick="closeModal()">X</button>
            <pre id="contentViewer"></pre>
        </div>
    </div>
    <script>


    </script>

</body>
</html>
