<!-- 
    LISTA LOS FORMULARIOS DISPONIBLES
    - Muestra una lista de todos los formularios disponibles en forms/.
    - Permite acceder a cada formulario (index.php?f=nombre_formulario).
    - Permite ver los documentos generados (documentos.php?formulario=nombre_formulario).

-->



<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Formularios</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <main>
        <section>
            <div class="titulotabla">
                <h5>Lista de Formularios</h5>
                <p>Administra tus formularios de manera eficiente</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre del Formulario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                
                <?php
                $carpeta = 'forms'; // Carpeta que contiene los archivos JSON
                if (is_dir($carpeta)) {
                    $archivos = array_diff(scandir($carpeta), array('.', '..')); // Obtener archivos en la carpeta
                    foreach ($archivos as $archivo) {
                        // Comprobar si el archivo es un JSON
                        if (pathinfo($archivo, PATHINFO_EXTENSION) == 'json') {
                            $nombreFormulario = pathinfo($archivo, PATHINFO_FILENAME);
                            echo '<tr>';
                            echo '<td>' . htmlspecialchars($archivo) . '</td>';
                            echo '<td class="botones-accion">';
                            echo '<form action="index.php" method="get" class="formulario-en-linea">
                                    <input type="hidden" name="f" value="' . htmlspecialchars(pathinfo($archivo, PATHINFO_FILENAME)) . '">
                                    <button type="submit" class="boton boton-ver">Ver Formulario</button>
                                </form>';

                            echo '<form action="documentos.php" method="get" class="formulario-en-linea">
                                    <input type="hidden" name="formulario" value="' . htmlspecialchars($nombreFormulario) . '">
                                    <button type="submit" class="boton boton-accion">Ver Documentos</button>
                                </form>';
                            echo '</td>';
                            echo '</tr>';
                        }
                    }
                } else {
                    echo '<tr><td colspan="2">No se encontraron archivos</td></tr>';
                }
                ?>
                </tbody>
            </table>
        </section>
    </main>
</body>
</html>
