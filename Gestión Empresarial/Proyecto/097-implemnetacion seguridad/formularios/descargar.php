<?php
/**
 * ##  Funcionalidad:
 * - Permite descargar un documento JSON almacenado en `documentos/`.
 */

if (isset($_GET['archivo'])) {
    $archivo = 'documentos/' . basename($_GET['archivo']);

    if (file_exists($archivo)) {
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="' . basename($archivo) . '"');
        readfile($archivo);
        exit;
    } else {
        echo "Error: Archivo no encontrado.";
    }
} else {
    echo "Error: No se especificó ningún archivo.";
}
?>