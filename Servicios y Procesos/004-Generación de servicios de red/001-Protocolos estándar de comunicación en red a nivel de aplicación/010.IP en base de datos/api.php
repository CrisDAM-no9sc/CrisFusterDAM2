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
				$peticion = "
					SELECT * FROM clavesapi
					WHERE clave = '".$_POST['clave']."'
				";
				$resultado = mysqli_query($mysqli, $peticion);
				if($fila = mysqli_fetch_assoc($resultado)){
					echo "Acceso correcto, vamos a realizar la insercion";
				}else{
					die("Error de acceso");
				}
				if($_SERVER['SERVER_ADDR'] == "192.168.0.22"){

				}else{
					die("Error de IP no admitida");
				}
				///////////////// AQUI VAMOS APONER LA LOGICA DE INSERTAR ////////////
				if(isset($_POST['nombre']) && isset($_POST['apellidos'])){
					$peticion = "
						INSERT INTO clientes
						(nombre, apellidos)
						VALUES (
							'".$_POST['nombre']."',
							'".$_POST['apellidos']."'
						);
					";
					$resultado = mysqli_query($mysqli, $peticion);
				}else{
					echo "Error en la petición";
				}
				break;
			default:
				echo "no";
	}		 	
}else{
	echo "no";
}
?>