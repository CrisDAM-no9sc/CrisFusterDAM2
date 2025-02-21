<?php
// Función para recorrer y mostrar carpetas y archivos
function recorrerCarpetaYArchivos($rutaCarpeta) {
    if (!is_dir($rutaCarpeta)) {
        die("La carpeta no existe: $rutaCarpeta");
    }

    // Función auxiliar para escanear recursivamente las carpetas
    function escanearDirectorioRecursivo($ruta) {
        $elementos = scandir($ruta);
        foreach ($elementos as $elemento) {
            // Saltar los punteros de directorio actual y padre
            if ($elemento === '.' || $elemento === '..') {
                continue;
            }

            $rutaCompleta = $ruta . DIRECTORY_SEPARATOR . $elemento;
            if (is_dir($rutaCompleta)) {
                echo "<h3>" . $elemento . "</h3>" . PHP_EOL;
                escanearDirectorioRecursivo($rutaCompleta); // Llamada recursiva
            } elseif (is_file($rutaCompleta)) {
                $contenido = file_get_contents($rutaCompleta);
                echo "<p>" . $contenido. "</p>" . PHP_EOL;
            }
        }
    }

    // Iniciar el escaneo desde la carpeta raíz proporcionada
    escanearDirectorioRecursivo($rutaCarpeta);
}

// Uso del script con la ruta de la carpeta 'docs'
$rutaCarpeta = 'docs';
recorrerCarpetaYArchivos($rutaCarpeta);
