<?php
$messageFile = 'messages.txt';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST["usuario"] ?? "";
    $correo = $_POST["correo"] ?? "";
    
    if (empty($usuario) || empty($correo)) {
        echo "<p style='color: red;'>Todos los campos son obligatorios.</p>";
    } else {
        $registro = date('Y-m-d H:i:s') . " - $usuario, $correo\n";
        file_put_contents($messageFile, $registro, FILE_APPEND);
        echo "<p style='color: green;'>Registro exitoso.</p>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Usuarios</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; text-align: center; padding: 20px; }
        form { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        input, button { margin: 10px 0; padding: 10px; width: 80%; }
    </style>
</head>
<body>
    <h2>Registro de Usuario</h2>
    <form method="POST">
        <label>Usuario:</label>
        <input type="text" name="usuario" required><br>
        <label>Correo:</label>
        <input type="email" name="correo" required><br>
        <button type="submit">Registrar</button>
    </form>

    <h3>Usuarios Registrados</h3>
    <pre>
        <?php
        if (file_exists($messageFile)) {
            echo htmlspecialchars(file_get_contents($messageFile));
        } else {
            echo "No hay usuarios registrados.";
        }
        ?>
    </pre>
</body>
</html>
