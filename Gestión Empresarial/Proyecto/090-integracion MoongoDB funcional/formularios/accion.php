<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inserción de Datos</title>
</head>
<body>
    <?php
               if (isset($_GET['carpeta']) && isset($_GET['archivo'])) {

                // Recuperar el archivo de la URL, manejando subcarpetas
                $archivo = 'documentos/' . $_GET['carpeta'] . '/' . $_GET['archivo'];
                $datos = file_get_contents($archivo);
                $coleccion = json_decode($datos, true);
    
                // Verificar si la decodificación fue exitosa
                if ($coleccion === null) {
                    die("Error al leer el archivo JSON.");
                }
                echo($datos);
    
                // Recuperar el formulario, considerando subcarpetas en 'forms/'
                $archivoFormulario = 'forms/' . rtrim($_GET['carpeta'], '/') . '.json';
    
                // Verificar si el archivo existe
                if (!file_exists($archivoFormulario)) {
                    die("El archivo del formulario no existe en la ruta: $archivoFormulario");
                }
    
                $datosFormulario = file_get_contents($archivoFormulario);
                $formulario = json_decode($datosFormulario, true);
    
                // Verificar si la decodificación del formulario fue exitosa
                if ($formulario === null) {
                    die("Error al leer el archivo del formulario.");
                }
    
                echo($datosFormulario);



        $campos = [];
        $valores = [];

        foreach ($coleccion as $clave => $valor) {
            foreach ($formulario as $entidad) {
                if ($entidad['nombre'] == $clave) {
                    $tabla = $entidad['tabla'];
                    $campo = $entidad['campo'];
                    $campos[] = $campo;
                    $valores[] = $valor;
                }
            }
        }

        // Verificar que hay campos y valores para insertar
        if (empty($campos) || empty($valores)) {
            die("No se encontraron datos válidos para insertar.");
        }

        // Conectar a la base de datos
        $conexion = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

        // Asegurarse de que los valores estén entre comillas para la consulta SQL
        $valores_con_comillas = array_map(function($valor) {
            return "'$valor'"; // Escapa y pone los valores entre comillas
        }, $valores);

        // Crear la consulta SQL dinámica
        $peticion = "INSERT INTO $tabla (" . implode(",", $campos) . ") VALUES (" . implode(",", $valores_con_comillas) . ");";

        // Ejecutar la consulta SQL
        if (mysqli_query($conexion, $peticion)) {
            // Eliminar el archivo JSON después de insertarlo en la base de datos
            unlink($archivo);
        } else {
            echo "Error al insertar datos: " . mysqli_error($conexion);
        }

        // Cerrar la conexión a la base de datos
        mysqli_close($conexion);

        // Mostrar mensaje de éxito
        echo "<style>
                .mensaje-exito {
                    background-color: #EEF7FF;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    color: #4D869C;
                    font-size: 1.2rem;
                    margin: 40px auto;
                    max-width: 600px;
                    text-align: center;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .mensaje-exito h1 {
                    text-align: center;
                    font-size: 2rem;
                    margin-bottom: 20px;
                    color: #7AB2B2;
                    text-transform: uppercase;
                }
            </style>";

        echo "<div class='mensaje-exito'>
                <h1>¡Datos enviados correctamente!</h1>
                <p>Serás redirigido en 5 segundos...</p>
            </div>";

        echo "<script>
                setTimeout(() => {
                    window.location.href = 'panel.php';
                }, 5000);
            </script>";

    } else {
        // Si los parámetros no están definidos
        echo "Parámetros 'archivo' o 'carpeta' no especificados.";
    }
    ?>
    
</body>
</html>
