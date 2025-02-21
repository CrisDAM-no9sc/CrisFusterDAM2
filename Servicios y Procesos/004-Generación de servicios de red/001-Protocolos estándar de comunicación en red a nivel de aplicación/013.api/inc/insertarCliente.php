<?php
include "conexion.php"; // Asumimos que la conexión ya está hecha aquí

// Validación de la clave de API
$clave = $mysqli->real_escape_string($_POST['clave'] ?? '');

$peticion = "SELECT * FROM clavesapi WHERE clave = ?";
$stmt = $mysqli->prepare($peticion);
$stmt->bind_param("s", $clave);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    echo "Acceso correcto, vamos a realizar la inserción";
} else {
    die("Error de acceso");
}

// Validación de IP
$ip_servidor = $_SERVER['REMOTE_ADDR'];
$ips_permitidas = ["192.168.0.22", "127.0.0.1", "::1"];

if (!in_array($ip_servidor, $ips_permitidas)) {
    die("Error: IP no admitida");
}

// Insertar el cliente si los datos son válidos
if (isset($_POST['nombre']) && isset($_POST['apellidos'])) {
    $nombre = $mysqli->real_escape_string($_POST['nombre']);
    $apellidos = $mysqli->real_escape_string($_POST['apellidos']);

    $peticion = "INSERT INTO clientes (nombre, apellidos) VALUES (?, ?)";
    $stmt = $mysqli->prepare($peticion);
    $stmt->bind_param("ss", $nombre, $apellidos);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Cliente insertado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se pudo insertar el cliente"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
}
?>
