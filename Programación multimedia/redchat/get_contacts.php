<?php
//Obtiene los contactos de un usuario
header('Content-Type: application/json');

// Configuración de la base de datos
$dbHost = 'localhost';
$dbName = 'redchat';
$dbUser = 'crismon1';
$dbPass = 'crismon1';

try {
    $db = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8", $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al conectar con la base de datos']);
    exit;
}

// Obtener el ID del usuario
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;

if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Usuario inválido']);
    exit;
}

// Consulta para obtener los contactos
$stmt = $db->prepare("SELECT u.id, u.username FROM contacts c 
                      JOIN users u ON c.contact_id = u.id 
                      WHERE c.user_id = ?");
$stmt->execute([$user_id]);
$contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'contacts' => $contacts]);
?>
