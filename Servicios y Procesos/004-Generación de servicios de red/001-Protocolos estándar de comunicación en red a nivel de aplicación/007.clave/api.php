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
		 	if(isset($_POST['clave']) && $_POST['clave'] == "Z1p@5kL8*Q3v"){
			 	// Aqui ponemos la logica de insertar cliente
			 		if(isset($_POST['nombre']) && isset($_POST['apellidos'])){
			 			$peticion = "
                        INSERT INTO 
                        clientes 
                        (nombre,apellidos) 
                        VALUES 
                        (
                            '".$_POST['nombre']."',
                            '".$_POST['apellidos']."'
                        );
                    ";
				  $resultado = mysqli_query($mysqli, $peticion);
			 		}else{
			 			echo "error en la peticion";
			 		}
		 		}else{
		 			echo "Acceso no permitido";
		 		}
		 		break;
		 default:
		 	echo "no";
	}
}else{
	echo "no";
}
?>