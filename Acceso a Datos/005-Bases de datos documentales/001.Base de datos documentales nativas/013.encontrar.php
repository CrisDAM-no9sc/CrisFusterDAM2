<?php
//creamos una nstancia que es el gestor principal para interactura con el servidor
// Conectar a MongoDB (asegúrate de tener MongoDB en ejecución)
//especidificamos la uri de mongo
$cliente = new MongoDB\Driver\Manager("mongodb://localhost:27017");

$query = new MongoDB\Driver\Query([]);

$namespace = "miempresa.clientes";

$cursor = $cliente->executeQuery($namespace, $query);

foreach ($cursor as $document) {
    print_r($document);
}

?>