<?php

$enlace = mysqli_connect("localhost", "accesoadatos", "accesoadatos", "accesoadatos") OR die("error");

// Corregido el nombre de la variable a $json
$json = file_get_contents("004.modelodedatos.json");
$datos = json_decode($json, true);


foreach($datos as $dato){
    
    $nombredetabla = $dato['nombre'];
    $cadena = "CREATE TABLE ".$nombredetabla." ( ";
    foreach($dato['columnas'] as $columna){

        $cadena .= $columna['nombre']." ".$columna['tipo']." (".$columna['longitud']."),";
        
    }
    //para quitar la coma del final
    $cadena = substr($cadena, 0, -1);
    $cadena .= " ) ";
   mysqli_query($enlace, $cadena);
}
?>
