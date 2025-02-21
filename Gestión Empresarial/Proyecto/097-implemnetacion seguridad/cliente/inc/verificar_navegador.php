<?php
/** 
 * ## Descripción:
 * Este archivo forma parte del sistema de seguridad y su función principal es **verificar si una IP accedió con un navegador prohibido**.
 * Actualmente, el sistema **bloquea el acceso a usuarios que utilicen Mozilla Firefox**, aunque se pueden añadir más navegadores si es necesario.
 * 
 * ## Funcionamiento:
 * 1. **Incluye el archivo `sis_seguridad.php`** para acceder a la configuración de seguridad y la conexión a la base de datos.
 * 2. **Define la función `navegadorProhibido($ip, $conexion)`**:
 *    - Consulta la tabla `ips_control` en la base de datos para verificar qué navegador ha sido registrado con la dirección IP dada.
 *    - Si el navegador registrado es **Firefox**, devuelve `true`, indicando que el acceso debe ser restringido.
 *    - En caso contrario, devuelve `false`, permitiendo el acceso.
 * 
 * ## Dependencias:
 * - `sis_seguridad.php`: Proporciona la conexión a la base de datos.
 * - Base de datos: La tabla `ips_control` almacena la información de IPs y navegadores registrados.
 */

include_once __DIR__ . "/sis_seguridad.php";

function navegadorProhibido($ip, $conexion) {
    $stmt = $conexion->getConexion()->prepare("SELECT navegador FROM ips_control WHERE ip = ?");
    $stmt->bind_param("s", $ip);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $navegadorRegistrado = $resultado->fetch_assoc()['navegador'] ?? 'Desconocido';

    return ($navegadorRegistrado === 'Firefox');  // Puedes agregar más navegadores si lo deseas
}
?>
