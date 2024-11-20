<?php
    $mysqli = mysqli_connect("localhost","crismon1","crismon1","crismon1");	

    
    //para cojer los datos que metamos en los imputs del formulario
    $json = file_get_contents('php://input');
    //decodificamos en formato JSON
    $data = json_decode($json, true);

    foreach($data as $clave=>$valor){
        if( $clave == 'tabla'){
            //lo encadenamos con la peticion SQL
            $tabla = $valor;
        }
    }

    $peticion = "INSERT INTO ".$tabla." VALUES(NULL,";

    //Para cada una de la clases del objeto, siempre que no sea el Identificador
    foreach($data as $clave=>$valor){
        if($clave != "Identificador" && $clave != 'tabla'){
            //lo encadenamos con la peticion SQL
            $peticion .= "'".$valor."',";
        }
    }
    $peticion = substr($peticion, 0, -1);
    //eNCADENAMOS EL UTILMO PARENTESIS DE LA PETICION
    $peticion .= ");";
    echo $peticion;
    $result = mysqli_query($mysqli, $peticion);
?>