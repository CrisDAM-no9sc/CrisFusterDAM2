<?php

/**
 * ## Descripción:
 * Este archivo contiene una función para **sanitizar datos de entrada** y prevenir ataques de inyección SQL.
 *
 *
 * ## Funcionamiento:
 * - `sanear($elemento)`: 
 *   - Verifica si la entrada es un array, de lo contrario devuelve un error JSON.
 *   - Comprueba que las claves y valores no contengan palabras prohibidas (`DELETE`, `DROP`, `TRUNCATE`, `TABLE`).
 *   - Aplica la verificación **de manera recursiva en arrays anidados**.
 *
 */



if (!function_exists('sanear')) {
    function sanear(&$elemento) {
        if (!is_array($elemento)) {
            die(json_encode(["resultado" => "error 1"]));
        }

        $coleccion = ['delete', 'drop', 'truncate', 'table'];

        foreach ($elemento as $clave => $valor) {
            $entradaClave = strtolower($clave);
            foreach ($coleccion as $palabra) {
                if (strpos($entradaClave, $palabra) !== false) {
                    die(json_encode(["resultado" => "error 2"]));
                }
            }

            if (is_string($valor)) {
                $entradaValor = strtolower($valor);
                foreach ($coleccion as $palabra) {
                    if (strpos($entradaValor, $palabra) !== false) {
                        die(json_encode(["resultado" => "error 2"]));
                    }
                }
            } elseif (is_array($valor)) {
                sanear($valor); // Recursión para limpiar arrays anidados
            }
        }
    }
}

?>


