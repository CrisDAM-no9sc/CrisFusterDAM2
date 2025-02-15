<?php
if (isset($_GET['archivo'])) {
    $archivo = 'documentos/' . basename($_GET['archivo']);

    if (file_exists($archivo)) {
        $contenido = htmlspecialchars(file_get_contents($archivo));
        $nombreArchivo = htmlspecialchars($_GET['archivo']);
    } else {
        $error = "Archivo no encontrado.";
    }
} else {
    $error = "No se especificó ningún archivo.";
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vista del Archivo</title>
    <style>
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
            margin: 50px auto;
            background-color: #EEF7FF;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 1.8rem;
            color: #7AB2B2;
        }

        .contenido {
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            text-align: left;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .error {
            color: red;
            font-weight: bold;
        }

        .boton {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 15px;
            background-color: #7AB2B2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s ease;
        }

        .boton:hover {
            background-color: #4D869C;
        }
    </style>
</head>
<body>

<div class="contenedor">
    <?php if (isset($error)): ?>
        <p class="error"><?php echo $error; ?></p>
    <?php else: ?>
        <h1>Viendo el contenido de: <?php echo $nombreArchivo; ?></h1>
        <!-- le pongemos nl2br para los salto de linea para enseñar los archivos de un div sin usar el pre -->
        <div class="contenido"><?php echo nl2br($contenido); ?></div>
    <?php endif; ?>

    <a href="panel.php" class="boton">Volver</a>
</div>

</body>
</html>
