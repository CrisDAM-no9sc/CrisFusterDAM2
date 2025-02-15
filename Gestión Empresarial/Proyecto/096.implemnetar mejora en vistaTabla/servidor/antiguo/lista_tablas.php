<?php

	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);			       
	$mysqli = mysqli_connect("localhost","crismon1","crismon1","crismon1");		
	$query = "
		SHOW TABLES;
	";										
	$result = mysqli_query($mysqli, $query);				
	$aplicaciones = [];							
	while ($row = mysqli_fetch_assoc($result)) {					
		$aplicaciones[] = $row;							
	}
	echo json_encode($aplicaciones);						    
	
	
?>