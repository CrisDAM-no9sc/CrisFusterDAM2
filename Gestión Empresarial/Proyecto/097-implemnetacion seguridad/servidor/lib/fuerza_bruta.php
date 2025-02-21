<?php

/**
 * # Archivo: fuerza_bruta.php
 *
 * ##  Descripción:
 * Este archivo implementa un **sistema de protección contra ataques de fuerza bruta**. Su objetivo es:
 * - **Monitorear intentos de conexión** en un período de 60 segundos.
 * - **Bloquear una IP** si supera los 100 intentos en dicho intervalo.
 * - **Registrar intentos sospechosos** en la base de datos.
 * - **Enviar una respuesta JSON en caso de detección de ataque**.
 *
 *
 * ##  Notas:
 * - La verificación se realiza utilizando la tabla `registros`.
 * - Requiere que la tabla `registros` contenga los campos: `ip`, `epoch`, `user_agent`, `url`, y `motivo`.
 */

    // Habilita la visualización de errores para depuración
    ini_set('display_errors', 1);																								
    ini_set('display_startup_errors', 1);																				
    error_reporting(E_ALL);	

    // INICIA LAS PROPIEDADES DE CONEXION
    $servidor = "localhost";
    $usuario = "crismon1";
    $contrasena = "crismon1";
    $basededatos = "crismon1";

    // Establece la conexión con la base de datos
    $conexion = mysqli_connect(
        $servidor, 
        $usuario, 
        $contrasena, 
        $basededatos
    );	

    // Consulta SQL para contar el número de intentos desde una IP específica en los últimos 60 segundos
    $query = "
        SELECT 
        COUNT(ip) AS numero 
        FROM registros
        WHERE 
        ip = '".$_SERVER['REMOTE_ADDR']."'
        AND epoch > UNIX_TIMESTAMP()-60;
    ";											
    // echo $query; // Esta línea está comentada, podría usarse para depuración
    $resultado = mysqli_query($conexion , $query);	

    // Recorre el resultado de la consulta
    while ($fila = mysqli_fetch_assoc($resultado)) {										
        // Verifica si el número de intentos excede 100
        if($fila['numero'] > 100){
            // Inserta un registro en la tabla 'registros' indicando un bloqueo por fuerza bruta
            $query = "INSERT INTO registros VALUES
                (
                    NULL,
                    '".$_SERVER['REQUEST_TIME']."',
                    '".$_SERVER['REMOTE_ADDR']."',
                    '".$_SERVER['HTTP_USER_AGENT']."',
                    '".$_SERVER['REQUEST_URI']."',
                    'BLOQUEO FUERZA BRUTA'
                );";											
        
            $result = mysqli_query($conexion , $query);
            // Detiene la ejecución del script y devuelve un mensaje de error en formato JSON
            die('{"error":"te has pasado de bruto"}');
        }																			
    }	



?> 
