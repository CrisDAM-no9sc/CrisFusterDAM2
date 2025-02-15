<?php
    if(isset($_POST['usuario'])){
        ///mostramos los errores de php
        ini_set('display_errors', 1);
        //mostramos los erroes de inicio
        ini_set('display_startup_errors', 1);
        //mostrar todos los tipos de errores y advertencias
        error_reporting(E_ALL);

        //hacemos la conexion con la base de datos 
        $enlace = mysqli_connect(
            $_POST['servidor'],
            $_POST['usuario'], 
            $_POST['contrasena'], 
            $_POST['basededatos']
            ) OR die("error");

        //leo el contenido del json
        $json = file_get_contents("C:/xampp/htdocs/Acceso a Datos/002-Manejos de conectores/002.Protocolos de acceso a base de datos/004.modelodedatos.json");
        //lo procesamos como objeto php
        $datos = json_decode($json, true);
        ///para cada una de las tablas 
        foreach ($datos as $dato) {
            //cojemos el nombre de la tabla
            $nombredetabla = $dato['nombre'];
            //creamos una cadena idicando el nombre d ela tabla 
            $cadena = "CREATE TABLE ".$nombredetabla." ( Identificador INT NOT NULL AUTO_INCREMENT , ";
            //para cada una de las columnas 
            foreach($dato['columnas'] as $columna){
                //añadimos un campo para cada elmento del array
                $cadena .= $columna['nombre']." ".$columna['tipo']." ";
                    //y en el casod que el campo no se aun txt
                    if($columna['tipo'] != "TEXT"){
                        //le añadimos la longitud
                        $cadena .= " (".$columna['longitud'].") ";
                    }
                    $cadena .= ",";
            }
                //le añadimos la clave primaria 
                $cadena .= "PRIMARY KEY (Identificador) ";
                $cadena .= " )  ENGINE = InnoDB";
                //lanzo la cadena para debug
                echo $cadena;
                //ejecutamos la peticion para la base de datos
                mysqli_query($enlace, $cadena);

        }
    }else{
	
?>

<!doctype html>
<html> 
    <head>
        <title>
            Instalador de base de datos
        </title>
    </head>
    <body>
        <h1>INSTALADOR</h1>
        <form method="POST" action="?">
            <input type="text" name="usuario" placeholder="Usuario de la base de datos">
            <input type="text" name="contrasena" placeholder="Contraseña de la base de datos">
            <input type="text" name="servidor" placeholder="Servidor de la base de datos">
            <input type="text" name="basededatos" placeholder="Nombre de la base de datos">
            <input type="submit">
        </form>
    </body>
</html>

<?php } ?>