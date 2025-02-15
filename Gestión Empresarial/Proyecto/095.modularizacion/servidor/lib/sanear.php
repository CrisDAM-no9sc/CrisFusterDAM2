<?php

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


