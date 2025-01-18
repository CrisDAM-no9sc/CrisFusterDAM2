<?php
// Conectar a MongoDB (asegúrate de tener MongoDB en ejecución)
$cliente = new MongoDB\Driver\Manager("mongodb://localhost:27017");

// Definir el espacio de nombres como "base_de_datos.coleccion"
$namespace = "miempresa.clientes"; 

// Crear el objeto BulkWrite para insertar un documento
$bulk = new MongoDB\Driver\BulkWrite;

// Crear un documento para insertar
$documento = [
    'nombre' => 'Manuel Carrasco',
    'email' => ['manuel@personal.com', 'manuel@empresa.com'],
    'edad' => 50
];

// Insertar el documento en la colección
$bulk->insert($documento);

// Ejecutar la escritura en la base de datos
$cliente->executeBulkWrite($namespace, $bulk);

// Crear una consulta para obtener todos los documentos
$peticion = new MongoDB\Driver\Query([]);

// Ejecutar la consulta
$cursor = $cliente->executeQuery($namespace, $peticion);

// Imprimir todos los documentos
foreach ($cursor as $documento) {
    print_r($documento);  // Imprime cada documento
}
?>
