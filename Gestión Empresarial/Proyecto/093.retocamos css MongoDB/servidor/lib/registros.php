<?php
    // INICIA LAS PROPIEDADES DE CONEXION
    $servidor = "localhost";
    $usuario = "crismon1";
    $contrasena = "crismon1";
    $basededatos = "crismon1";

    $conexion = mysqli_connect($servidor, $usuario, $contrasena, $basededatos);

    // Consulta SQL corregida
    $query = "INSERT INTO registros VALUES
				
            (
                NULL,
                '".$_SERVER['REQUEST_TIME']."',
                '".$_SERVER['REMOTE_ADDR']."',
                '".$_SERVER['HTTP_USER_AGENT']."',
                '".$_SERVER['REQUEST_URI']."',
                ''
                
                
            );";


    $result = mysqli_query($conexion , $query);
?>
