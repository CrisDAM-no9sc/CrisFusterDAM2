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


// Datos de prueba
$datosSeguro = [
    "nombre"    => "Juan",
    "comentario"=> "Este es un mensaje seguro"
];

$datosInseguro = [
    "nombre"    => "Juan",
    "comentario"=> "Este mensaje contiene delete"
];

echo "Prueba con datos seguros (antes):\n";
sanear($datosSeguro);
echo json_encode($datosSeguro, JSON_PRETTY_PRINT);

// Al ejecutar la siguiente prueba, la función se detendrá y mostrará el error.
echo "\n\nPrueba con datos inseguros (antes):\n";
sanear($datosInseguro);
echo json_encode($datosInseguro, JSON_PRETTY_PRINT);
?>


?>