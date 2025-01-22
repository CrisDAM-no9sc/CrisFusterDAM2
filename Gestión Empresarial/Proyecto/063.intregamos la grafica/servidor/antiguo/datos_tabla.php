<?php
	if(!isset($_GET['tabla'])){
		$tabla = "clientes";
	}else{
		$tabla = $_GET['tabla'];
	}
	
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);		
	$mysqli = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");		
	$query = "
		SELECT * FROM ".$tabla .";
	";										
	$result = mysqli_query($mysqli, $query);				
	$aplicaciones = [];							
	while ($row = mysqli_fetch_assoc($result)) {					
		$aplicaciones[] = $row;							
	}
	echo json_encode($aplicaciones);
	
?>