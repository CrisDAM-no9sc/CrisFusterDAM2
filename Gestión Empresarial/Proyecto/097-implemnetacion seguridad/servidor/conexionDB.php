<?php
/**
 * 
 *## Descripción:
 * Este archivo define la clase `conexionDB`, que maneja la conexión a la base de datos MySQL y 
 * proporciona diversas funciones para interactuar con ella, incluyendo:
 * - Conexión y gestión de la base de datos `crismon1`.
 * - Métodos para buscar, insertar, actualizar y eliminar registros en las tablas.
 * - Métodos para obtener información sobre la estructura de la base de datos.
 * - Implementación de seguridad mediante saneamiento de datos.
 * - Generación de datos para gráficas basadas en la cantidad de registros en las tablas.
 *
 * ## Notas:
 * - **Seguridad:** Se implementa saneamiento de datos con `mysqli_real_escape_string()` y `sanear()`.
 * - **Optimización:** Se han agregado métodos reutilizables para mejorar el rendimiento.
 * - **Uso:** Este archivo debe ser incluido en otros scripts que necesiten acceso a la base de datos.
 */


include_once "lib/sanear.php"; 

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
    /////////////////////////////////////////// FUNCION PARA ACCEDER DESDE OTROS ARCHIVOS A LA CONEXION  ////////////////////////////////////////////

    public function getConexion() {
        return $this->conexion;
    }

    /////////////////////////////////////////// FUNCION BUSCAR SELECCIONADO ////////////////////////////////////////////
    public function buscarSeleccion($tabla, $datos) {
        // Verificar si los campos seleccionados están presentes
        if (!isset($datos['campos'])) {
            return json_encode(["error" => "Faltan los campos seleccionados."]);
        }
    
        $camposSeleccionados = $datos['campos']; // Array de los campos seleccionados
    
        // Verificar que al menos un campo haya sido seleccionado
        if (empty($camposSeleccionados)) {
            return json_encode(["error" => "No se han seleccionado campos para la búsqueda."]);
        }
    
        // Sanitizar los nombres de los campos para prevenir inyecciones SQL
        $camposSanitizados = array_map(function($campo) {
            return mysqli_real_escape_string($this->conexion, $campo);
        }, $camposSeleccionados);
    
        // Construir la parte de la consulta SELECT con los campos seleccionados
        $campos = implode(",", $camposSanitizados); // Une los campos seleccionados en una cadena
    
        // Iniciar la consulta SQL
        $peticion = "SELECT $campos FROM " . mysqli_real_escape_string($this->conexion, $tabla);
    
        // Verificar si se proporcionaron valores de búsqueda
        if (isset($datos['valores']) && !empty($datos['valores'])) {
            $valoresBusqueda = $datos['valores']; // Los valores que se están buscando en esos campos
    
            // Sanitizar los valores de búsqueda
            $valoresSanitizados = array_map(function($valor) {
                return mysqli_real_escape_string($this->conexion, $valor);
            }, $valoresBusqueda);
    
            // Construir la parte de la consulta WHERE con los valores de búsqueda
            $condiciones = [];
            foreach($valoresSanitizados as $clave => $valor) {
                $condiciones[] = "$clave LIKE '%$valor%'";
            }
            $where = implode(" AND ", $condiciones);
    
            // Añadir la cláusula WHERE a la consulta
            $peticion .= " WHERE $where";
        }
    
        $peticion .= ";"; // Terminar la consulta
    
        // Ejecutar la consulta SQL
        $resultado = mysqli_query($this->conexion, $peticion);
    
        if (!$resultado) {
            return json_encode(["error" => "Error en la consulta SQL: " . mysqli_error($this->conexion)]);
        }
    
        $retorno = [];
    
        // Recoger los resultados de la consulta
        while ($fila = mysqli_fetch_assoc($resultado)) {
            $retorno[] = $fila;
        }
    
        // Devolver los resultados como JSON
        return json_encode($retorno, JSON_PRETTY_PRINT);
    }
    ////////////////////////////////////////////   FUNCION DE BUSCAR     ////////////////////////////////////////////////


    public function buscar($tabla, $datos) {
        // Sanitizamos los datos antes de construir la consulta
        sanear($datos);

        $peticion = "SELECT * FROM " . mysqli_real_escape_string($this->conexion, $tabla) . " WHERE ";
        foreach ($datos as $clave => $valor) {
            $peticion .= mysqli_real_escape_string($this->conexion, $clave) . "='" . mysqli_real_escape_string($this->conexion, $valor) . "' AND "; 
        }
        $peticion .= " 1;";

        $resultado = mysqli_query($this->conexion, $peticion);
        $retorno = [];

        while ($fila = mysqli_fetch_assoc($resultado)) {    
            $fila['token'] = base64_encode(date('U'));                                
            $retorno[] = $fila;                                                                            
        }
        return json_encode($retorno, JSON_PRETTY_PRINT);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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

    public function listadoAplicacionesUsuario($usuario){
        // La consulta SQL
        $query = "
            SELECT
            aplicaciones.nombre
            FROM usuarios

            LEFT JOIN departamentos
            ON usuarios.departamentos_nombre = departamentos.Identificador

            LEFT JOIN departamentosapp
            ON departamentosapp.departamento_nombre = departamentos.Identificador

            LEFT JOIN aplicaciones
            ON departamentosapp.aplicaciones_nombre = aplicaciones.Identificador

            WHERE usuarios.usuario = '".$usuario."'
        ";		
        //echo $query;
        // Ejecutamos la consulta
        $result = mysqli_query($this->conexion , $query);	
        $resultado = [];	// Arreglo donde almacenaremos los resultados
    
        // Recorremos los resultados de la consulta
        while ($row = mysqli_fetch_assoc($result)) {
            // Almacenamos cada fila en el arreglo resultado
            $fila = [];
            foreach($row as $clave=>$valor){
                $fila[$clave] = $valor;
            }
            $resultado[] = $fila;
        }
    
        // Enviar la respuesta como JSON
        header('Content-Type: application/json');  // Asegúrate de enviar el tipo de contenido correcto
        echo json_encode($resultado, JSON_PRETTY_PRINT); // Devuelves el resultado como JSON
    }

    ///////////////////////////////////////// SACAR EL LISTADO DE TABLAS /////////////////////////////////////////////

    public function listadoTablasAplicacion($aplicacion){
        // La consulta SQL
        $query = "
            SELECT 
                ist.table_name AS 'Tables_in_".$this->basededatos."',
                ist.table_comment AS 'Comentario',
                ta.tabla AS 'Tabla_de_Aplicación'
            FROM 
                information_schema.tables AS ist
            LEFT JOIN 
                tablasaplicaciones AS ta
            ON 
                ist.table_name = ta.tabla
            LEFT JOIN 
                aplicaciones AS ap
            ON 
                ta.aplicaciones_nombre = ap.Identificador
            WHERE 
                ist.table_schema = '".$this->basededatos."'
                AND ap.nombre = '".$aplicacion."';
        ";		
    
        // Ejecutamos la consulta
        $result = mysqli_query($this->conexion , $query);	
        $resultado = [];	// Arreglo donde almacenaremos los resultados
    
        // Recorremos los resultados de la consulta
        while ($row = mysqli_fetch_assoc($result)) {
            // Almacenamos cada fila en el arreglo resultado
            $fila = [];
            foreach($row as $clave=>$valor){
                $fila[$clave] = $valor;
            }
            $resultado[] = $fila;
        }
    
        // Enviar la respuesta como JSON
        header('Content-Type: application/json');  // Asegúrate de enviar el tipo de contenido correcto
        echo json_encode($resultado, JSON_PRETTY_PRINT); // Devuelves el resultado como JSON
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

    /////////////////////////////////////////////// FUNCION PARA OBTENER REGISTRO //////////////////////////////////////////////

    public function registro($tabla, $id) {
        $query = "SELECT * FROM " . $tabla . " WHERE Identificador = " . $id . ";";
        $result = mysqli_query($this->conexion, $query);
        $resultado = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $fila = [];
            foreach ($row as $clave => $valor) {
                $fila[$clave] = $valor;
            }
            $resultado[] = $fila;
        }
        $json = json_encode($resultado, JSON_PRETTY_PRINT);
        return $json;
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


    //////////////////////////////////////////////// metemos metodo de datos grafica ////////////////////////////////////////////

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
            die("Error al recuperar las tablas: " . mysqli_error($this->conexion));
        }
        
        // Debug: Verifica si hay resultados
        if (mysqli_num_rows($result) === 0) {
            die("No se encontraron tablas en la base de datos especificada.");
        }
        $datos = [];
        // Loop through each table and count its rows
        while ($row = mysqli_fetch_assoc($result)) {

            $tabla = $row['table_name'];
            $queryCount = "SELECT COUNT(*) AS total FROM `$tabla`;";
            $resultCount = mysqli_query($this->conexion, $queryCount);
    
            if (!$resultCount) {
                die("Error al contar filas en la tabla $tabla: " . mysqli_error($this->conexion));
            }
    
            $count = mysqli_fetch_assoc($resultCount)['total'];
            $datos[] = ["texto" => $tabla, "valor" => (int)$count];
        }
    
        // Encode the result as a JSON string
        $json = json_encode($datos, JSON_PRETTY_PRINT);
        return $json;
    }
}

?>
