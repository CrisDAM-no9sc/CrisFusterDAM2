<?php

    $conexion = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

    $peticion = "
        SELECT 
        clientes.nombre AS `Nombre del Cliente`,
        clientes.apellidos AS `Apellidos del Cliente`
        FROM 
        clientes
    ";

    $resultado = mysqli_query($conexion, $peticion);

    $datos = [];

    while ($fila = mysqli_fetch_assoc($resultado)){
        $datos[] = $fila;
    }
    
    $json = json_encode($datos, JSON_PRETTY_PRINT."\n");
    echo $json;
?>