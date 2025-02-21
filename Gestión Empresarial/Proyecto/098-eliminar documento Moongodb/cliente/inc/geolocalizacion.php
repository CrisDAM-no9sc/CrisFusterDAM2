<?php

/**
 * ##  Descripción:
 * Este archivo se encarga de la **verificación geográfica** de los accesos al sistema. 
 * Utiliza tanto la base de datos local como una API externa para obtener la ubicación 
 * geográfica de una dirección IP y determinar si el acceso está permitido.
 *
 * ## Funciones Principales:
 * - Obtiene el país de una IP desde la base de datos y, si no existe, consulta una API externa.
 * - Devuelve `true` si la IP pertenece a España (`'ES'`), `false` en caso contrario.
 *
 * ##  Notas:
 * - **Uso de API Externa:** Si la IP no está registrada en la base de datos, se realiza una consulta a `ip-api.com` para obtener la ubicación.
 * - **Optimización:** Se guarda la información en la base de datos para evitar consultas repetitivas a la API.
 * - **Seguridad:** Evita accesos no autorizados restringiendo el acceso únicamente a IPs españolas.
 */


include_once __DIR__ . "/sis_seguridad.php"; 

function obtenerPaisPorIP($ip, $conexion) {
    $stmt = $conexion->getConexion()->prepare("SELECT pais FROM ips_control WHERE ip = ?");
    $stmt->bind_param("s", $ip);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $pais = $resultado->fetch_assoc()['pais'] ?? null;

    // Si la IP no está en la base, usar API
    if (!$pais || $pais === "Desconocido") {
        $pais = obtenerPaisDesdeAPI($ip);
        // Guardar en la base de datos para futuras consultas
        $query_update = "UPDATE ips_control SET pais = ? WHERE ip = ?";
        $stmt_update = $conexion->getConexion()->prepare($query_update);
        $stmt_update->bind_param("ss", $pais, $ip);
        $stmt_update->execute();
    }

    return $pais;
}

function esIpDeEspaña($ip, $conexion) {
    return obtenerPaisPorIP($ip, $conexion) === 'ES';
}

?>
