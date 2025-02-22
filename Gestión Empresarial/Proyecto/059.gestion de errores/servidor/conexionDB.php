<?php

class conexionDB{
    // Propiedades para la conexión a la base de datos
    private $servidor;
    private $usuario;
    private $contrasena;
    private $basededatos;
    private $conexion;

    // Constructor que inicializa las propiedades y establece la conexión
    public function __construct() {
        //INICIA LAS PROPIEDADES DE CONEXION
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

    ////////////////////////////////////////////   FUNCION DE BUSCAR     ////////////////////////////////////////////////

    public function buscar($tabla,$datos){
        $peticion = "SELECT * FROM ".$tabla." WHERE ";
        foreach($datos as $clave=>$valor){
            $peticion .= $clave."='".$valor."' AND "; 
        }
        $peticion .= " 1;";
    
        
        
        $resultado = mysqli_query($this->conexion , $peticion);
        $retorno = [];
        while ($fila = mysqli_fetch_assoc($resultado)) {									
            $retorno[] = $fila;																			
        }
        $json = json_encode($retorno, JSON_PRETTY_PRINT);							
        return $json;	
    }

    //////////////////////////////////////// BUSCAR SIMILARES EN EL SELECTOR //////////////////////////////////////
    public function buscarSimilar($tabla,$datos){
        $peticion = "SELECT * FROM ".$tabla." WHERE ";
        foreach($datos as $clave=>$valor){
            $peticion .= $clave." LIKE '%".$valor."%' AND "; 
        }
        $peticion .= " 1;";
       
        
        
        $resultado = mysqli_query($this->conexion , $peticion);
        $retorno = [];
        while ($fila = mysqli_fetch_assoc($resultado)) {										
            $retorno[] = $fila;																			
        }
        $json = json_encode($retorno, JSON_PRETTY_PRINT);							
        return $json;	
    }
    
    //////////////////////////////////////////// SELECCIONAR TABLA ///////////////////////////////////////
    public function seleccionaTabla($tabla){												
        $query = "SELECT 
                        *
                FROM 
                        information_schema.key_column_usage
                WHERE 
                        table_name = '".$tabla."'
                        AND
                        REFERENCED_TABLE_NAME IS NOT NULL
                ;";											

        $result = mysqli_query($this->conexion , $query);								
        $restricciones = [];																						
        while ($row = mysqli_fetch_assoc($result)) {										
            $restricciones[] = $row;																			
        }
        
        																		
        
        $query = "SELECT * FROM ".$tabla.";";														
        $result = mysqli_query($this->conexion , $query);								
        $resultado = [];																								
        while ($row = mysqli_fetch_assoc($result)) {										
                
           																		
                $fila = [];																									
                foreach($row as $clave=>$valor){													
                    $identificador = 1;
                    $pasas = true;																						
                    foreach($restricciones as $restriccion){									
                        if($clave == "Identificador"){
                            $identificador = $valor;
                        }
                        if($clave == $restriccion["COLUMN_NAME"]){							
                            
                            $query2 = "
                                SELECT * 
                                FROM ".$restriccion["REFERENCED_TABLE_NAME"]."
                                WHERE Identificador = ".$identificador."
                            ;";
                            $result2 = mysqli_query($this->conexion , $query2);
                            $cadena = "";
                            while ($row2 = mysqli_fetch_assoc($result2)) {
                                foreach($row2 as $campo){
                                    $cadena .= $campo."-";
                                }
                            }
                            
                            $fila[$clave] = $cadena;															
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
    

    ///////////////////////////////////////// SACAR EL LISTADO DE TABLAS /////////////////////////////////////////////

    public function listadoTablas(){
        $query = "
            SELECT 
                    table_name AS 'Tables_in_".$this->basededatos."', 
                    table_comment AS 'Comentario'
            FROM 
                    information_schema.tables
            WHERE 
                    table_schema = '".$this->basededatos."';
        ";																			
        
        $result = mysqli_query($this->conexion , $query);								
        $resultado = [];																						
        while ($row = mysqli_fetch_assoc($result)) {										
            																	
                $fila = [];
                foreach($row as $clave=>$valor){
                    $fila[$clave] = $valor;
                }
                $resultado[] = $fila;
        }
        $json = json_encode($resultado, JSON_PRETTY_PRINT);							
        return $json;																										
    }
    
    ////////////////////////////////////////////// PARA SACRA TODAS LAS COLUMNAS DE LA TABLA /////////////////////////////////

    public function columnasTabla($tabla){
        $query = "SHOW COLUMNS FROM ".$tabla.";";																				
        $result = mysqli_query($this->conexion , $query);								
        $resultado = [];																								
        while ($row = mysqli_fetch_assoc($result)) {										
          																		
                $fila = [];
                foreach($row as $clave=>$valor){
                    $fila[$clave] = $valor;
                }
                $resultado[] = $fila;
        }
        $json = json_encode($resultado, JSON_PRETTY_PRINT);						
        return $json;																										
    }
    
    ///////////////////////////////////////////// INSERTAR EN LA TABLA /////////////////////////////////////////////////

    public function insertaTabla($tabla,$valores){										
            $campos = "";																									
            $datos = ""; 																									
            foreach($valores as $clave=>$valor){												
                $campos .= $clave.",";																			
                $datos .= "'".$valor."',";																
            }
            $campos = substr($campos, 0, -1);															
            $datos = substr($datos, 0, -1);																
            $query = "
                INSERT INTO ".$tabla." 
                (".$campos.") 
                VALUES (".$datos.");
                ";	
                echo $query;
            $result = mysqli_query($this->conexion , $query);							
            return 0;																									
    }
    
    ///////////////////////////////////////// FUNCION DE ACTUALIZAR TABLA ////////////////////////////////////////////////////////

    public function actualizaTabla($tabla,$valores,$id){
            $query = "
                UPDATE ".$tabla." 
                SET
                ";																												
            foreach($valores as $clave=>$valor){												
                $query .= $clave."='".$valor."', ";													
            }
            $query = substr($query, 0, -2);																
                $query .= "
                WHERE Identificador = ".$id."
                ";																													
            echo $query;
            $result = mysqli_query($this->conexion , $query);							
            return "";							
    }

    /////////////////////////////////////////////// FUNCION PARA ELIMINAR REGISTRO //////////////////////////////////////////////

    public function eliminaTabla($tabla,$id){
        $query = "
                DELETE FROM ".$tabla." 
                WHERE Identificador = ".$id.";
                ";	
        $result = mysqli_query($this->conexion , $query);							
    }
    

    ///////////////////////////////////// FUNCIONES DESCODIFICA Y CODIFICAR //////////////////////////////////////////////////
    
    private function codifica($entrada){
        return base64_encode($entrada);
    }
    
    private function decodifica($entrada){
        return base64_decode($entrada);
    }
}

?>
