<?php

    $conexion = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

    switch ($_GET['o']) {
        //?o=clientes
        case "clientes":
            $peticion = "
                SELECT 
                clientes.nombre AS `Nombre del Cliente`,
                clientes.apellidos AS `Apellidos del Cliente`
                FROM 
                clientes
            ";
            $resultado = mysqli_query($conexion, $peticion);
            $datos = [];
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $datos[] = $fila;
            }
            $json = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            echo $json;
            break;
        // para acceder a la informacion hay que poner en lo ultimo de la url ?o=cliente&id=10 (con el id que queramos)
        case "cliente":
            $peticion = "
                SELECT 
                clientes.nombre AS `Nombre del Cliente`,
                clientes.apellidos AS `Apellidos del Cliente`
                FROM 
                clientes
                WHERE clientes.Identificador = " . intval($_GET['id']) . "
            ";
            $resultado = mysqli_query($conexion, $peticion);
            $datos = [];
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $datos[] = $fila;
            }
            $json = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            echo $json;
            break;

        default:
            echo '{"resultado": "nada"}';

    }
    
?>
