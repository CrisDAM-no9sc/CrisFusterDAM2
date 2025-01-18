<?php
// Asegurarse de que se muestren los errores durante el desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Para depuración: muestra el contenido de $_POST
var_dump($_POST);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer datos JSON sin procesar del cuerpo de la solicitud
    $datosSinProcesar = file_get_contents('php://input');
    $datosAnalizados = json_decode($datosSinProcesar, true);

    // Validar si los datos JSON son válidos
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($datosAnalizados)) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON no válidos']);
        exit;
    }

    // Crear un objeto SimpleXMLElement
    $xml = new SimpleXMLElement('<root/>');

    // Función para convertir un array en XML
    function arrayToXml(array $datos, SimpleXMLElement &$xml) {
        foreach ($datos as $clave => $valor) {
            if (is_array($valor)) {
                // Crear un nodo hijo si el valor es un array
                $nodoHijo = $xml->addChild(is_numeric($clave) ? "elemento$clave" : $clave);
                arrayToXml($valor, $nodoHijo); // Llamada recursiva
            } else {
                // Agregar el valor como texto del nodo
                $xml->addChild(is_numeric($clave) ? "elemento$clave" : $clave, htmlspecialchars($valor));
            }
        }
    }

    // Llamar a la función para convertir los datos en XML
    arrayToXml($datosAnalizados, $xml);

    // Formatear el XML para que sea legible
    $dom = new DOMDocument('1.0', 'UTF-8');
    $dom->preserveWhiteSpace = false;
    $dom->formatOutput = true;
    $dom->loadXML($xml->asXML());
    $formatoXml = $dom->saveXML();

    // Crear el directorio si no existe
    $directorio = 'xml';
    if (!is_dir($directorio)) {
        mkdir($directorio, 0777, true);
    }

    // Generar el nombre del archivo
    $nombreArchivo = $directorio . '/' . date('U') . '.xml';

    // Guardar el archivo XML
    if (file_put_contents($nombreArchivo, $formatoXml)) {
        http_response_code(200);
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Datos guardados en XML',
            'archivo' => $nombreArchivo
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
