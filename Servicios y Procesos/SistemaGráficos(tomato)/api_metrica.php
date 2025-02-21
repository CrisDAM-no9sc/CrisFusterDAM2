<?php
// Obtener el tipo de exportación ('csv' o 'json'). Por defecto, se usará JSON.
$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : 'json';

$archivo_datos = "carga_hora.txt"; // Archivo donde se guardan las métricas
$datos = [];

// Leer el archivo si existe y procesar cada línea
if (file_exists($archivo_datos)) {
    $lineas = file($archivo_datos, FILE_IGNORE_NEW_LINES);
    foreach ($lineas as $linea) {
        // Se asume que cada línea tiene los campos separados por coma
        $partes = explode(",", $linea);
        // Es recomendable validar que se tengan todos los campos necesarios
        if(count($partes) >= 8){
            $datos[] = [
                "tiempo"       => $partes[0],
                "cpu"          => floatval($partes[1]),
                "ram"          => floatval($partes[2]),
                "disco"        => floatval($partes[3]),
                "descarga"     => floatval($partes[4]),
                "subida"       => floatval($partes[5]),
                "temperatura"  => floatval($partes[6]),
                "conexiones"   => intval($partes[7])
            ];
        }
    }
}

if ($tipo === 'csv') {
    // Configurar las cabeceras para CSV
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="datos.csv"');

    $output = fopen('php://output', 'w');
    
    if (!empty($datos)) {
        // Escribir la fila de cabecera (las claves del primer registro)
        fputcsv($output, array_keys($datos[0]));
        
        // Escribir cada fila de datos
        foreach ($datos as $fila) {
            fputcsv($output, $fila);
        }
    }
    
    fclose($output);
    exit;
} else {
    // Exportar en formato JSON por defecto
    header('Content-Type: application/json');
    echo json_encode(["metrica" => $datos], JSON_PRETTY_PRINT);
}
?>
