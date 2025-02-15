<?php
// Manejo de autenticación (Registro e Inicio de Sesión)
header('Content-Type: application/json');

// Configuración de la base de datos MySQL
$dbHost = 'localhost';
$dbName = 'redchat';
$dbUser = 'crismon1';
$dbPass = 'crismon1';

try {
    // Establecer la conexión a la base de datos
    $db = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8", $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Enviar mensaje de error si la conexión falla
    echo json_encode(['success' => false, 'message' => 'Error al conectar con la base de datos']);
    exit;
}

// Obtener la acción enviada desde el frontend (signup o login)
$action = $_POST['action'] ?? '';

if ($action === 'signup') {
    //////////////////////////////  REGISTRO DE USUARIO  //////////////////////////////////
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validar que todos los campos estén llenos
    if (!$username || !$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos']);
        exit;
    }

    // **Importante:** Aquí se omite el hash de la contraseña y se guarda en texto plano.
    try {
        // Insertar el usuario en la base de datos con estado 'offline'
        $stmt = $db->prepare("INSERT INTO users (username, email, password, status) VALUES (?, ?, ?, 'offline')");
        $stmt->execute([$username, $email, $password]);
        echo json_encode(['success' => true, 'message' => 'Usuario registrado']);
    } catch(PDOException $e) {
        // Error si el usuario o correo ya existen
        echo json_encode(['success' => false, 'message' => 'El usuario o email ya existe']);
    }

} elseif ($action === 'login') {
    // INICIO DE SESIÓN
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validar que los datos estén completos
    if (!$username || !$password) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos']);
        exit;
    }

    // Buscar el usuario en la base de datos
    $stmt = $db->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Comparar directamente la contraseña en texto plano
    if ($user && $password === $user['password']) {
        // Cambiar el estado del usuario a 'online'
        $stmtUpdate = $db->prepare("UPDATE users SET status = 'online' WHERE id = ?");
        $stmtUpdate->execute([$user['id']]);
        
        echo json_encode(['success' => true, 'user_id' => $user['id']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}
?>
