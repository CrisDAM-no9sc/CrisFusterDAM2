<?php

/**
 * ## Descripción:
 * Este archivo **registra todas las solicitudes** a la aplicación en una base de datos. 
 * Se utiliza para **monitoreo de accesos** y **detección de intentos sospechosos**.
 *
 *
 * ## Funcionamiento:
 * - Se conecta a la base de datos `crismon1`.
 * - Inserta un nuevo registro en la tabla `registros` con los siguientes datos:
 *   - **Fecha y hora del acceso** (`epoch`).
 *   - **Dirección IP del usuario** (`REMOTE_ADDR`).
 *   - **Navegador usado** (`HTTP_USER_AGENT`).
 *   - **Página solicitada** (`REQUEST_URI`).
 *
 */
    // INICIA DE CONEXION
    $servidor = "localhost";
    $usuario = "crismon1";
    $contrasena = "crismon1";
    $basededatos = "crismon1";

    $conexion = mysqli_connect($servidor, $usuario, $contrasena, $basededatos);

    // Inserta un registro en la base de datos
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
