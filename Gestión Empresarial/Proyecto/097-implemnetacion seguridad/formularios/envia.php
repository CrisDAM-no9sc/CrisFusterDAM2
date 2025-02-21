<?php
/*
*    Recibe los datos enviados desde index.php.
*    Valida los datos según las reglas definidas en el JSON del formulario.
*    Guarda la información en un archivo JSON dentro de documentos/{formulario}/.
*
*/

// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Obtener los datos enviados por el formulario
$datosenviados = $_POST;

// Verificar si el formulario fue enviado
if (!isset($_POST['formulario'])) {
    die("Error: No se recibió el nombre del formulario.");
}

// Sanitizar el nombre del formulario para evitar problemas con rutas
$formulario = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['formulario']);

// Definir la carpeta de destino dentro de `documentos/`
$carpeta_destino = __DIR__ . "/documentos/{$formulario}/";

// **Si la carpeta no existe, crearla**
if (!is_dir($carpeta_destino)) {
    if (!mkdir($carpeta_destino, 0777, true)) {
        die("Error: No se pudo crear la carpeta '{$carpeta_destino}'");
    }
}

// Generar un nombre de archivo único basado en la fecha y hora actual
$nombre_archivo = $carpeta_destino . date('Ymd_His') . ".json";

// Guardar los datos en el archivo JSON dentro de la carpeta del formulario
if (file_put_contents($nombre_archivo, json_encode($datosenviados, JSON_PRETTY_PRINT)) === false) {
    die("Error: No se pudo guardar el archivo '{$nombre_archivo}'");
}

// **Redirección automática al panel con mensaje de éxito**
header("Location: panel.php?mensaje=Formulario enviado correctamente");
exit;

?>
