<?php
///es un archivo con la lógica para consultar los pedidos de los clientes y organizarlos en formato JSON.
include "conexion.php";

// Definimos la consulta SQL que vamos a ejecutar
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

while ($fila = mysqli_fetch_assoc($resultado)) {
    // Construir la estructura JSON
    $cliente_key = $fila['nombre'] . " " . $fila['apellidos'];
    if (!isset($datos[$cliente_key])) {
        $datos[$cliente_key] = [
            "cliente" => [
                "nombre" => $fila['nombre'],
                "apellidos" => $fila['apellidos']
            ],
            "pedidos" => []
        ];
    }

    if ($fila['pedidos_fecha']) {
        $pedido_key = $fila['pedidos_fecha'];
        if (!isset($datos[$cliente_key]["pedidos"][$pedido_key])) {
            $datos[$cliente_key]["pedidos"][$pedido_key] = [
                "fecha" => $fila['pedidos_fecha'],
                "listapedidos" => []
            ];
        }

        if ($fila['producto_nombre'] && $fila['cantidad']) {
            $datos[$cliente_key]["pedidos"][$pedido_key]["listapedidos"][] = [
                "producto" => $fila['producto_nombre'],
                "cantidad" => $fila['cantidad']
            ];
        }
    }
}

// Reorganizar el array para eliminar índices de cliente y pedidos
$output = [];
foreach ($datos as $cliente) {
    $cliente_pedidos = [];
    foreach ($cliente['pedidos'] as $pedido) {
        $cliente_pedidos[] = $pedido;
    }
    $output[] = [
        "cliente" => $cliente['cliente'],
        "pedidos" => $cliente_pedidos
    ];
}

echo json_encode($output, JSON_PRETTY_PRINT);
?>