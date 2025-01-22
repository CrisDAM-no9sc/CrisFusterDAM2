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
        // INICIA LAS PROPIEDADES DE CONEXION
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

        if (!$this->conexion) {
            // Registrar el error en un log y retornar un JSON de error
            error_log("Error de conexión: " . mysqli_connect_error());
            die(json_encode(["error" => "Error de conexión a la base de datos."]));
        }
    }

    ////////////////////////////////////////////   FUNCION DE BUSCAR     ////////////////////////////////////////////////
    public function buscar($tabla, $datos){
        $peticion = "SELECT * FROM ".$tabla." WHERE ";
        foreach($datos as $clave => $valor){
            $valor = mysqli_real_escape_string($this->conexion, $valor); // Sanitizar
            $peticion .= "$clave='$valor' AND "; 
        }
        $peticion .= "1;";

        $resultado = mysqli_query($this->conexion, $peticion);
        if (!$resultado) {
            return json_encode(["error" => "Error en la consulta: " . mysqli_error($this->conexion)]);
        }

        $retorno = [];
        while ($fila = mysqli_fetch_assoc($resultado)) {									
            $retorno[] = $fila;																			
        }
        return json_encode($retorno, JSON_PRETTY_PRINT);	
    }

    //////////////////////////////////////// BUSCAR SIMILARES EN EL SELECTOR //////////////////////////////////////
    public function buscarSimilar($tabla, $datos){
        $peticion = "SELECT * FROM ".$tabla." WHERE ";
        foreach($datos as $clave => $valor){
            $valor = mysqli_real_escape_string($this->conexion, $valor); // Sanitizar
            $peticion .= "$clave LIKE '%$valor%' AND "; 
        }
        $peticion .= "1;";

        $resultado = mysqli_query($this->conexion, $peticion);
        if (!$resultado) {
            return json_encode(["error" => "Error en la consulta: " . mysqli_error($this->conexion)]);
        }

        $retorno = [];
        while ($fila = mysqli_fetch_assoc($resultado)) {										
            $retorno[] = $fila;																			
        }
        return json_encode($retorno, JSON_PRETTY_PRINT);	
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

        $result = mysqli_query($this->conexion, $query);								
        if (!$result) {
            return json_encode(["error" => "Error en la consulta de restricciones: " . mysqli_error($this->conexion)]);
        }

        $restricciones = [];																						
        while ($row = mysqli_fetch_assoc($result)) {										
            $restricciones[] = $row;																			
        }

        $query = "SELECT * FROM ".$tabla.";";
        $result = mysqli_query($this->conexion, $query);								
        if (!$result) {
            return json_encode(["error" => "Error en la consulta de la tabla: " . mysqli_error($this->conexion)]);
        }

        $resultado = [];																								
        while ($row = mysqli_fetch_assoc($result)) {										                                             
            $fila = [];																									
            foreach($row as $clave => $valor){													
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
                        $result2 = mysqli_query($this->conexion, $query2);
                        if (!$result2) {
                            return json_encode(["error" => "Error en la consulta de referencias: " . mysqli_error($this->conexion)]);
                        }

                        $cadena = "";
                        while ($row2 = mysqli_fetch_assoc($result2)) {
                            foreach($row2 as $campo){
                                $cadena .= $campo."-";
                            }
                        }
                        
                        $fila[$clave] = rtrim($cadena, '-');															
                        $pasas = false;																				
                    }
                }
                if($pasas == true){																					
                    $fila[$clave] = $valor;																		
                }
            }
            $resultado[] = $fila;		
        }
        return json_encode($resultado, JSON_PRETTY_PRINT);																									
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
        
        $result = mysqli_query($this->conexion, $query);								
        if (!$result) {
            return json_encode(["error" => "Error en la consulta de tablas: " . mysqli_error($this->conexion)]);
        }

        $resultado = [];																						
        while ($row = mysqli_fetch_assoc($result)) {										
            $fila = [];
            foreach($row as $clave => $valor){
                $fila[$clave] = $valor;
            }
            $resultado[] = $fila;
        }
        return json_encode($resultado, JSON_PRETTY_PRINT);																										
    }

    ////////////////////////////////////////////// PARA SACRA TODAS LAS COLUMNAS DE LA TABLA /////////////////////////////////
    public function columnasTabla($tabla){
        $query = "SHOW COLUMNS FROM ".$tabla.";";																				
        $result = mysqli_query($this->conexion, $query);								
        if (!$result) {
            return json_encode(["error" => "Error en la consulta de columnas: " . mysqli_error($this->conexion)]);
        }

        $resultado = [];																								
        while ($row = mysqli_fetch_assoc($result)) {										
            $fila = [];
            foreach($row as $clave => $valor){
                $fila[$clave] = $valor;
            }
            $resultado[] = $fila;
        }
        return json_encode($resultado, JSON_PRETTY_PRINT);						
    }

    ///////////////////////////////////////////// INSERTAR EN LA TABLA /////////////////////////////////////////////////
    public function insertaTabla($tabla, $valores){										
        $campos = "";
        $parametros = "";
        $tipos = "";
        $datos = [];	
        																								
        foreach ($valores as $clave => $valor) {
            if (is_array($valor)) {
                return json_encode(["error" => "El valor de '$clave' es un array y no se puede convertir a string."]);
            }
            $campos .= $clave . ",";
            $parametros .= "?,";
            if (isset($_FILES[$clave])) {
                $tipos .= "b";
                $datos[] = file_get_contents($_FILES[$clave]['tmp_name']);
            } else {
                $tipos .= "s";
                $datos[] = $valor;
            }
       }
       // Validación para asegurarse de que hay tipos y datos antes de continuar
        if (empty($tipos) || empty($datos)) {
            return json_encode(["error" => "No se recibieron datos válidos para insertar."]);
        }

        $campos = rtrim($campos, ",");
        $parametros = rtrim($parametros, ",");

        $query = "INSERT INTO $tabla ($campos) VALUES ($parametros)";
        $stmt = $this->conexion->prepare($query);

        if ($stmt === false) {
            return json_encode(["error" => "Error en la preparación de la consulta: " . $this->conexion->error]);
        }

        $stmt->bind_param($tipos, ...$datos);

        foreach ($datos as $index => $dato) {
            if ($tipos[$index] === "b") {
                $stmt->send_long_data($index, $dato);
            }
        }

        if ($stmt->execute()) {
            return json_encode(["mensaje" => "Inserción exitosa en la tabla $tabla."]);
        } else {
            return json_encode(["error" => "Error al insertar en la tabla $tabla: " . $stmt->error]);
        }

        $stmt->close();
    }

    ///////////////////////////////////////// FUNCION DE ACTUALIZAR TABLA ////////////////////////////////////////////////////////
    public function actualizaTabla($tabla, $valores, $id){
        $query = "UPDATE ".$tabla." SET ";
        foreach($valores as $clave => $valor){												
            $valor = mysqli_real_escape_string($this->conexion, $valor); // Sanitizar
            $query .= "$clave='$valor', ";													
        }
        $query = rtrim($query, ", ");
        $query .= " WHERE Identificador = ".$id.";";
        
        if (mysqli_query($this->conexion, $query)) {
            return json_encode(["mensaje" => "Actualización exitosa en la tabla $tabla."]);
        } else {
            return json_encode(["error" => "Error al actualizar en la tabla $tabla: " . mysqli_error($this->conexion)]);
        }
    }

    public function actualizar($datos){														// Método de actualizar un solo campo en la tabla
        $query = "UPDATE ".$datos['tabla']." SET ".$datos['columna']." = '".$datos['valor']."' WHERE Identificador = ".$datos['Identificador'].";";
        
        if (mysqli_query($this->conexion, $query)) {
            return json_encode(["mensaje" => "Actualización exitosa."]);
        } else {
            return json_encode(["error" => "Error al actualizar: " . mysqli_error($this->conexion)]);
        }
    }

    public function eliminaTabla($tabla, $id){
        $query = "DELETE FROM ".$tabla." WHERE Identificador = ".$id.";";
        if (mysqli_query($this->conexion, $query)) {
            return json_encode(["mensaje" => "Eliminación exitosa en la tabla $tabla."]);
        } else {
            return json_encode(["error" => "Error al eliminar en la tabla $tabla: " . mysqli_error($this->conexion)]);
        }
    }

    private function codifica($entrada){
        return base64_encode($entrada);
    }
    
    private function decodifica($entrada){
        return base64_decode($entrada);
    }

    public function datosGrafica() {
        // Get the list of tables in the database
        $query = "
            SELECT 
                table_name 
            FROM 
                information_schema.tables
            WHERE 
                table_schema = '".$this->basededatos."';
        ";
        $result = mysqli_query($this->conexion, $query);
        if (!$result) {
            return json_encode(["error" => "Error al recuperar las tablas: " . mysqli_error($this->conexion)]);
        }
        
        // Debug: Verifica si hay resultados
        if (mysqli_num_rows($result) === 0) {
            return json_encode(["error" => "No se encontraron tablas en la base de datos especificada."]);
        }
        
        $datos = [];
    
        // Loop through each table and count its rows
        while ($row = mysqli_fetch_assoc($result)) {
            $tabla = $row['table_name'];
            $queryCount = "SELECT COUNT(*) AS total FROM `$tabla`;";
            $resultCount = mysqli_query($this->conexion, $queryCount);
    
            if (!$resultCount) {
                return json_encode(["error" => "Error al contar filas en la tabla $tabla: " . mysqli_error($this->conexion)]);
            }
    
            $count = mysqli_fetch_assoc($resultCount)['total'];
            $datos[] = ["texto" => $tabla, "valor" => (int)$count];
        }
    
        // Encode the result as a JSON string
        return json_encode($datos, JSON_PRETTY_PRINT);
    }
}
?>
