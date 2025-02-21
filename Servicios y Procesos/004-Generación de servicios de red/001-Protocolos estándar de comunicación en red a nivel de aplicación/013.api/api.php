<?php
header('Content-Type: application/json'); // Siempre devolver JSON
include "inc/error.php";
$mysqli = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

if (isset($_GET['o'])) {
    switch ($_GET['o']) {
        case "clientes":
            include "inc/damepedidos.php";
            break;

        case "insertarCliente":
            include "inc/insertarCliente.php";
            break;

        default:
            echo json_encode(["status" => "error", "message" => "Operación no reconocida"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No se especificó ninguna operación"]);
}
?>
