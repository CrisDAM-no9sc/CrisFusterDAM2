<?php

ini_set('display_errors', 1); // Activar errores
ini_set('display_startup_errors', 1); // Activar errores de inicio
error_reporting(E_ALL);

$mysqli = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

switch ($_GET['o']) {
    case "clientes":
        // Consulta para obtener los clientes, sus pedidos, productos y nombre de productos
        $peticion = "
            SELECT 
                clientes.nombre AS nombre,
                clientes.apellidos AS apellidos,
                pedidos.fecha AS pedidos_fecha,
                listapedidos.productos_nombre AS producto_id,
                productos.nombre AS producto_nombre, 
                listapedidos.cantidad AS cantidad
            FROM clientes
            LEFT JOIN pedidos ON clientes.Identificador = pedidos.clientes_nombre
            LEFT JOIN listapedidos ON pedidos.Identificador = listapedidos.pedidos_fecha
            LEFT JOIN productos ON listapedidos.productos_nombre = productos.Identificador  
        ";
        
        $resultado = mysqli_query($mysqli, $peticion);
        
        $datos = [];
        
        // Iterar sobre el resultado para organizar los datos
        while ($fila = mysqli_fetch_assoc($resultado)) {
            // Clave única del cliente: nombre y apellidos
            $cliente_key = $fila['nombre'] . " " . $fila['apellidos'];
            
            // Inicializar el cliente si no existe
            if (!isset($datos[$cliente_key])) {
                $datos[$cliente_key] = [
                    "cliente" => [
                        "nombre" => $fila['nombre'],
                        "apellidos" => $fila['apellidos']
                    ],
                    "pedidos" => []
                ];
            }

            // Solo agregar pedidos si hay fecha
            if ($fila['pedidos_fecha']) {
                $pedido_key = $fila['pedidos_fecha'];
                
                // Inicializar el pedido si no existe
                if (!isset($datos[$cliente_key]["pedidos"][$pedido_key])) {
                    $datos[$cliente_key]["pedidos"][$pedido_key] = [
                        "fecha" => $fila['pedidos_fecha'],
                        "productos" => []
                    ];
                }

                // Agregar productos, nombre del producto y cantidades si existen
                if ($fila['producto_nombre'] && $fila['cantidad']) {
                    $datos[$cliente_key]["pedidos"][$pedido_key]["productos"][] = [
                        "producto" => $fila['producto_nombre'],  // Mostrar el nombre del producto
                        "cantidad" => $fila['cantidad']
                    ];
                }
            }
        }

        // Reorganizar los datos en el formato deseado
        $output = [];
        foreach ($datos as $cliente) {
            $cliente_pedidos = [];
            foreach ($cliente['pedidos'] as $pedido) {
                // Solo agregar el pedido si tiene productos
                if (!empty($pedido['productos'])) {
                    $cliente_pedidos[] = $pedido;
                }
            }
            $output[] = [
                "cliente" => $cliente['cliente'],
                "pedidos" => $cliente_pedidos
            ];
        }

        // Devolver los datos en formato JSON
        echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;
    
    default:
        echo '{"resultado": "nada"}';
        break;
}

?>
