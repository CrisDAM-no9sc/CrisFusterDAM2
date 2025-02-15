<!doctype html>
<html>
    <head>
        <link rel="stylesheet" href="estilo.css">
    </head>
    <body>
        <form method="POST" action="envia.php">
		<h1><?php echo $_GET['f']; ?></h1>
			<input type="hidden" name="token" value="<?php echo base64_encode(date('U'));?>">
			<input type="hidden" name="formulario" value="<?php echo $_GET['f'];?>">
            <?php
                // Ruta del archivo JSON
                $archivo = 'forms/'.$_GET['f'].'.json';
                
                // Verificar si el archivo existe
                if (file_exists($archivo)) {
                    // Leer el archivo
                    $datos = file_get_contents($archivo);
                    // Decodificar el JSON
                    $coleccion = json_decode($datos, true);

                    // Comprobar si la decodificación fue exitosa
                    if ($coleccion) {
                        // Verificar si la clave 'campos' existe en la estructura
                        $campos = isset($coleccion['campos']) ? $coleccion['campos'] : $coleccion;

                        // Recorrer los campos del formulario (ya sea dentro de 'campos' o directamente el array)
                        foreach ($campos as $campo) {
                            // Verificar que cada campo tiene lo necesario
                            if (isset($campo['tipo'], $campo['nombre'], $campo['titulo'], $campo['descripcion'])) {
                                echo "<article>";
                                echo "<div class='texto'>";
                                echo "<p><strong>".htmlspecialchars($campo['titulo'])."</strong></p>";
                                echo "<p>".htmlspecialchars($campo['descripcion'])."</p>";
                                echo "</div>";

                                // Si el campo es un 'select', manejar las opciones
                                if (isset($campo['opciones']) && is_array($campo['opciones'])) {
                                    echo "<select name='".htmlspecialchars($campo['nombre'])."'>";
                                    foreach ($campo['opciones'] as $opcion) {
                                        echo "<option value='".htmlspecialchars($opcion)."'>".htmlspecialchars($opcion)."</option>";
                                    }
                                    echo "</select>";
                                } else {
                                    // Si no es un select, generar el input normal
                                    echo "<input 
                                            type='".htmlspecialchars($campo['tipo'])."' 
                                            name='".htmlspecialchars($campo['nombre'])."' 
                                            placeholder='".(isset($campo['valorejemplo']) ? htmlspecialchars($campo['valorejemplo']) : "")."' 
                                            minlength='".(isset($campo['min']) ? htmlspecialchars($campo['min']) : "")."' 
                                            maxlength='".(isset($campo['max']) ? htmlspecialchars($campo['max']) : "")."'";

                                    // Agregar validadores si existen
                                    if (isset($campo['validadorForm']) && !empty($campo['validadorForm'])) {
                                        echo " validadorForm='".htmlspecialchars($campo['validadorForm'])."'";
                                    }
                                    echo ">";
                                }
                                echo "</article>";
                            }
                        }
                    } else {
                        echo "<p>Error al leer los datos del archivo JSON.</p>";
                    }
                } else {
                    echo "<p>El archivo JSON no existe.</p>";
                }
            ?>

            <input type="submit" value="Enviar">
        </form>

        <script src="lib/validadorForm/validadorForm.js"></script>
        <link rel="stylesheet" href="lib/validadorForm/validadorForm.css">

    </body>
</html>