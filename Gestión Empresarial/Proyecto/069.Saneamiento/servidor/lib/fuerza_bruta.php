<?php


        ini_set('display_errors', 1);																								
        ini_set('display_startup_errors', 1);																				
        error_reporting(E_ALL);	

        //INICIA LAS PROPIEDADES DE CONEXION
        $servidor = "localhost";
        $usuario = "crismon1";
        $contrasena = "crismon1";
        $basededatos = "crismon1";

        $conexion = mysqli_connect($servidor, $usuario, $contrasena, $basededatos);
        $query = " SELECT 
                    COUNT(ip) AS numero 
                    FROM registros 
                    WHERE 
                    ip='".$_SERVER['REMOTE_ADDR']."' 
                    AND epoch > UNIX_TIMESTAMP()-60
        ";
        $resultado = mysqli_query($conexion, $query);

        while ($fila = mysqli_fetch_assoc($resultado)){
            if($fila['numero'] > 100){
                $query = "INSERT INTO refistros VALUES 
                (
                    NULL, 
                    '".$_SERVER['REQUEST_TIME']."',
                    '".$_SERVER['REMOTE_ADDR']."'
                    '".$_SERVER['HTTP_USER_AGENT']."',
                    '".$_SERVER['REQUEST_URI']."',
                    'BLOQUEO FUERZA BRUTA'
                );";

                $result = mysqli_query($conexion, $query);
                die('{"error":"te has pasado de bruto"}');
            }
        }
?>