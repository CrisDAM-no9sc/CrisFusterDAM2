<?php

echo OPENSSL_VERSION_TEXT;
function enviarEmail($to, $subject, $message, $headers){
    $smtpServer = 'smtp.gmail.com'; // Servidor SMTP
    $port = 587; // Puerto para STARTTLS
    $username = 'dam2pruebasp@gmail.com'; // Tu correo
    $password = 'kitj wvum xpwt kzod'; // Contraseña de aplicación de Gmail

    // Abrir una conexión al servidor SMTP
    $socket = fsockopen($smtpServer, $port, $errno, $errstr, 10);
    if (!$socket) {
        echo "Error: $errstr ($errno)";
        return false;
    }

    // Leer la respuesta inicial del servidor
    fgets($socket, 515);

    // Iniciar el protocolo SMTP
    fwrite($socket, "EHLO localhost\r\n");
    fgets($socket, 515);

    // Iniciar conexión segura con STARTTLS (no SSL directo)
    fwrite($socket, "STARTTLS\r\n");
    fgets($socket, 515);
    
    // Habilitar el cifrado TLS correctamente
    if (!stream_socket_enable_crypto($socket, true,  STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        echo "Error al habilitar TLS";
        fclose($socket);
        return false;
    }

    // Autenticación
    fwrite($socket, "AUTH LOGIN\r\n");
    fgets($socket, 515);
    fwrite($socket, base64_encode($username) . "\r\n");
    fgets($socket, 515);
    fwrite($socket, base64_encode($password) . "\r\n");
    fgets($socket, 515);

    // Especificar el remitente
    fwrite($socket, "MAIL FROM: <$username>\r\n");
    fgets($socket, 515);

    // Especificar el destinatario
    fwrite($socket, "RCPT TO: <$to>\r\n");
    fgets($socket, 515);

    // Enviar el mensaje
    fwrite($socket, "DATA\r\n");
    fgets($socket, 515);
    fwrite($socket, "Subject: $subject\r\n$headers\r\n\r\n$message\r\n.\r\n");
    fgets($socket, 515);

    // Cerrar la conexión
    fwrite($socket, "QUIT\r\n");
    fgets($socket, 515);

    fclose($socket);
    return true;
}

// Ejemplo de uso
$to = 'cristinafg4631@gmail.com';
$subject = 'Asunto del correo';
$message = 'Hola, este es un mensaje de prueba.';
$headers = 'From: dam2pruebasp@gmail.com';

if (enviarEmail($to, $subject, $message, $headers)) {
    echo "Correo enviado exitosamente.";
} else {
    echo "Error al enviar el correo.";
}
?>
