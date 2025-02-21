<?php
/**
 * ## Funcionalidad:
 * - Muestra los documentos generados en `documentos/{formulario}/`.
 * - Lista los archivos JSON guardados para cada formulario.
 * - Permite visualizar y descargar los archivos JSON generados.
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentos - <?php echo isset($_GET['formulario']) ? htmlspecialchars($_GET['formulario']) : 'No especificado'; ?></title>
    <link rel="stylesheet" href="/formularios/estilo.css">
    <style>
        /* Estilo general */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #CDE8E5;
            color: #4D869C;
            text-align: center;
            margin: 0;
            padding: 0;
        }

        .contenedor {
            max-width: 800px;
            margin: 30px auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #4D869C;
            font-size: 2rem;
        }

        .mensaje {
            font-size: 1rem;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
        }

        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .info {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }

        .warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
        }

        th {
            background-color: #7AB2B2;
            color: white;
        }

        td a {
            text-decoration: none;
            color: #007bff;
            padding: 8px 12px;
            border-radius: 4px;
            transition: background 0.3s ease;
        }

        td a:hover {
            text-decoration: underline;
        }

        .boton-volver {
            display: inline-block;
            margin-top: 20px;
            background-color: #7AB2B2;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            text-decoration: none;
            transition: background 0.3s ease;
        }

        .boton-volver:hover {
            background-color: #4D869C;
        }
    </style>
</head>
<body>

<div class="contenedor">
    <?php
    // Obtener el nombre del formulario desde la URL
    $formulario = isset($_GET['formulario']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['formulario']) : null;

    if (!$formulario) {
        echo '<p class="mensaje error"> Error: No se especificó un formulario en la URL.</p>';
        exit;
    }

    echo "<h1>Documentos Generados para <span style='color: #7AB2B2;'>" . htmlspecialchars($formulario) . "</span></h1>";

    // Definir la carpeta específica de documentos para el formulario
    $carpeta_documentos = __DIR__ . "/documentos/{$formulario}/";

    // Verificar si la carpeta del formulario existe
    if (is_dir($carpeta_documentos)) {
        $archivos = array_diff(scandir($carpeta_documentos), array('.', '..')); // Obtener archivos

        if (count($archivos) > 0) {
            echo '<table>';
            echo '<thead><tr><th>Nombre del Documento</th><th>Acciones</th></tr></thead>';
            echo '<tbody>';

            foreach ($archivos as $documento) {
                if (pathinfo($documento, PATHINFO_EXTENSION) === 'json') {
                    echo '<tr>';
                    echo '<td>' . htmlspecialchars($documento) . '</td>';
                    echo '<td>';
                    echo '<a href="vista.php?archivo=' . urlencode($formulario . '/' . $documento) . '" class="boton-ver">Ver</a> ';
                    echo '<a href="descargar.php?archivo=' . urlencode($formulario . '/' . $documento) . '" class="boton-descargar">Descargar</a>';
                    echo '</td>';
                    echo '</tr>';
                }
            }

            echo '</tbody>';
            echo '</table>';
        } else {
            echo '<p class="mensaje warning">No se encontraron documentos para este formulario.</p>';
        }
    } else {
        echo '<p class="mensaje error">No se encontró la carpeta de documentos para este formulario.</p>';
    }
    ?>

    <a href="panel.php" class="boton-volver">Volver al Panel</a>
</div>

</body>
</html>
