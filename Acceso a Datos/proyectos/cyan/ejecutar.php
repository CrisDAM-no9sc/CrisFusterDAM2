<?php
require 'conectorphp.php'; // Cargar la clase BaseDeDatos

// Instanciar la base de datos con la "tabla" Productos
$db = new BaseDeDatos('Productos');

// Crear JSON correctamente
$datosInsertar = [
    "nombre" => "Impresora",
    "precio" => 256,
    "marca" => "HP"
];

// Convertir a JSON bien formateado
$jsonData = json_encode($datosInsertar, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

// Depuración: Mostrar JSON generado antes de enviarlo
echo "<pre>JSON generado en PHP: " . $jsonData . "</pre>";

// Insertar en la base de datos
$insertarResultado = $db->insertar($jsonData);
echo "Resultado de inserción: " . $insertarResultado . "\n";

//  Ahora ejecutamos `seleccionar()` para recuperar los datos almacenados
echo "<h2>Registros en la base de datos:</h2>";
$registros = $db->seleccionar(true);

// Mostrar los registros obtenidos
echo "<pre>" . print_r($registros, true) . "</pre>";