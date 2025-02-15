<?php
/**ACTUA COMO UN CONTROLADOR , PARA INTERACTURA CON LA BASE DE DATOS MANEJANDO DIFERNETES SOLICITUDES HTTP (GET O POST)**/
	include 'C:/xampp/htdocs/Gestión Empresarial/Proyecto/077.probrar lib/servidor/lib/sanear.php';
	$json = file_get_contents('php://input');
	$datos = json_decode($json, true);
	if (!$datos) {
		die('{"resultado":"error", "mensaje": "No se recibieron datos válidos"}');
	}
	sanear($datos);

	include 'C:/xampp/htdocs/Gestión Empresarial/Proyecto/077.probrar lib/servidor/lib/fuerza_bruta.php';
	include 'C:/xampp/htdocs/Gestión Empresarial/Proyecto/077.probrar lib/servidor/lib/codificador.php';
	ini_set('display_errors', 1);																								// Activo errores
	ini_set('display_startup_errors', 1);																				// Activo errores de inicio
	error_reporting(E_ALL);																												
	
	include "conexionDB.php";
	include "ConectorMongoDB.php";

	//include "antiguo/codificador.php";														
	//creamos una nueva instancia , esta la usaremos para llamar a los metodos 
	$conexion = new conexionDB();
	$conexionmongo = new ConectorMongoDB();	
	//verificamos si existe el parametro o																							
	if(isset($_GET['o'])){
		//y dependiendo del valor se realizara una accion diferente 
		switch($_GET['o']){

			case "login":
				// Aquí se verifica el usuario y se genera el token
				$usuarioId = $_GET['usuarioId']; // Obtener el usuario de la base de datos o del POST
				$token = base64_encode($usuarioId . '-' . date('U')); // Generamos el token
				// Almacenar el token en la base de datos si es necesario o devolverlo
				echo json_encode(['token' => $token]); // Responder con el token generado
				break;
			//para ir a la aplicaicon que le corresponda al departamento
			case "compruebatoken":
				$token = isset($_GET['token']) ? base64_decode($_GET['token']) : null;
				if ($token) {
					// Descodificar el token para obtener el usuarioId y timestamp
					list($usuarioId, $timestamp) = explode('-', $token);
			
					// Verificar que el timestamp no haya expirado (por ejemplo, 1 hora)
					$diferencia = abs($timestamp - time()); // Comparar con la hora actual
					if ($diferencia < 3600) { // Si es menor a 1 hora
						echo json_encode(['resultado' => 'ok']);
					} else {
						echo json_encode(['resultado' => 'error', 'mensaje' => 'Token expirado']);
					}
				} else {
					echo json_encode(['resultado' => 'error', 'mensaje' => 'Token no válido']);
				}
				break;
			//si llamamo 
			case "listatablasaplicacion":
				echo $conexion->listadoTablasAplicacion($_GET['aplicacion']);																						
				break;
			//si llamamos a este metodo, nos devolvera todoas las listas de las tablas 
			case "listatablas":
				echo $conexion->listadoTablas();																						
				break;
			case "listadoaplicacionesusuario":
				echo $conexion->listadoAplicacionesUsuario($_GET['usuario']);																						
				break;
			case "datosgrafica":
				echo $conexion->datosGrafica();																						
				break;
			case "listacolecciones":
				echo $conexionmongo->listarColeccion();																						
				break;
			case "listadocumentos":
				echo $conexionmongo->listar($_GET['coleccion']);																						// Llamo a un metodo
				break;

			//nos seleccionara y devolvera los datos de una tabla especifica
			case "tabla":
				echo $conexion->seleccionaTabla($_GET['tabla']);																				
				break;
			//nos devolvera todos los nombres de las columanas de una tabla especifica
			case "columnastabla":
				echo $conexion->columnasTabla($_GET['tabla']);																						
				break;
			//elimina una fila de una tabla específica, utilizando un identificador único que se pasa
			case "eliminar":
				echo $conexion->eliminaTabla($_GET['tabla'],$_GET['id']);																						
				break;
			//el script recoje los datos de la solicitud y lo descodifica y luego llama al metodo buscar
			//pasandole el nomrbe de la tabla y los datos descodificados 
			//y relaimos la busqueda con esos conparametros 
			//de estos casos se espera una solicitud POST
			case "buscar":
				$json = file_get_contents('php://input');                   								
        		$datos = json_decode($json, true);																					
				echo $conexion->buscar($_GET['tabla'],$datos);																						
				break;
			case "actualizar":
				$json = file_get_contents('php://input');                   								
				$datos = json_decode($json, true);																					
				echo $conexion->actualizar($datos);																						
				break;
			///para hacer funcionar la barra del buscador 
			case "buscarSimilar":
					$json = file_get_contents('php://input');                   								
					$datos = json_decode($json, true);																					
					echo $conexion->buscarSimilar($_GET['tabla'],$datos);																						
					break;
			//igual que en el de busqueda, esperamos la solicitud POST con cuerpod e JSON
			//recoge los datos y los descodifica 
			//y inserta un nuevo registor en la tabla especifica
			case "insertar":
				$json = file_get_contents('php://input');                   								
        		$datos = json_decode($json, true);
				///metemos nuesstra clase de cifrado
				/*$codificador = new Cifrado();
				foreach($datos as $clave => $valor){
					if($clave != "Identificador"){
						$datos[$clave] = $codificador->codifica($valor);
					}
				}
				*/
				echo $conexion->insertaTabla($_GET['tabla'],$datos);																						
				break;
		}
	}
	include 'C:/xampp/htdocs/Gestión Empresarial/Proyecto/077.probrar lib/servidor/lib/registros.php';
?>
