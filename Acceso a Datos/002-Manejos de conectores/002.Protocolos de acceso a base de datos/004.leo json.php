<?php

$enlace = mysqli_connect("localhost", "accesoadatos", "accesoadatos", "accesoadatos") OR die("error");

// Corregido el nombre de la variable a $json
$json = file_get_contents("C:/xampp/htdocs/Acceso a Datos/002-Manejos de conectores/002.Protocolos de acceso a base de datos/004.modelodedatos.json");
$datos = json_decode($json, true);

// Mostrar los datos decodificados
var_dump($datos);

?>
