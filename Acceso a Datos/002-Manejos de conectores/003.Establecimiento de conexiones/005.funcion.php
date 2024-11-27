<?php
function selecciona($tabla) {
    // Conexión a la base de datos
    $mysqli = mysqli_connect("localhost", "accesoadatos", "accesoadatos", "accesoadatos");
    
    // Verificación de la conexión
    if (!$mysqli) {
        die("Error en la conexión: " . mysqli_connect_error());
    }

    // Consulta SQL
    $query = "SELECT * FROM " . mysqli_real_escape_string($mysqli, $tabla) . ";";
    
    // Ejecutar la consulta
    $result = mysqli_query($mysqli, $query);
    
    // Verificación de la consulta
    if (!$result) {
        die("Error en la consulta: " . mysqli_error($mysqli));
    }

    // Recopilar resultados
    $resultado = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $resultado[] = $row;
    }

    // Codificar en JSON
    $json = json_encode($resultado, JSON_PRETTY_PRINT);
    
    // Cerrar la conexión
    mysqli_close($mysqli);
    
    return $json;
}

// Llamar a la función y mostrar los resultados
echo selecciona("clientes");
?>
