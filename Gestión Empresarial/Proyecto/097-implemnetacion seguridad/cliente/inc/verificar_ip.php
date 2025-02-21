<?php
/**
 * # Verificación de IP en Listas Negra o Blanca
 *
 * ## Descripción:
 * Este archivo contiene la función `ipEnLista()`, utilizada para verificar si una IP
 * está registrada en una lista blanca o negra dentro de la base de datos.
 *
 * ## Funciones principales:
 * - Conectar con la base de datos mediante `$conexion`.
 * - Consultar si la IP está en la lista negra (`lista_negra`) o blanca (`lista_blanca`).
 * - Devolver `true` si la IP está en la lista especificada, o `false` en caso contrario.
 */


    include_once __DIR__ . "/sis_seguridad.php";

    function ipEnLista($ip, $tipoLista, $conexion) {
        $columna = ($tipoLista === 'negra') ? 'lista_negra' : 'lista_blanca';

        $stmt = $conexion->getConexion()->prepare("SELECT * FROM ips_control WHERE ip = ? AND $columna = 1");
        $stmt->bind_param("s", $ip);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        return $resultado->num_rows > 0;
    }
?>
