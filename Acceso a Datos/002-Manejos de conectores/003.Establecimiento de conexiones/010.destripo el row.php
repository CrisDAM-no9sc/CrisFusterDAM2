<?php

//habilitamos la visualizacion de errores para la depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


class conexionBD{
    //estas son las propiedades donde se guardara la información de conexion de la base de datos
    private $servidor;
    private $usuario;
    private $contrasena;
    private $basededatos;
    private $conexion;

    //AQUI LLAMMOS AL METODO CUANDO SE CREA UNA NUEVA INSTANCIA DE LA CLASE 
    public function __construct() {
        //aqui iniciamos los valores con las propiedades especificas 
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
    }

    // Método para seleccionar y devolver todos los registros de una tabla
	public function seleccionaTabla($tabla){
		
		$query = "SELECT * FROM ".$tabla.";";
        //ejecutamos la peticion
		$result = mysqli_query($this->conexion, $query);
        //creamos un array vacio
		$resultado = [];
        //para cada uno de los registros los añadimos al array
		while ($row = mysqli_fetch_assoc($result)) {
            //$resultado[] = $row;
            $fila = [];
            //itera sobre la clave(nombre de columna) y el valor (contenido de la celda)
            foreach($row as $clave=>$valor){
                //codifica el valor de columna y lo gurdamos en el array de fila 
                $fila[$clave] = $this->codifica($valor);
            }
            $resultado[]= $fila;
		}
        //lo codificamos como json y lo devolvemos con return
		$json = json_encode($resultado, JSON_PRETTY_PRINT);
		return $json;
	}
    //toma un valor de entrada y lo codifica para proteger los datos sensibles  
    private function codifica($entrada){
        return base64_encode($entrada);
    }
    //toma el valor codificado y lo decodifica
    private function decodifica($entrada){
        return base64_decode($entrada);
    }
}

$conexion = new conexionBD();
echo $conexion->seleccionaTabla("empleados");

?>