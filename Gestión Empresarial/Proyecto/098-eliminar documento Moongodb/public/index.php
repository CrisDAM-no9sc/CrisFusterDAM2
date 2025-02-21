<?php

/**
 * ##  Descripción:
 * Este script proporciona una **API pública REST** para recuperar información de productos desde la base de datos.
 * Es un **endpoint que devuelve un JSON** con la lista de productos, incluyendo imágenes si están disponibles.
 *
 *
 * ##  Funcionalidades:
 * - **Habilita CORS** para permitir solicitudes desde cualquier origen (`*`).
 * - **Obtiene la lista de productos desde MySQL**.
 * - **Modifica la URL de las imágenes** para que sean accesibles desde un servidor externo.
 * - **Devuelve los resultados en formato JSON**.
 *
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir el acceso desde cualquier dominio
header('Access-Control-Allow-Origin: *');                               // Permitir solicitudes desde cualquier origen
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');             // Métodos permitidos
header('Access-Control-Allow-Headers: Content-Type, Authorization');    // Encabezados permitidos
header('Content-Type: application/json');                               // Tipo de contenido


$conexion = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

//Consulta SQL para obtener la lista de productos
$peticion = "SELECT * FROM productos";
$resultado = mysqli_query($conexion, $peticion);

$json = [];
// Recorrer los resultados y estructurar la salida JSON
while ($fila = mysqli_fetch_assoc($resultado)) {
    if (!empty($fila['fotografia'])) {
        $fila['fotografia'] = "http://10.0.2.2/img/" . $fila['fotografia']; 
    }
    $json[] = $fila;
}

header('Content-Type: application/json');
echo json_encode($json, JSON_PRETTY_PRINT);

?>
