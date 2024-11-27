<?php

// Habilitamos la visualización de errores para la depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class conexionBD {
    // Estas son las propiedades donde se guardará la información de conexión de la base de datos
    private $servidor;
    private $usuario;
    private $contrasena;
    private $basededatos;
    private $conexion;

    // Aquí llamamos al método cuando se crea una nueva instancia de la clase 
    public function __construct() {
        // Iniciamos los valores con las propiedades específicas 
        $this->servidor = "localhost";
        $this->usuario = "accesoadatos";
        $this->contrasena = "accesoadatos";
        $this->basededatos = "accesoadatos";
        
        // Establecer la conexión a la base de datos
        $this->conexion = mysqli_connect(
            $this->servidor, 
            $this->usuario, 
            $this->contrasena, 
            $this->basededatos
        );

        // Verificamos si la conexión fue exitosa
        if (mysqli_connect_errno()) {
            die("Error al conectar a la base de datos: " . mysqli_connect_error());
        }
    }

    // Método para seleccionar y devolver todos los registros de una tabla
    public function seleccionaTabla($tabla) {
        $query = "SELECT * FROM " . $tabla . ";";
        // Ejecutamos la petición
        $result = mysqli_query($this->conexion, $query);
        
        // Verificamos si la consulta fue exitosa
        if (!$result) {
            die("Error en la consulta: " . mysqli_error($this->conexion));
        }

        // Creamos un array vacío
        $resultado = [];
        // Para cada uno de los registros, los añadimos al array
        while ($row = mysqli_fetch_assoc($result)) {
            $resultado[] = $row;
        }
        // Lo codificamos como JSON y lo devolvemos con return
        $json = json_encode($resultado, JSON_PRETTY_PRINT);
        return $json;
    }

    private function codifica($entrada) {
        return base64_encode($entrada); 
    }
    
    private function decodifica($entrada) {
        return base64_decode($entrada);
    }
}

// Instancia de la clase y ejecución de la consulta
$conexion = new conexionBD();
echo $conexion->seleccionaTabla("empleados");

?>
