<?php
//Servidor WebSocket para mensajes en tiempo real

require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

/////////////////////////// Clase que maneja el chat en WebSocket /////////////////////////////
class Chat implements MessageComponentInterface {
    protected $clients;
    protected $db;

    public function __construct($db) {
        $this->clients = new \SplObjectStorage;
        $this->db = $db;
        echo "Servidor WebSocket iniciado...\n";
    }

    public function onOpen(ConnectionInterface $conn) {
        // Se añade la nueva conexión de un usuario
        $this->clients->attach($conn);
        echo "Nueva conexión: {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        if (!$data) {
            return;
        }

        //////////////////////// Manejar autenticación de usuario en WebSocket ///////////////////////////
        if (isset($data['type']) && $data['type'] === 'auth') {
            $from->userId = $data['user_id'];
            echo "Conexión autenticada para el usuario {$data['user_id']}\n";
            return;
        }

        //////////////////////////// Procesar un mensaje de chat ////////////////////////////////
        $sender_id   = $data['sender_id'] ?? null;
        $receiver_id = $data['receiver_id'] ?? null;
        $message     = $data['message'] ?? '';

        echo "Mensaje de usuario {$sender_id} a usuario {$receiver_id}: {$message}\n";

        ////////////////////////////////////// Enviar el mensaje al usuario receptor ////////////////////
        foreach ($this->clients as $client) {
            if (isset($client->userId) && $client->userId == $receiver_id) {
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // Se elimina la conexión cerrada
        $this->clients->detach($conn);
        echo "Conexión {$conn->resourceId} cerrada\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}

///////////////////////////////// Configurar la conexión a la base de datos ///////////////////////////////
$dbHost = 'localhost';
$dbName = 'redchat';
$dbUser = 'crismon1';
$dbPass = 'crismon1';

try {
    $db = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8", $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Error al conectar con la base de datos: " . $e->getMessage() . "\n";
    exit;
}

// Iniciar el servidor WebSocket en el puerto 8080
$port = 8080;
$chat = new Chat($db);

$server = \Ratchet\Server\IoServer::factory(
    new \Ratchet\Http\HttpServer(
        new \Ratchet\WebSocket\WsServer($chat)
    ),
    $port
);

echo "Servidor de chat corriendo en ws://localhost:{$port}\n";
$server->run();
?>
