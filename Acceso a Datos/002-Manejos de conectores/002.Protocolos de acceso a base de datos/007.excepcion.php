<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

    $enlace = mysqli_connect("localhost", "accesoadatos", "accesoadatos", "accesoadatos") OR die("error");

	
	$json = file_get_contents("C:/xampp/htdocs/Acceso a Datos/002-Manejos de conectores/002.Protocolos de acceso a base de datos/004.modelodedatos.json");
	$datos = json_decode($json, true);

	foreach ($datos as $dato) {
	    $nombredetabla = $dato['nombre'];
	    $cadena = "CREATE TABLE ".$nombredetabla." ( ";
	    foreach($dato['columnas'] as $columna){
	    	$cadena .= $columna['nombre']." ".$columna['tipo']." ";
				if($columna['tipo'] != "TEXT"){
					$cadena .= " (".$columna['longitud'].") ";
				}
				$cadena .= ",";
	    }
	    	$cadena = substr($cadena, 0, -1);
	    	$cadena .= " ) ";
			mysqli_query($enlace, $cadena);

	}
	
?>