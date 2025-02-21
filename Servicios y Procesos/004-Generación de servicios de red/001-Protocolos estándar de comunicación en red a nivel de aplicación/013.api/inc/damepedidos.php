<?php
include "conexion.php";

// 🔍 Obtener los filtros desde la URL (GET)
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$fecha = isset($_GET['fecha']) ? $mysqli->real_escape_string($_GET['fecha']) : null;

// 📝 Construir la condición WHERE de forma dinámica
$where = [];

if ($id) {
    $where[] = "pedidos.Identificador = $id";
}

if ($fecha) {
    $where[] = "pedidos.fecha = '$fecha'";
}

// 🔗 Unir condiciones con AND si ambas existen
$whereClause = count($where) ? "WHERE " . implode(" AND ", $where) : "";

// 🔍 Consulta SQL con filtros dinámicos
$peticion = "
    SELECT 
        clientes.nombre AS nombre,  
        clientes.apellidos AS apellidos,  
        pedidos.Identificador AS pedido_id,  
        pedidos.fecha AS pedidos_fecha,  
        listapedidos.productos_nombre AS producto_id,  
        productos.nombre AS producto_nombre, 
        listapedidos.cantidad AS cantidad  
    FROM clientes  
    LEFT JOIN pedidos ON clientes.Identificador = pedidos.clientes_nombre  
    LEFT JOIN listapedidos ON pedidos.Identificador = listapedidos.pedidos_fecha
    LEFT JOIN productos ON listapedidos.productos_nombre = productos.Identificador
    $whereClause
";

// 🔎 Ejecutar la consulta
$resultado = mysqli_query($mysqli, $peticion);
$datos = [];

// 🛠️ Formatear los resultados en un JSON organizado
while ($fila = mysqli_fetch_assoc($resultado)) {
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
        $pedido_key = $fila['pedido_id'];
        if (!isset($datos[$cliente_key]["pedidos"][$pedido_key])) {
            $datos[$cliente_key]["pedidos"][$pedido_key] = [
                "id" => $fila['pedido_id'],
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

// 🔄 Reorganizar el array para eliminar índices innecesarios
$output = array_values($datos);
echo json_encode($output, JSON_PRETTY_PRINT);
?>
