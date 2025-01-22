<?php
	/*

	//ACTUA COMO UN CONTROLADOR , PARA INTERACTURA CON LA BASE DE DATOS MANEJANDO DIFERNETES SOLICITUDES HTTP (GET O POST)///
	//activamos la visualizacion de errores
	ini_set('display_errors', 1);		
	// activa los errors durante el proceso de inicio de php																						
	ini_set('display_startup_errors', 1);		
	//configura el php para recojer todos los tipos de errores,advertencias y notificaciones																		
	error_reporting(E_ALL);	
	
	include "lib/sanear.php";

	sanear($_REQUEST);
	$json = file_get_contents('php://input');
	$datos = json_decode($json, true);
	sanear($datos);

	include "lib/fuerza_bruta.php";
	include "lib/codificador.php";
	include "conexionDB.php";
	include "lib/registros.php"; // Incluir registros.php
	
	//include "antiguo/codificador.php";														
	//creamos una nueva instancia , esta la usaremos para llamar a los metodos 
	$conexion = new conexionDB();	
	//verificamos si existe el parametro o																							
	if(isset($_GET['o'])){
		//y dependiendo del valor se realizara una accion diferente 
		switch($_GET['o']){
			//si llamamos a este metodo, nos devolvera todoas las listas de las tablas 
			case "listatablas":
				echo $conexion->listadoTablas();																						
				break;
			case "datosgrafica":
				echo $conexion->datosGrafica();																						
				break;
			case "listacolecciones":
				echo $conexionmongo->listarColecciones();																						// Llamo a un metodo
				break;
			case "listadocumentos":
				echo $conexionmongo->listar($_GET['coleccion']);																						// Llamo a un metodo
				break;

			//nos seleccionara y devolvera los datos de una tabla especifica
			case "tabla":
				
				//echo $conexion->seleccionaTabla($_GET['tabla']);																				
				//break;
				


				$misdatos = $conexion->seleccionaTabla($_GET['tabla']); // Obtiene los datos de la tabla
				$misdatos = json_decode($misdatos, true); // Decodifica el JSON en un array asociativo

				if (!is_array($misdatos)) {
					 echo json_encode(["error" => "Datos no válidos recibidos de seleccionaTabla."]);
					 break;
				}
				echo json_encode($misdatos, JSON_PRETTY_PRINT);
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
				exit;
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
				var_dump($json);                								
        		$datos = json_decode($json, true);
				var_dump($datos);
				///metemos nuesstra clase de cifrado
				//$codificador = new Cifrado();
				//foreach($datos as $clave => $valor){
					//if($clave != "Identificador"){
						//$datos[$clave] = $codificador->codifica($valor);
					//}
				//}
				echo $conexion->insertaTabla($_GET['tabla'],$datos);																						
				break;
		}
	}
	*/

	/** ACTÚA COMO UN CONTROLADOR, PARA INTERACTUAR CON LA BASE DE DATOS MANEJANDO DIFERENTES SOLICITUDES HTTP (GET O POST) **/

    // 1. Desactivar la visualización de errores en producción
    //ini_set('display_errors', 0);
    //ini_set('display_startup_errors', 0);
    //error_reporting(0);

    // 2. Incluir archivos necesarios
    include "lib/sanear.php";
    include "lib/fuerza_bruta.php";
    include "lib/codificador.php";
    include "conexionDB.php";
    include "lib/registros.php"; // Incluir registros.php

    // 3. Sanitizar parámetros GET y POST
    sanear($_REQUEST);

    // 4. Leer el cuerpo de la solicitud
    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);

    // 5. Solo sanitizar $datos si es array u objeto
    if ($datos !== null && (is_array($datos) || is_object($datos))) {
        sanear($datos);
    }

  

    // 7. Crear instancia de la conexión a la base de datos
    $conexion = new conexionDB();

    // 8. Manejar la solicitud según el parámetro 'o'
    if (isset($_GET['o'])) {
        switch ($_GET['o']) {
            case "listatablas":
                echo $conexion->listadoTablas();
                exit;
            case "datosgrafica":
                echo $conexion->datosGrafica();
                exit;
            case "listacolecciones":
                echo $conexionmongo->listarColecciones();
                exit;
            case "listadocumentos":
                echo $conexionmongo->listar($_GET['coleccion']);
                exit;
            case "tabla":
                $misdatos = $conexion->seleccionaTabla($_GET['tabla']); // Obtiene los datos de la tabla
                $misdatos = json_decode($misdatos, true); // Decodifica el JSON en un array asociativo

                if (!is_array($misdatos)) {
                    echo json_encode(["error" => "Datos no válidos recibidos de seleccionaTabla."]);
                    break;
                }

                echo json_encode($misdatos, JSON_PRETTY_PRINT);
                break;
            case "columnastabla":
                echo $conexion->columnasTabla($_GET['tabla']);
                break;
            case "eliminar":
                echo $conexion->eliminaTabla($_GET['tabla'], $_GET['id']);
                break;
            case "buscar":
                echo $conexion->buscar($_GET['tabla'], $datos);
                exit;
            case "actualizar":
                echo $conexion->actualizar($datos);
                break;
            case "buscarSimilar":
                echo $conexion->buscarSimilar($_GET['tabla'], $datos);
                break;
            case "insertar":
                echo $conexion->insertaTabla($_GET['tabla'], $datos);
                break;
            default:
                echo json_encode(["error" => "Operación no reconocida"]);
                exit;
        }
    }

  

?>
