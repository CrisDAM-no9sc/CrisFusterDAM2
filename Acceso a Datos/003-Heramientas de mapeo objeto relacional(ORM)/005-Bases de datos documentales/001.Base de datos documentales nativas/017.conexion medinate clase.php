<?php

class ConectorMongoDB {
    private $servidor;
    private $basededatos;
    private $conexion;

    public function __construct() {
        $this->servidor = "mongodb://localhost:27017";
        $this->basededatos = "miempresa";
        $this->conexion = new MongoDB\Driver\Manager($this->servidor);  
    }

    /////////////////////////////// FUNCION PARA SELECCIONAR ////////////////////
    public function listar($coleccion) {
        // Consulta vacía para obtener todos los documentos
        $peticion = new MongoDB\Driver\Query([]);  
        $namespace = $this->basededatos . "." . $coleccion; 

        // Usar la conexión correctamente
        $cursor = $this->conexion->executeQuery($namespace, $peticion); 

        $resultado = [];
        foreach ($cursor as $documento) {
            $resultado[] = $documento;
        }

        // Convertir el resultado a JSON y devolverlo
        $json = json_encode($resultado, JSON_PRETTY_PRINT);
        return $json;
    }
    /////////////////////////////// FUNCION PARA INSERTAR ////////////////////

    public function insertar($coleccion, $datos){
        $namespace = $this->basededatos.".".$coleccion;
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->insert($datos);
        $this->conexion->executeBulkWrite($namespace, $bulk);
        $peticion = new MongoDB\Driver\Query([]);
        $cursor = $this->conexion->executeQuery($namespace, $peticion);
        return 0;
    }

}

// Crear la instancia de la clase
$conexion = new ConectorMongoDB();

// Llamada al método listar para mostrar los documentos en la colección "clientes"
echo $conexion->listar("clientes");

// Datos a insertar
$documento = [
    'nombre' => 'Juan Pérez',
    'email' => 'juan.perez@example.com',
    'edad' => 30
];

// Llamada al método insertar para agregar el nuevo documento en la colección "clientes"
$conexion->insertar("clientes", $documento);  
?>
