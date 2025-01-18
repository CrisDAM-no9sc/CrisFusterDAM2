<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

var_dump($_POST);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datosraw = file_get_contents('php://input');
    $datosparse = json_decode($datosraw, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($datosparse)) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON no válidos']);
        exit;
    }

    $xml = new SimpleXMLElement('<root/>');

    function arrayToXml($array, SimpleXMLElement &$xml) {
        foreach ($array as $clave => $valor) {
            if (is_array($valor)) {
                $subelemento = $xml->addChild(is_numeric($clave) ? "elemento$clave" : $clave);
                arrayToXml($valor, $subelemento);
            } else {
                $xml->addChild(is_numeric($clave) ? "elemento$clave" : $clave, htmlspecialchars($valor, ENT_QUOTES, 'UTF-8'));
            }
        }
    }

    arrayToXml($datosparse, $xml);
    $dom = new DOMDocument('1.0', 'UTF-8');
    $dom->preserveWhiteSpace = false;
    $dom->formatOutput = true;
    $dom->loadXML($xml->asXML());
    $prettyXml = $dom->saveXML();

    if (isset($_GET['f'])) {
        $nombrearchivo = 'xml/'.$_GET['f'].'/' . date('U') . '.xml';
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Parámetro "f" no proporcionado']);
        exit;
    }

    if (!file_exists('xml')) {
        mkdir('xml', 0777, true); 
    }

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
