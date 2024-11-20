<?php
    echo "Hola php";
    echo "Vamos a ver si nos llegua la informacion";

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data){
        foreach($data as $clave=>$valor){
            echo "El campo: ".$clave." me ha traído el valor ".$valor."<br>";
        }
    }else{
        echo "No se peude decodificar el JSON.\n";
    }
?>