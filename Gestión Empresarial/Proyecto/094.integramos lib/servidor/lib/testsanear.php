<?php
// testSanear.php

// Incluimos la función sanear. Puedes ponerla aquí o incluirla desde otro archivo.
if (!function_exists('sanear')) {
    /**
     * Valida recursivamente un array para asegurarse de que ni sus claves ni sus valores contengan
     * palabras SQL prohibidas.
     *
     * @param array $elemento El array a validar (por referencia).
     * @throws Exception Lanza una excepción si se encuentra una palabra prohibida.
     */
    function sanear(&$elemento) {
        if (!is_array($elemento)) {
            throw new Exception(json_encode(["resultado" => "error 1", "mensaje" => "Se esperaba un array."]));
        }

        // Patrón que detecta las palabras prohibidas de forma exacta (case insensitive)
        $pattern = '/\b(delete|drop|truncate|table)\b/i';

        foreach ($elemento as $clave => $valor) {
            // Comprobamos la clave
            if (is_string($clave) && preg_match($pattern, $clave)) {
                throw new Exception(json_encode(["resultado" => "error 2", "mensaje" => "Palabra prohibida en la clave: '$clave'."]));
            }

            // Comprobamos el valor si es cadena
            if (is_string($valor)) {
                if (preg_match($pattern, $valor)) {
                    throw new Exception(json_encode(["resultado" => "error 2", "mensaje" => "Palabra prohibida en el valor: '$valor'."]));
                }
            } elseif (is_array($valor)) {
                // Recursión para arrays anidados
                sanear($valor);
            }
        }
    }
}

// Configuramos la cabecera para que la respuesta sea JSON
header('Content-Type: application/json; charset=utf-8');

// Recogemos los datos enviados por POST (puedes usar $_POST directamente)
$datos = $_POST;

// Opcional: para ver todos los datos que llegan, puedes descomentar la siguiente línea
// echo json_encode(["datos recibidos" => $datos], JSON_PRETTY_PRINT);

// Ejecutamos la validación
try {
    sanear($datos);
    // Si no se lanza ninguna excepción, los datos son seguros
    echo json_encode(["resultado" => "Datos seguros", "datos" => $datos], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    // Si se lanza una excepción, devolvemos el error
    echo $e->getMessage();
}
?>
