<?php
    // Obtener los datos enviados por el formulario
    $datosenviados = $_POST;

    // Obtener el archivo JSON según el formulario enviado
    $archivo = 'forms/'.$_POST['formulario'].'.json';

    // Verificar si el archivo existe
    if (!file_exists($archivo)) {
        die("Formulario no encontrado.");
    }

    // Leer y decodificar el JSON
    $datos = file_get_contents($archivo);
    $coleccion = json_decode($datos, true);

    // Validar los datos enviados según el JSON
    foreach ($coleccion as $clave => $valor) {
        if (strlen($datosenviados[$valor['nombre']]) < $valor['min']) {
            die("Intento de ataque detectado: El valor para " . $valor['nombre'] . " no cumple con el mínimo.");
        }
    }
    mkdir('documentos/'.$_POST['formulario'],0777);
    // Guardar los datos recibidos en un archivo JSON con la fecha y hora actual
    file_put_contents(
        "documentos/".$_POST['formulario']."/".date('U').".json",
        json_encode($datosenviados, JSON_PRETTY_PRINT)
    );


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

