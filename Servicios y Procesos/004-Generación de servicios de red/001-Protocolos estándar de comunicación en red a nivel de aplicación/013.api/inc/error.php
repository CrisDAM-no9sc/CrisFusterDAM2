<?php
//Activar errores (solo en entorno de desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


function json_response($status, $message, $data = null) {
    header('Content-Type: application/json'); // Siempre devolver JSON

    $response = [
        "status" => $status,
        "message" => $message
    ];

    if (!is_null($data)) {
        $response['data'] = $data;
    }

    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}

// Cambiar esto a false en producción
$modoDesarrollo = true;

if (!$modoDesarrollo) {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}
?>
