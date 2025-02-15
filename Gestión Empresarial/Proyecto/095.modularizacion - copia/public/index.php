<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header('Access-Control-Allow-Origin: *'); // Permitir solicitudes desde cualquier origen
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Métodos permitidos
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Encabezados permitidos
header('Content-Type: application/json'); // Tipo de contenido


$conexion = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");


$peticion = "SELECT * FROM productos";
$resultado = mysqli_query($conexion, $peticion);

$json = [];

while ($fila = mysqli_fetch_assoc($resultado)) {
    if (!empty($fila['fotografia'])) {
        $fila['fotografia'] = "http://10.0.2.2/img/" . $fila['fotografia']; 
    }
    $json[] = $fila;
}

header('Content-Type: application/json');
echo json_encode($json, JSON_PRETTY_PRINT);

?>
