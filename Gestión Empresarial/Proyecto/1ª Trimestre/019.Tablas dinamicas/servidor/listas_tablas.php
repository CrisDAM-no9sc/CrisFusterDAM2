<?php

	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);			        // Establezco el nivel de retorno de errores de PHP
	$mysqli = mysqli_connect("localhost","crismon1","crismon1","crismon1");		// Me conecto a la base de datos
	$query = "
		SHOW TABLES;
	";										                    // Compruebo si el usuario enviado existe en la base de datos
	$result = mysqli_query($mysqli, $query);	
    $aplicacione=[]; 				                                //Creamos un array vacio
	while ($row = mysqli_fetch_assoc($result)) {				//En el caso de que exista 
		$aplicaciones[] = $row;						            //añadimos nueva aplicacion al array
	}
    echo json_encode ($aplicaciones); 						    
	
	
?>