<?php

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
        $this->usuario = "crismon1";
        $this->contrasena = "crismon1";
        $this->basededatos = "crismon1";
        
        // Establecer la conexión a la base de datos
        $this->conexion = mysqli_connect(
            $this->servidor, 
            $this->usuario, 
            $this->contrasena, 
            $this->basededatos
		);
    }

    ///////////////////////////////////// METODO PARA SELECCIONAR TABLA //////////////////////////////////////
    public function seleccionaTabla($tabla){	
        // Ejecutamos consulta para ver qué campos tienen restricciones							
        $query = "
            SELECT 
                *
            FROM 
                information_schema.key_column_usage
            WHERE 
                table_name = '".$tabla."' 
                AND 
                REFERENCED_TABLE_NAME IS NOT NULL;
        ";		
    
        $result = mysqli_query($this->conexion , $query);	
        $restricciones = [];		
        
        // Iteramos sobre cada fila del resultado de la consulta																		
        while ($row = mysqli_fetch_assoc($result)) {
            $restricciones[] = $row;																			 
        }
    
        $query = "SELECT * FROM ".$tabla.";";													
        $result = mysqli_query($this->conexion , $query);								
        $resultado = [];																						
        
        while ($row = mysqli_fetch_assoc($result)) {										
            $fila = [];
            
            foreach($row as $clave => $valor){														
                $pasas = true;																				
                
                foreach($restricciones as $restriccion){									
                    if($clave == $restriccion["COLUMN_NAME"]){							
                        $query2 = "
                            SELECT * 
                            FROM ".$restriccion["REFERENCED_TABLE_NAME"]."
                        ;";
                        $result2 = mysqli_query($this->conexion , $query2);
                        $cadena = "";
                        
                        // Verificar que se obtuvieron resultados
                        if ($result2 && mysqli_num_rows($result2) > 0) {
                            while ($row2 = mysqli_fetch_assoc($result2)) {
                                foreach($row2 as $campo){
                                    $cadena .= $campo."-";
                                }
                            }
                        }
                        
                        $fila[$clave] = rtrim($cadena, "-"); // Eliminar el último guión
                        $pasas = false;																
                    }
                }
                if($pasas == true){																				
                    $fila[$clave] = $valor;																	
                }
            }
            $resultado[] = $fila;		
        }
        
        $json = json_encode($resultado, JSON_PRETTY_PRINT);							
        return $json;																										
    }
    /////////////////////////////////   METODOS PARA LISTAR LAS TABLAS /////////////////////////////////////
    
    public function listadoTablas(){
        $query = "SHOW TABLES;";
		$result = mysqli_query($this->conexion, $query);
		$resultado = [];
		while ($row = mysqli_fetch_assoc($result)) {
            $fila = [];
            foreach($row as $clave=>$valor){
                $fila[$clave] = $valor;
            }
            $resultado[]= $fila;
		}
		$json = json_encode($resultado, JSON_PRETTY_PRINT);
		return $json;
    }
    ////////////////////////////////// METODO PARA INSERTAR NUEVOS REGISTROS ////////////////////////////

    public function insertarTabla($tabla,$valores){
        //Creamos string para guaradr los campos y datos
        $campos = "";
        $datos = "";
        //para cada uno de los datos añadimos el nombre y datos a los strings 
        foreach($valores as $clave=>$valor){
            $campos .= $clave.",";
            $datos .= "'".$valor."',";
        }
        //Le quitamos la ultima coma
        $campos = substr($campos,0,-1);
        $datos = substr($datos,0,-1);
        //preparamosla peticion a la base de datos
        $query = "INSERT INTO ".$tabla." (".$campos.") VALUES (".$datos.");";
        //ejecutamos la peticion
        $result = mysqli_query($this->conexion, $query);
        return 0;
        
    }

    //////////////////////////////////    METODO PACTUALIZAR NLSO REGISTROS    ////////////////////////////////
    //recibimos tres parametros :
    /* 
    tabla = es el nombre de la tabla que se va a ctualizar
    Valores= es un array donde estan las columnas y los nuevos valores
    id= el identficador que queremos actualizar
      */
    public function actualizaTabla($tabla,$valores,$id){
        
        //preparamosla peticion a la base de datos
        $query = "UPDATE " . $tabla . " SET ";
        //para cada uno de los datos los encadenamos con la peticion
        foreach($valores as $clave=>$valor){
            $query .= $clave . "='" . $valor . "',";
        }
        $query = substr($query, 0, -1);
        // Se añade la cláusula WHERE para especificar qué registro se debe actualizar
        // Utilizamos el ID proporcionado para encontrar el registro correcto
        $query .= " WHERE Identificador = " . $id;
        //ejecutamos la peticion
        $result = mysqli_query($this->conexion, $query);
        return "";
        
    }

    ////////////////////////////////////// METODO PARA ELIMINAR REGISTROS /////////////////////////////////////////

    public function eliminarTabla($tabla,$id){

        //preparamosla peticion a la base de datos
        $query = "DELETE FROM ".$tabla." WHERE Identificador = ".$id.";";
        //ejecutamos la peticion
        $result = mysqli_query($this->conexion, $query);

    }

    ///////////////////////////////// METODOS DECODIFICACION Y CODIFICACIÓN /////////////////////////////////////
    //toma un valor de entrada y lo codifica para proteger los datos sensibles  
    private function codifica($entrada){
        return base64_encode($entrada);
    }
    //toma el valor codificado y lo decodifica
    private function decodifica($entrada){
        return base64_decode($entrada);
    }
}

?>