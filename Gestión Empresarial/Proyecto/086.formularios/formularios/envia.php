<?php
// Obtener los datos enviados por el formulario
$datosenviados = $_POST;

// Obtener el archivo JSON según el formulario enviado
$archivo = 'forms/'.$_POST['formulario'].'.json';

// Verificar si el archivo existe
if (!file_exists($archivo)) {
    die("Formulario no encontrado.");
}

// Leer el contenido del archivo JSON
$datos = file_get_contents($archivo);

// Decodificar el JSON en un array asociativo
$coleccion = json_decode($datos, true);

// Recorrer cada campo en el JSON para validar los datos enviados
foreach($coleccion as $clave=>$valor) {
    // Mostrar el límite mínimo según el JSON y el valor enviado desde el formulario
    echo "Límite mínimo en el json: ".$valor['min']."<br>";
    echo "Dato enviado desde el formulario: ".$datosenviados[$valor['nombre']]."<br>";

    // Validar que el dato enviado cumpla con el límite mínimo de caracteres
    if (strlen($datosenviados[$valor['nombre']]) >= $valor['min']) {
        echo "Es ok<br>";
    } else {
        die("Intento de ataque detectado: El valor para " . $valor['nombre'] . " no cumple con el mínimo.");
    }
    echo "<hr>";
}

// Guardar los datos recibidos en un archivo JSON con la fecha y hora actual
file_put_contents(
    "documentos/".date('U').".json",
    json_encode($datosenviados, JSON_PRETTY_PRINT)
);

echo "Datos recibidos y validados correctamente.";
?>
