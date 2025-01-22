<?php

//habilitamos la visualizacion de errores para la depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
//incluiomos el aechivo donde se encuentra la clase 
include "conexionDB.php";

//creamos una nueva instancia de la clase
$conexion = new conexionBD();
if(isset($_GET['o'])){
    switch($_GET['o']){
        case "listastablas":
            echo $conexion->listadoTablas();
            break;
        case "tabla":
            echo $conexion->seleccionaTabla($_GET['tabla']);
            break;
        case "columnastabla":
            echo $conexion->columnasTabla($_GET['tabla']);
            break;
    }
}


?>