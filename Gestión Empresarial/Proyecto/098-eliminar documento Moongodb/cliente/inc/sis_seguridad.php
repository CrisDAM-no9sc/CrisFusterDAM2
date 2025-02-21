<?php
/**
 * ## Descripción:
 * Este archivo es el **núcleo del sistema de seguridad** del proyecto. 
 * Se encarga de verificar y restringir el acceso al sistema basándose en:
 * - **Lista negra de IPs** (bloqueo de direcciones IP no autorizadas).
 * - **Restricción de navegadores** (impide el acceso desde navegadores no permitidos).
 * - **Ubicación geográfica** (permite solo accesos desde España).
 * - **Registro de accesos** (almacena la información de cada intento de conexión).
 *
 * ## Notas:
 * - Se requiere `conexionDB.php` para la conexión a la base de datos.
 * - Usa `ips_control.php` para manejar la gestión de direcciones IP.
 * - Utiliza `verificar_ip.php`, `verificar_navegador.php` y `geolocalizacion.php` para controles específicos.
 */


session_start(); //Iniciar sesión para evitar bucles infinitos

//Incluir los archivos con funciones de seguridad
include_once __DIR__ . "/../../servidor/conexionDB.php";
include_once __DIR__ . "/../../servidor/lib/ips_control.php"; // Ahora se encarga del registro automático de IPs
include_once __DIR__ . "/verificar_ip.php";
include_once __DIR__ . "/verificar_navegador.php";
include_once __DIR__ . "/geolocalizacion.php";

// ✅ Función para mostrar errores con diferentes colores de fondo
function mostrarError($titulo, $mensaje, $colorFondo = '#f8d7da') {
    die("
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: white; }
            h1 { color: black; }
            p { color: black; font-size: 18px; }
            .container { border: 2px solid white; background: $colorFondo; padding: 20px; display: inline-block; border-radius: 10px; }
        </style>
        <div class='container'>
            <h1>$titulo</h1>
            <p>$mensaje</p>
        </div>
    ");
}

$conexion = new conexionDB();
$direccionIP = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];

// Registrar acceso automáticamente
registrarAcceso($direccionIP, $conexion);

// Evitar doble verificación si el usuario ya está autenticado
if (isset($_SESSION['usuario_verificado']) && $_SESSION['usuario_verificado'] === true) {
    return;
}

// Verificar si la IP está en lista negra
if (ipEnLista($direccionIP, 'negra', $conexion)) {
    mostrarError("🚫 Acceso Denegado", "Tu IP ($direccionIP) ha sido bloqueada.", "#f8d7da");
}

// Verificar si el navegador está prohibido
if (navegadorProhibido($direccionIP, $conexion)) {
    mostrarError("⚠️ Acceso Restringido", "No se permite el acceso con este navegador.", "#fff3cd");
}

// Verificar si la IP es de España
if (!esIpDeEspaña($direccionIP, $conexion)) {
    mostrarError("🌍 Acceso Limitado", "El acceso solo está permitido desde España.", "#cce5ff");
}

// Si todo está bien, permitir el acceso
$_SESSION['usuario_verificado'] = true;
?>
