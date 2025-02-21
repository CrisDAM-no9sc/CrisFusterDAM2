<?php

/**
 * ## Descripción:
 * Este archivo implementa una **clase para la gestión de bases de datos en MongoDB** dentro del sistema.
 * Permite la conexión, consulta, inserción y eliminación de documentos en una base de datos **NoSQL**.
 *
 * ## Funcionalidades:
 * - `listar($coleccion)`: Devuelve todos los documentos de una colección en formato JSON.
 * - `listarColeccion()`: Lista todas las colecciones disponibles en la base de datos.
 * - `insertar($coleccion, $datos)`: Inserta un nuevo documento en la colección especificada.
 * - `eliminar($coleccion, $id)`: Elimina un documento específico según su `_id`.
 *
 */




class ConectorMongoDB {
    private $servidor;
    private $basededatos;
    private $conexion;

    public function __construct() {
        $this->servidor = "mongodb://localhost:27017";
        $this->basededatos = "crismon1";
        $this->conexion = new MongoDB\Driver\Manager($this->servidor);  
    }


    //////////////////// Validar si el ObjectId es válido /////////////////
    public function validarObjectId($id) {
        // Verifica si el ID es una cadena hexadecimal de 24 caracteres
        return is_string($id) && preg_match('/^[a-f\d]{24}$/i', $id);
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
    /////////////////////////////// FUNCION PARA SELECCIONAR ////////////////////

    public function listarColeccion(){
        $peticion = new MongoDB\Driver\Command(["listCollections"  => 1]);
        $cursor = $this->conexion->executeCommand($this->basededatos, $peticion);

        $colecciones = [];
        $nombreClave = "Tables_in_".$this->basededatos;

        foreach($cursor as $coleccion){
            $fila = [
                $nombreClave => $coleccion->name,
                "Comentario" => ""
            ];

            $colecciones[] = $fila;
        }
        $json =  json_encode($colecciones, JSON_PRETTY_PRINT);
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

    /////////////////////////// FUNCION ELIMIAR DOCUMENTOS //////////////////////
    public function eliminar($coleccion, $id) {
        $namespace = $this->basededatos . "." . $coleccion;
        $bulk = new MongoDB\Driver\BulkWrite;
    
        // Validar el ID antes de eliminar
        if (!$this->validarObjectId($id)) {
            return json_encode(["error" => "El ID proporcionado no es válido"], JSON_PRETTY_PRINT);
        }
    
        // Convertir el ID a ObjectId
        $filtro = ['_id' => new MongoDB\BSON\ObjectId($id)];
        $bulk->delete($filtro, ['limit' => 1]);
    
        // Ejecutar la eliminación
        $result = $this->conexion->executeBulkWrite($namespace, $bulk);
    
        // Verificar si realmente se eliminó un documento
        if ($result->getDeletedCount() > 0) {
            return json_encode(["mensaje" => "Documento eliminado correctamente"], JSON_PRETTY_PRINT);
        } else {
            return json_encode(["error" => "No se encontró ningún documento con ese ID."], JSON_PRETTY_PRINT);
        }
    }
    //////////////////////////////////////// FUNCIPON ACTUALIZAR /////////////////////////////
    public function actualizar($coleccion, $id, $datos) {
        $namespace = $this->basededatos . "." . $coleccion;
        $bulk = new MongoDB\Driver\BulkWrite;
    

        // Asegúrate de que los datos sean válidos
        if (!is_array($datos) || empty($datos)) {
            return json_encode(["error" => "Datos de actualización inválidos."], JSON_PRETTY_PRINT);
        }

        // Realizar la actualización
        $bulk->update(
            ['_id' => $id],             // Filtro por ID
            ['$set' => $datos]          // Actualizar solo los campos enviados
        );
    
        $result = $this->conexion->executeBulkWrite($namespace, $bulk);
    
        if ($result->getModifiedCount() > 0) {
            return json_encode(["mensaje" => "Documento actualizado correctamente"]);
        } else {
            return json_encode(["mensaje" => "No se realizaron cambios en el documento."]);
        }
    }
}


?>
