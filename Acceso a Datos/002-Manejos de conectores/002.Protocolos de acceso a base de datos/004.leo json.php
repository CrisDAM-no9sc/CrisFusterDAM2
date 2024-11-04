<?php

$enlace = mysqli_connect("localhost", "accesoadatos", "accesoadatos", "accesoadatos") OR die("error");

// Corregido el nombre de la variable a $json
$json = file_get_contents("004.modelo de datos.json");
$datos = json_decode($json, true);

// Mostrar los datos decodificados
var_dump($datos);

?>
