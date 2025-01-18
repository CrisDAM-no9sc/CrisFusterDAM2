<?php

// Conectar a MongoDB (asegúrate de tener MongoDB en ejecución)
$cliente = new MongoDB\Driver\Manager("mongodb://localhost:27017");

// Definir el espacio de nombres como "base_de_datos.coleccion"
$namespace = "miempresa.clientes"; 
// Crear la consulta vacía para obtener todos los documentos
$query = new MongoDB\Driver\Query([]);
// Ejecutar la consulta
$cursor = $cliente->executeQuery($namespace, $query);

// Imprimir todos los documentos
foreach ($cursor as $documento) {
    print_r($documento);  // Imprime cada documento
}

?>