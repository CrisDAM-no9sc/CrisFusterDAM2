<?php
include "conexion.php";

ini_set('display_errors', 1); // Activo errores
ini_set('display_startup_errors', 1); // Activo errores de inicio
error_reporting(E_ALL);	



if(isset($_GET['o'])){
	switch ($_GET['o']) {
		 case "clientes":
		     include "inc/damepedidos.php";
		     break;
        
		case "insertarCliente":
				include "inc/insertarCliente.php";
				break;
			default:
				echo "no";
	}		 	
}else{
	echo "no";
}
?>