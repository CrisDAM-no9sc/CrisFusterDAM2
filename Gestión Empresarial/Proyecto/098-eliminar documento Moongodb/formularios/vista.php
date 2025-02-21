<?php

/**
 * Funcionalidad:
 * Permite visualizar el contenido de un documento JSON en una página amigable.
 * Recibe el archivo a visualizar desde $_GET['archivo'].
 * La Carga el contenido del archivo JSON y lo formatea con json_encode().
 * Incluye un botón "Volver" para regresar a documentos.php.
 */


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verificar que se haya recibido un archivo en la URL
if (!isset($_GET['archivo'])) {
    die("<h1>Error: No se especificó un archivo.</h1>");
}

// Sanitizar el nombre del archivo para evitar accesos no autorizados
$archivo = preg_replace('/[^a-zA-Z0-9_\/.-]/', '', $_GET['archivo']);
$ruta_archivo = __DIR__ . "/documentos/" . $archivo;

// **Verificar si el archivo existe**
if (!file_exists($ruta_archivo)) {
    die("<h1>Error: El archivo no existe.</h1>");
}

// Obtener el contenido del archivo
$contenido = file_get_contents($ruta_archivo);
$contenido_json = json_decode($contenido, true);

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vista del Documento</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="contenedor-vista">
        <h1>Documento: <?php echo htmlspecialchars(basename($archivo)); ?></h1>
        <pre><?php echo json_encode($contenido_json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE); ?></pre>
        <button class="boton-vista"><a href="documentos.php?formulario=<?php echo urlencode(dirname($archivo)); ?>">Volver</a><button>
    </div>
</body>
</html>

