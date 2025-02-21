<?php

/**
 * ## Descripción:
 * Este archivo se encarga de **registrar y verificar accesos de usuarios** en la base de datos mediante:
 * - **Consulta de país de la IP** a través de una API externa.
 * - **Registro de IPs** en la base de datos (`ips_control`).
 * - **Actualización de país y navegador** en la base de datos cuando un usuario vuelve a conectarse.
 * - **Detección del navegador del usuario** para su posterior restricción si es necesario.
 *
 * ## Notas:
 * - Requiere `conexionDB.php` para conectar con la base de datos.
 * - Requiere `geolocalizacion.php` para verificar la ubicación geográfica de la IP.
 * - El registro de IPs permite futuras restricciones basadas en listas negras y ubicación.
 */


include_once __DIR__ . "/../conexionDB.php";
include_once __DIR__ . '/../../cliente/inc/geolocalizacion.php';

function obtenerPaisDesdeAPI($ip) {
    if ($ip === '::1' || $ip === '127.0.0.1') {
        return 'LOCALHOST'; // Evitar consulta de localhost
    }

    $url = "http://ip-api.com/json/{$ip}?fields=status,countryCode";
    $respuesta = file_get_contents($url);
    
    if ($respuesta === FALSE) {
        return "Desconocido"; // Si la API falla, no bloquear por país
    }

    $datos = json_decode($respuesta, true);
    return ($datos['status'] === 'success') ? $datos['countryCode'] : "Desconocido";
}

function registrarAcceso($ip, $conexion) {
    $navegador = detectarNavegador(); 
    $url = $_SERVER['REQUEST_URI'];
    $lista_negra = 0;
    $lista_blanca = 0;
    $pais = obtenerPaisDesdeAPI($ip); // Obtener país desde API
    $bloqueo_por_pais = 0;

    // Verificar si la IP ya está registrada
    $query_check = "SELECT ip FROM ips_control WHERE ip = ?";
    $stmt_check = $conexion->getConexion()->prepare($query_check);
    $stmt_check->bind_param("s", $ip);
    $stmt_check->execute();
    $resultado = $stmt_check->get_result();

    if ($resultado->num_rows === 0) {
        // Insertar nueva IP con país obtenido
        $query = "INSERT INTO ips_control (ip, navegador, url, lista_negra, lista_blanca, pais, bloqueo_por_pais) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->getConexion()->prepare($query);
        $stmt->bind_param("sssissi", $ip, $navegador, $url, $lista_negra, $lista_blanca, $pais, $bloqueo_por_pais);
        $stmt->execute();
    } else {
        // Actualizar navegador y país si es diferente
        $query_update = "UPDATE ips_control SET navegador = ?, pais = ? WHERE ip = ?";
        $stmt_update = $conexion->getConexion()->prepare($query_update);
        $stmt_update->bind_param("sss", $navegador, $pais, $ip);
        $stmt_update->execute();
    }
}

function detectarNavegador() {
    $userAgent = $_SERVER['HTTP_USER_AGENT'];

    if (strpos($userAgent, 'Firefox') !== false) return 'Firefox';
    if (strpos($userAgent, 'Chrome') !== false) return 'Chrome';
    if (strpos($userAgent, 'Edge') !== false) return 'Edge';
    if (strpos($userAgent, 'Safari') !== false && strpos($userAgent, 'Chrome') === false) return 'Safari';
    if (strpos($userAgent, 'Opera') !== false || strpos($userAgent, 'OPR') !== false) return 'Opera';

    return 'Desconocido';
}

?>