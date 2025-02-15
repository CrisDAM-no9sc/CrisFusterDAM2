<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$host = "localhost";
$dbname = "crismon1";
$username = "crismon1";
$password = "crismon1";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta que relacione trabajador, categoría y puesto (ajusta nombres de tabla/columnas)
    $stmt = $pdo->query("
        SELECT
            t.nombre              AS nombre_trabajador,
            c.nombre_categoria    AS nombre_categoria,
            p.nombre_puesto       AS nombre_puesto
        FROM trabajadores t
        JOIN puestos p    ON t.puesto_identificador  = p.Identificador
        JOIN categorias c ON p.categoria_nombre      = c.Identificador
    ");

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Arrays para nodos y enlaces
    $nodes = [];
    $nodeIndexMap = []; // Mapea un nombre (ej. 'Carlos') al índice del nodo en $nodes
    $links = [];
    $index = 0;

    // Recorrer todas las filas y generar nodos/enlaces
    foreach ($result as $row) {
        $trabajador = $row['nombre_trabajador'];
        $categoria  = $row['nombre_categoria'];
        $puesto     = $row['nombre_puesto'];

        // 1) Añadir nodo del Trabajador (si no existe aún)
        if (!isset($nodeIndexMap[$trabajador])) {
            $nodeIndexMap[$trabajador] = $index;
            // Color azul, por ejemplo
            $nodes[] = [
                "name"  => $trabajador,
                "color" => "#1f77b4"
            ];
            $index++;
        }

        // 2) Añadir nodo de la Categoría
        if (!isset($nodeIndexMap[$categoria])) {
            $nodeIndexMap[$categoria] = $index;
            // Color naranja
            $nodes[] = [
                "name"  => $categoria,
                "color" => "#ff7f0e"
            ];
            $index++;
        }

        // 3) Añadir nodo del Puesto
        if (!isset($nodeIndexMap[$puesto])) {
            $nodeIndexMap[$puesto] = $index;
            // Color verde
            $nodes[] = [
                "name"  => $puesto,
                "color" => "#2ca02c"
            ];
            $index++;
        }

        // 4) Enlace Trabajador → Categoría
        $links[] = [
            "source" => $nodeIndexMap[$trabajador],
            "target" => $nodeIndexMap[$categoria],
            "value"  => 1
        ];

        // 5) Enlace Categoría → Puesto
        $links[] = [
            "source" => $nodeIndexMap[$categoria],
            "target" => $nodeIndexMap[$puesto],
            "value"  => 1
        ];
    }

    // Devolvemos todo en JSON
    echo json_encode([
        "nodes" => $nodes,
        "links" => $links
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
}
?>
