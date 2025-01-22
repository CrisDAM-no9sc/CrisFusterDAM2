<?php

class conexionDB{
    // Propiedades para la conexión a la base de datos
    //definimos propiedades privadas para alamacenar los detalles de la conexion
    //y la propiedad de conexion
    private $servidor;
    private $usuario;
    private $contrasena;
    private $basededatos;
    private $conexion;

    // Constructor que inicializa las propiedades y establece la conexión
    //se llama especialmente cuando se crea un objeto de la clase
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

////////////////////////////////////////////////   FUNCION DE BUSCAR     ////////////////////////////////////////////////

    public function buscar($tabla,$datos){
        $peticion = "SELECT * FROM ".$tabla." WHERE ";
        foreach($datos as $clave=>$valor){
            $peticion .= $clave."='".$valor."' AND "; 
        }
        $peticion .= " 1;";
        //echo $peticion;
        
        //ejecutamos la consulta
        $resultado = mysqli_query($this->conexion , $peticion);
        $retorno = [];
        //aqui es donde recuperamos los resultados y los guardamos en un array
        while ($fila = mysqli_fetch_assoc($resultado)) {										
            $retorno[] = $fila;																			
        }
        $json = json_encode($retorno, JSON_PRETTY_PRINT);							
        return $json;	
    }
    
//////////////////////////////////// FUNCION DE SELECCIONAR TABLA ////////////////////////////////////////////

    // Esta función realiza dos tareas principales: obtener restricciones de claves externas y seleccionar datos de la tabla
    public function seleccionaTabla($tabla){	

        /*  obtener todas las columnas de la tabla que tienen restricciones de claves externas
        Estas restricciones se encuentran en el esquema de la base de datos (information_schema.key_column_usage)*/
        $query = "SELECT 
                        *
                FROM 
                        information_schema.key_column_usage
                WHERE 
                        table_name = '".$tabla."'
                        AND
                        REFERENCED_TABLE_NAME IS NOT NULL
        ;";											

        // Ejecutamos la consulta para obtener restricciones de claves externas
        $result = mysqli_query($this->conexion , $query);
        
        // Creamos un array vacío para almacenar cada restricción encontrada en la tabla
        $restricciones = [];

        // Recorremos el resultado de la consulta y guardamos cada restricción en el array $restricciones
        // $row representa cada fila devuelta por la consulta (es decir, cada restricción de clave externa)
        while ($row = mysqli_fetch_assoc($result)) {	
            $restricciones[] = $row;																		
        }

        // Creamos una segunda consulta para seleccionar todos los datos de la tabla especificada
        $query = "SELECT * FROM ".$tabla.";";														
        $result = mysqli_query($this->conexion , $query);	

        // Creamos un array $resultado donde vamos a almacenar todas las filas de la tabla,
        // cada una representada como un array asociativo que procesaremos en el siguiente bucle
        $resultado = [];

        // Procesamos cada fila de la tabla que estamos consultando y aplicamos las restricciones de claves externas
        while ($row = mysqli_fetch_assoc($result)) {										
                    
            // Creamos un array vacío $fila que representará cada fila de la tabla que estamos procesando
            // Después de aplicar las restricciones, esta fila procesada será almacenada en $resultado
            $fila = [];	
            
            // Recorremos cada par clave => valor de la fila actual
            // $clave es el nombre de la columna y $valor representa el contenido en esa columna
            foreach($row as $clave => $valor){														
                $identificador = 1; // Valor predeterminado de identificador
                $pasas = true; // Variable para determinar si aplicamos restricciones o no

                // Comprobamos cada restricción que se ha almacenado en $restricciones
                foreach($restricciones as $restriccion){	
                    
                    // Si la columna actual es "Identificador", asignamos su valor a $identificador
                    if($clave == "Identificador"){
                        $identificador = $valor;
                    }

                    /* Si el nombre de la columna ($clave) coincide con una restricción
                    entonces esta columna tiene una clave externa*/
                    if($clave == $restriccion["COLUMN_NAME"]){	
                        
                        //obtener el valor relacionado en la tabla referenciada (REFERENCED_TABLE_NAME)
                        $query2 = "
                            SELECT * 
                            FROM ".$restriccion["REFERENCED_TABLE_NAME"]."
                            WHERE Identificador = ".$identificador."
                        ;";
                        
                        // Ejecutamos la consulta secundaria para obtener los datos relacionados de la tabla externa
                        $result2 = mysqli_query($this->conexion , $query2);
                        
                        /* Creamos una cadena vacía para almacenar los valores de la tabla referenciada, 
                        que se concatenarán con "-"*/
                        $cadena = "";
                        
                        // Recorreremos los resultados de la consulta secundaria
                        while ($row2 = mysqli_fetch_assoc($result2)) {
                            // Cada campo de la fila referenciada se agrega a la cadena $cadena con un separador "-"
                            foreach($row2 as $campo){
                                $cadena .= $campo."-";
                            }
                        }

                        /* Almacenamos la cadena resultante (con los valores concatenados) 
                        en la columna correspondiente de $fila*/
                        $fila[$clave] = $cadena;	
                        // Indicamos que no es necesario añadir el valor original de la tabla principal en esta columna														
                        $pasas = false; 
                    }
                }

                // Si no se aplicaron restricciones (es decir, $pasas es true), almacenamos el valor original en $fila
                if($pasas == true){														
                    $fila[$clave] = $valor;																		
                }
            }

            // Añadimos la fila completa, después de aplicar las restricciones, al array de resultados
            $resultado[] = $fila;		
        }

        // Convertimos el array de resultados a formato JSON para devolverlo con formato legible (pretty print)
        $json = json_encode($resultado, JSON_PRETTY_PRINT);							
        return $json;																										
    }

