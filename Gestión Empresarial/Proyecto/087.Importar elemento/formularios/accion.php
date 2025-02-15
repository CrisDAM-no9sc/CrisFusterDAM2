<!DOCTYPE html>
<html lang="es">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inserción de Datos</title>
    </head>
    <body>
        <?php
            $archivo = 'documentos/'.$_GET['archivo'].'';
            $datos = file_get_contents($archivo);
            $coleccion = json_decode($datos,true);

            $archivo =  'forms/productos.json';
            $datos = file_get_contents($archivo);
            $formulario = json_decode($datos, true);


            $campos = [];
            $valores = [];


            foreach($coleccion as $clave=>$valor){
                //echo $clave." - ".$valor."<br>";
                foreach($formulario as $entidad){
                    if($entidad['nombre'] == $clave){
                    // echo "Existe<br>";
                        $tabla = $entidad['tabla'];
                        $campo = $entidad['campo'];
                        //echo "Voy a insertar el $clave en la tabla $tabla y en la columna $campo<br>";
                        $campos[] = $campo;
                        $valores[] = $valor;
                        $tabla = $tabla;
                    }
                }
            }
            // Conectar a la base de datos
            $conexion = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

            // Asegurarse de que los valores estén entre comillas para la consulta SQL
            $valores_con_comillas = array_map(function($valor) {
                return "'$valor'"; // Escapa y pone los valores entre comillas
            }, $valores);

            // Crear la consulta SQL dinámica
            $peticion = "INSERT INTO $tabla (" . implode(",", $campos) . ") VALUES (" . implode(",", $valores_con_comillas) . ");";
            //echo $peticion;

            if (mysqli_query($conexion, $peticion)) {
                // Eliminar el archivo JSON después de insertarlo en la base de datos
                unlink($archivo);
            } else {
                echo "Error al insertar datos: " . mysqli_error($conexion);
            }
            // Cerrar la conexión a la base de datos
            mysqli_close($conexion);
            /////////////////////// le metemos el estilo del mensaje flotante /////////////////////////
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
        ?>
    </body>
</html>