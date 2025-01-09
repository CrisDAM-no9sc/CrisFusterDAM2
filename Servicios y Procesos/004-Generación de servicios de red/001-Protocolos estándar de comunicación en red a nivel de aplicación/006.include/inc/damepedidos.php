<?php
///es un archivo con la lógica para consultar los pedidos de los clientes y organizarlos en formato JSON.

// Comprobamos si la conexión fue exitosa
if (!$mysqli) {
    die("Error de conexión: " . mysqli_connect_error());
}

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

// Ejecutamos la consulta
$resultado = mysqli_query($mysqli, $peticion);

// Verificamos si la consulta fue exitosa
if (!$resultado) {
    die("Error en la consulta: " . mysqli_error($mysqli));
}

// Inicializamos un array vacío para almacenar los datos que vamos a organizar
$datos = [];

// Comprobamos si hay resultados
if (mysqli_num_rows($resultado) > 0) {
    // Recorremos los resultados fila por fila
    while ($fila = mysqli_fetch_assoc($resultado)) {
        // Construir la clave del cliente usando el nombre y los apellidos
        $cliente_key = $fila['nombre'] . " " . $fila['apellidos'];

        // Si aún no hemos agregado ese cliente, inicializamos su estructura de datos
        if (!isset($datos[$cliente_key])) {
            $datos[$cliente_key] = [
                "cliente" => [
                    "nombre" => $fila['nombre'],  // Asignamos el nombre del cliente
                    "apellidos" => $fila['apellidos']  // Asignamos los apellidos del cliente
                ],
                "pedidos" => []  // Inicializamos un array vacío para los pedidos de este cliente
            ];
        }

        // Si hay una fecha de pedido, procesamos el pedido
        if ($fila['pedidos_fecha']) {
            // Usamos la fecha del pedido como clave para identificar cada pedido
            $pedido_key = $fila['pedidos_fecha'];

            // Si aún no hemos agregado ese pedido para el cliente, inicializamos su estructura
            if (!isset($datos[$cliente_key]["pedidos"][$pedido_key])) {
                $datos[$cliente_key]["pedidos"][$pedido_key] = [
                    "fecha" => $fila['pedidos_fecha'],  // Asignamos la fecha del pedido
                    "lineaspedido" => []  // Inicializamos un array vacío para las líneas del pedido (productos y cantidades)
                ];
            }

            // Si hay un producto y una cantidad, lo agregamos a las líneas del pedido
            if ($fila['producto_nombre'] && $fila['cantidad']) {
                $datos[$cliente_key]["pedidos"][$pedido_key]["lineaspedido"][] = [
                    "producto" => $fila['producto_nombre'],  // Asignamos el nombre del producto
                    "cantidad" => $fila['cantidad']  // Asignamos la cantidad del producto
                ];
            }
        }
    }

    // Reorganizamos los datos para que sean más fáciles de manejar
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

    // Finalmente, mostramos los datos en formato JSON
    echo json_encode($output, JSON_PRETTY_PRINT);
} else {
    echo "No se encontraron resultados.";
}

// Cerramos la conexión
mysqli_close($mysqli);
?>
