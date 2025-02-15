<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Formularios</title>
    <style>

        html, body {
            padding: 0;
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #CDE8E5; 
            color: #4D869C;
        }

        main section {
            margin: 40px auto;
            max-width: 1000px;
            background-color: #EEF7FF;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            color: #4D869C;
            font-size: 1.2rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        table thead {
            background-color: #7AB2B2;
            color: #EEF7FF;
        }

        table th, table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #4D869C;
            letter-spacing: 0.05rem;
        }

        tbody tr:hover {
            background-color: #4D869C;
            color: #EEF7FF;
        }

        tbody tr:nth-child(even) {
            background-color: #CDE8E5;
        }

        .titulotabla {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background-color: #7AB2B2;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #EEF7FF;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .titulotabla h5 {
            margin: 0;
            font-size: 1.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05rem;
        }

        .titulotabla p {
            margin: 5px 0 0;
            font-size: 1rem;
            color: #EEF7FF;
        }

        .boton {
            background-color: #7AB2B2;
            color: #EEF7FF;
            width: 20%;
            margin-bottom: 5px;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .boton:hover {
            background-color: #4D869C;
        }
    </style>
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
                        <th>Formulario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                
                <?php
                            $carpeta = 'documentos'; // Carpeta que contiene los archivos JSON

                            // Función para listar archivos en la carpeta
                            function listarArchivos($directorio, $subcarpeta = '') {
                                $elementos = array_diff(scandir($directorio), array('.', '..'));
                                $archivos = [];
                                foreach ($elementos as $elemento) {
                                    $ruta = $directorio . DIRECTORY_SEPARATOR . $elemento;
                                    if (is_dir($ruta)) {
                                        $archivos = array_merge($archivos, listarArchivos($ruta, $subcarpeta . $elemento . '/'));
                                    } else {
                                        $archivos[] = ['carpeta' => $subcarpeta, 'archivo' => $elemento];
                                    }
                                }
                                return $archivos;
                            }
            
                            // Llamada a la función listarArchivos para obtener los archivos en la carpeta
                            $estructuraArchivos = listarArchivos($carpeta);
            
                            // Verificar si se encontraron archivos y mostrar la lista
                            if (!empty($estructuraArchivos)) {
                                foreach ($estructuraArchivos as $archivo) {
                                    // Filtrar solo los archivos JSON
                                    if (pathinfo($archivo['archivo'], PATHINFO_EXTENSION) == 'json') {
                                        $nombreArchivoSinExtension = pathinfo($archivo['archivo'], PATHINFO_FILENAME); // Sin .json
            
                                        echo '<tr>';
                                        echo '<td>' . htmlspecialchars($archivo['carpeta'] . $archivo['archivo']) . '</td>';
                                        
                                        // Formulario para ver el archivo
                                        echo '<td class="botones-accion">';
                                        echo '<form action="index.php" method="get" class="formulario-en-linea">
                                                <input type="hidden" name="carpeta" value="' . htmlspecialchars($archivo['carpeta']) . '">
                                                <input type="hidden" name="f" value="' . htmlspecialchars($nombreArchivoSinExtension) . '">
                                                    
                                                <button type="submit" class="boton boton-ver">Ver Formulario</button>
                                            </form>';
                                        
            
                                        // Formulario para ver el JSON
                                        echo '<form action="vista.php" method="get" style="display:inline;">
                                        <input type="hidden" name="carpeta" value="' . htmlspecialchars($archivo['carpeta']) . '">
                                                <input type="hidden" name="archivo" value="' . htmlspecialchars($archivo['archivo']) . '">
                                                
                                                <button type="submit" class="boton boton-ver">Vista del Json</button>
                                            </form>';
                                        
            
                                        // Formulario para realizar alguna acción (como en tu código original)
                                        echo '<form action="accion.php" method="get" class="formulario-en-linea">
                                                <input type="hidden" name="carpeta" value="' . htmlspecialchars($archivo['carpeta']) . '">
                                                <input type="hidden" name="archivo" value="' . htmlspecialchars($archivo['archivo']) . '">
                                                
                                                <button type="submit" class="boton boton-accion">Acción</button>
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
