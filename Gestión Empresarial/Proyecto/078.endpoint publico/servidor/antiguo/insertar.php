<?php
    $mysqli = mysqli_connect("localhost","crismon1","crismon1","crismon1");	

    // Atrapo lo que viene de formulario
    $json = file_get_contents('php://input');									
    //lo descodificamos como JSON
    $data = json_decode($json, true);													
    //para cada una de lasclaves del objeto
    foreach($data as $clave=>$valor){	
        // Siempre que no sea el identificador												
    	if($clave == 'tabla'){	
        // Lo encadeno con la petición SQL																
        $tabla = $valor;																				
        }
    }
    // Comienzo a formatear la peticion
    $peticion = "INSERT INTO ".$tabla." VALUES(NULL,";					
    // Para cada una de las claves del objeto
    foreach($data as $clave=>$valor){			
        // Siempre que no sea el identificador									
    	if($clave != "Identificador" && $clave != 'tabla'){	
        //lo encadenamos con la peticion SQL											
        $peticion .= "'".$valor."',";													
        }
    }
    // Le quito la última coma
    $peticion = substr($peticion, 0, -1);											
    // Le encadeno el último paréntesis
    $peticion .= ");";		
    // Lanzo la petición por pantalla																		
    echo $peticion;																						
    $result = mysqli_query($mysqli, $peticion);
?>