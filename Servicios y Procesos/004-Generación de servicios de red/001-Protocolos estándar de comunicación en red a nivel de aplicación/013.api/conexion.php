<?php

$mysqli = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

// Verificamos si la conexión fue exitosa
if (!$mysqli) {
    die("Error al conectar a la base de datos: " . mysqli_connect_error());
}


?>