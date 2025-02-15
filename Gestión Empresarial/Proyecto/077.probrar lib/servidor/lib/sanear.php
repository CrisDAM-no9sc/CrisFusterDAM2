<?php

function sanear($elemento) {
    // Verificar si $elemento es un arreglo u objeto
    if (!is_array($elemento) && !is_object($elemento)) {
        die('{"resultado":"error 1", "mensaje": "El elemento no es un arreglo u objeto"}');
    }

    $coleccion = ['delete', 'drop', 'truncate', 'table'];

    foreach ($elemento as $clave => $valor) {
        $entrada = strtolower($clave);
        if (array_filter($coleccion, fn($e) => strpos($entrada, $e) !== false)) {
            die('{"resultado":"error 2", "mensaje": "Clave contiene un término prohibido"}');
        }
        $entrada = strtolower($valor);
        if (array_filter($coleccion, fn($e) => strpos($entrada, $e) !== false)) {
            die('{"resultado":"error 2", "mensaje": "Valor contiene un término prohibido"}');
        }
    }
}


?>