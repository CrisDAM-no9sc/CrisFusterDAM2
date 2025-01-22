<?php


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
    include "lib/registros.php";

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
                $json = file_get_contents('php://input');
                $datos = json_decode($json, true);
                echo $conexion->buscar($_GET['tabla'], $datos);
                exit;

            case "actualizar":
                $json = file_get_contents('php://input');
                $datos = json_decode($json, true);
                echo $conexion->actualizar($datos);
                break;

            case "buscarSimilar":
                $json = file_get_contents('php://input');
                $datos = json_decode($json, true);
                echo $conexion->buscarSimilar($_GET['tabla'], $datos);
                break;

            case "insertar":
                $json = file_get_contents('php://input');
                var_dump($json);
                $datos = json_decode($json, true);
                var_dump($datos);
                $codificador = new Cifrado ();
                foreach($datos as $clave => $valor){
                    if($clave != "Identificador"){
                        $datos[$clave] = $codificador -> codifica($valor);
                    }
                }
                echo $conexion -> insertaTabla($_GET['tabla'], $datos);
                break;
        }

    }

?>