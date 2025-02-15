<?php


    if (isset($_GET['archivo'])) {
        $archivo = 'documentos/' . basename($_GET['archivo']);
        if (file_exists($archivo)) {
            echo '<h1>Viendo el contenido de:' . htmlspecialchars($_GET['archivo']) . '</h1>';
            echo '<pre>' . htmlspecialchars(file_get_contents($archivo)) . '</pre>';
    } else {
        echo '<h1>Archivo no encontrado</h1>';
    }
    } else {
        echo '<h1>No se especificó ningún archivo</h1>';
    }

?>