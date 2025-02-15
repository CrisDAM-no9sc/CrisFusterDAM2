<?php
/**ACTUA COMO UN CONTROLADOR , PARA INTERACTURA CON LA BASE DE DATOS MANEJANDO DIFERNETES SOLICITUDES HTTP (GET O POST)**/
	//activamos la visualizacion de errores
	ini_set('display_errors', 1);		
	// activa los errors durante el proceso de inicio de php																						
	ini_set('display_startup_errors', 1);		
	//configura el php para recojer todos los tipos de errores,advertencias y notificaciones																		
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
			//para ir a la aplicaicon que le corresponda al departamento
 			case "compruebatoken":
				//echo $_GET['token'];
				if(is_numeric(base64_decode($_GET['token']))){
					if((abs(base64_decode($_GET['token']) - date('U')) < 3600)){
						echo '{"resultado":"ok"}';
					}else{
						echo '{"resultado":"ko"}';
					}
					}else{
						echo '{"resultado":"ko"}';	
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
			///////// REALIZAR LAS BUSQUEDAS EN EL CAMPO DE BUSQUEDA ///////////////////////
			case "informe":
				$misdatos = $conexion->registro($_GET['tabla'], $_GET['id']);
				$misdatos = json_decode($misdatos, true);
				if (!is_array($misdatos)) {
					echo json_encode(["error" => "datos no válidos"]);
				}
				echo json_encode($misdatos, JSON_PRETTY_PRINT);
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
			/// SE ENCARGA DE HACER LA PETICION A LA BASE DE DATOS DESDE EL BOTON DE BUSQUEDA 
			case "buscarseleccion":
				$json = file_get_contents('php://input');                    
				$datos = json_decode($json, true);

				if ($datos) {
					try {
						echo $conexion->buscarSeleccion($_GET['tabla'], $datos);  // Intenta ejecutar la búsqueda
					} catch (Exception $e) {
						// Si hay algún error, devolver un mensaje JSON de error
						echo json_encode(["error" => "Hubo un problema al realizar la búsqueda: " . $e->getMessage()]);
					}
				} else {
					echo json_encode(["error" => "Datos de búsqueda inválidos"]);
				}
				break;

			///para hacer funcionar la barra del buscador 
			case "buscarSimilar":
				$json = file_get_contents('php://input');                   								
				$datos = json_decode($json, true);																					
				echo $conexion->buscarSimilar($_GET['tabla'],$datos);																						
				break;
			case "actualizar":
				$json = file_get_contents('php://input');                   								
				$datos = json_decode($json, true);																					
				echo $conexion->actualizar($datos);																						
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

?>
