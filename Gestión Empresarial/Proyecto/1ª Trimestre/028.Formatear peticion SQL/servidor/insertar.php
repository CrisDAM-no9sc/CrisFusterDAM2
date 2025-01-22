<?php
    echo "Hola php";
    echo "Vamos a ver si nos llegua la informacion";

    $peticion = "INSERT INTO clientes VALUES (NULL,";

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    foreach($data as $clave=>$valor){
        if($clave != "Identificador"){
            $peticion .= "'".$valor.",";
        }
    }
    $peticion = substr($peticion, 0, -1);
    $peticion .= ");";
    echo $peticion;
?>