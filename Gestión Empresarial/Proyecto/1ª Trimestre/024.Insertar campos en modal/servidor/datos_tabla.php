<?php
	if(!isset($_GET['tabla'])){
		$tabla = "clientes";
	}else{
		$tabla = $_GET['tabla'];
	}
	// Establezco el nivel de retorno de errores de PHP
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	// Me conecto a la base de datos		        
	$mysqli = mysqli_connect("localhost","crismon1","crismon1","crismon1");	
	//hacemos la peticion a la base de dtaos 
	$query = "
		SELECT * FROM ".$tabla.";
	";
	//Ejecutamos la consulta el resultado lo almacenamos en $query									                    
	$result = mysqli_query($mysqli, $query);
	//Creamos un array vacio	
    $aplicacione=[];
	//recorremos los resultados devueltos del array 				                                
	while ($row = mysqli_fetch_assoc($result)) {
		//agrega cada fila del array aplicaciones que contiene todos lso registros obtenidos de la tabla clientes				 
		$aplicaciones[] = $row;						            
	}
	//covierte el array en el formato json
    echo json_encode ($aplicaciones); 						    
	
	
?>