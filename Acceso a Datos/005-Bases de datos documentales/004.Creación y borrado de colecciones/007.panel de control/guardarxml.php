<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

var_dump($_POST);
///////////////////////////////////// Obtenemos y verificamos los datos json //////////////////////
// Verifica si la solicitud HTTP es de tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datosraw = file_get_contents('php://input');               // leemos el cuerpo de la solicitud
    $datosparse = json_decode($datosraw, true);                 // convierte el json en un array de php

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($datosparse)) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON no válidos']);
        exit;
    }
    //////////////////////////////////// CREACION DEL ARCHIVO XML ////////////////////////////
    // creamos unn objeto xml vacio
    $xml = new SimpleXMLElement('<root/>');
    
    function arrayToXml($array, SimpleXMLElement &$xml) {
        
        foreach ($array as $clave => $valor) {
            //si el valor de una clave es un array llama a la funcion para agregar los elementos hijos 
            if (is_array($valor)) {
                $subelemento = $xml->addChild(is_numeric($clave) ? "elemento$clave" : $clave);
                arrayToXml($valor, $subelemento);
            // si el valor simple no es un array agrega el valor como un nodo de texto
            } else {
                $xml->addChild(is_numeric($clave) ? "elemento$clave" : $clave, htmlspecialchars($valor, ENT_QUOTES, 'UTF-8'));
            }
        }
    }

    ///////////////////////////// FORMATEAMOS EL XML Y CREAMOS EL ARCHIVO /////////////////
    arrayToXml($datosparse, $xml);
    $dom = new DOMDocument('1.0', 'UTF-8');
    $dom->preserveWhiteSpace = false;       /// eliminamos los espacios en blanco 
    $dom->formatOutput = true;              /// habilitamos el formato de slaida 
    $dom->loadXML($xml->asXML());           /// cargamos elarchivo generado por simplexml
    $prettyXml = $dom->saveXML();           ///guardamos el xml ya formateado cmo una cadena

    ///////////////////// GENERACUION DEL NOMBRE DEL ARCHIVO Y CREACION DE DIRECOTRIO ////////////////
    // se genera usando el valor del parametro f y el tiempo 
    if (isset($_GET['f'])) {
        $nombrearchivo = 'xml/'.$_GET['f'].'/' . date('U') . '.xml';
    } else {
        //si este parametro no se proporciona en la url 
        http_response_code(400);
        echo json_encode(['error' => 'Parámetro "f" no proporcionado']);
        exit;
    }
    //aqui creamos un directorio si no exite 
    if (!file_exists('xml')) {
        mkdir('xml', 0777, true); 
    }
    //////////////////////////// GUARDAMOS EL ARCHIVO ///////////////////////////

    if (file_put_contents($nombrearchivo, $prettyXml)) {
        http_response_code(200);
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Datos guardados en XML',
            'archivo' => $nombrearchivo
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error al guardar el XML'
        ]);
    }
} else {
    // Manejar un método de solicitud no válido
    http_response_code(405);
    echo json_encode([
        'error' => 'Método de solicitud no válido. Use POST.'
    ]);
}
?>