    ///////////////////////////////////////   FUNCIÓN DE LISTAR TABLAS    ///////////////////////////////////////////////

    public function listadoTablas(){
        //consulta para sacar la informacion de las tablas añadiendo los comentarios 
        $query = "
        SELECT 
            table_name AS 'Tables_in_".$this->basededatos."',
            table_comment AS 'Comentario'
        FROM
            information_schema.tables
        WHERE
            table_schema = '".$this->basededatos."'
        
        ;";																				
        $result = mysqli_query($this->conexion , $query);								
        $resultado = [];	
        //recorremos cada fila de resultado de la consulta (cada fila representa el nombre de una tabla)  																							
        while ($row = mysqli_fetch_assoc($result)) {										
                //$resultado[] = $row;
                //creamos un array donde vamos a alamacenar el nombre d ela tabla actual																		
                $fila = [];
                foreach($row as $clave=>$valor){
                    //aqui guardamos cada clave (nombre de la columna) para el nombre de la tabla 
                    $fila[$clave] = $valor;
                }
                //guardamos el nombre de la tabla enfila en el array de resulatdo
                //donde resultado tendra los nombres de todas las tablas como un conjunto de arrays.
                $resultado[] = $fila;
        }
        $json = json_encode($resultado, JSON_PRETTY_PRINT);							
        return $json;																										
    }
    
    ////////////////////////////////////////    DAME TODAS LAS COLUMNAS   //////////////////////////////////////////////

    public function columnasTabla($tabla){
        $query = "SHOW COLUMNS FROM ".$tabla.";";	
        //ejecutamos la consulta y lo almacenamos en result 																			// Creo la petición dinámica
        $result = mysqli_query($this->conexion , $query);								
        $resultado = [];		
        //procesamos cada fila de resultado (cada columna)																					
        while ($row = mysqli_fetch_assoc($result)) {										
                //$resultado[] = $row;																			
                $fila = [];
                //recorremos cada par clave,representa un atributo de la columna (como nombre, tipo)
                foreach($row as $clave=>$valor){
                    //guardamos cada detalle de la columna en $filausando la clave como tipo de informacion
                    $fila[$clave] = $valor;
                }
                $resultado[] = $fila;
        }
        $json = json_encode($resultado, JSON_PRETTY_PRINT);							
        return $json;																									
    }
    
    ///////////////////////////////////  INSERTAR CAMPOS EN LAS TABLA SELECCIONADA /////////////////////////////////////////

    public function insertaTabla($tabla,$valores){				
            //iniciamos las cadenas 						
            $campos = ""; //los nombres 																									
            $datos = ""; //y los valores 

            foreach($valores as $clave=>$valor){
                //aqui concatenamos el nombre 												
                $campos .= $clave.",";	
                //contenamos el valor 																		
                $datos .= "'".$valor."',";																	
            }
            //elimina la ultima coma de las cadenas para evitar errors en el sql
            $campos = substr($campos, 0, -1);															
            $datos = substr($datos, 0, -1);
            //creamos la consulta de insercion en la tabla especificada	incluyendo los nombre y valores expecificos															
            $query = "
                INSERT INTO ".$tabla." 
                (".$campos.") 
                VALUES (".$datos.");
                ";	
                echo $query;
            //ejecutamos la consulta 
            $result = mysqli_query($this->conexion , $query);							
            return 0;																										
    }
    
    ////////////////////////////////////////////  ACTUALIZAR CAMPOS CON ID TABLA //////////////////////////////////////////

    public function actualizaTabla($tabla,$valores,$id){
            $query = "
                UPDATE ".$tabla." 
                SET
                ";
            //recorremos el array de valores para añadir cada camppo y su nuevo valor 																													
            foreach($valores as $clave=>$valor){	
                //agregamos el nombre de la columna($clave)  y el nuevo valor												
                $query .= $clave."='".$valor."', ";													
            }
            //elimnamos la ultima coma y espacio extra
            $query = substr($query, 0, -2);		
                //anadimo la cndicion para especificar que registro qeremos actualizar usando su id														
                $query .= "
                WHERE Identificador = ".$id."
                ";																												
            echo $query;
            $result = mysqli_query($this->conexion , $query);	
            //y retornamos una cadena vacia 					
            return "";							
    }

    ////////////////////////////////////////////   ELIMINAR DATO TABLA   ///////////////////////////////////////////
    
    public function eliminaTabla($tabla,$id){
        //hacemos la consulta para eliminar un registro con la condicion de su id
        $query = "
                DELETE FROM ".$tabla." 
                WHERE Identificador = ".$id.";
                ";	
        $result = mysqli_query($this->conexion , $query);							
    }
    
    /////////////////////////////////////////////  FUNCION PARA CODIFICAR   /////////////////////////////////////////////
    private function codifica($entrada){
        return base64_encode($entrada);
    }
    ///////////////////////////////////////////  FUNCION PARA DESCODIFICA   /////////////////////////////////////////////
    private function decodifica($entrada){
        return base64_decode($entrada);
    }
}

?>
