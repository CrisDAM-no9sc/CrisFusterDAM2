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
        $json = file_get_contents("004.modelodedatos.json");
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
        <style>

        body, html {
            height: 100%; /* Hace que el body y el html ocupen el 100% de la pantalla */
            margin: 0;
            padding: 0;
            background: url(fondo.jpg) no-repeat center center fixed; /* Imagen de fondo */
            background-size: cover; /* Cubre toda la pantalla */
            display: flex;
            justify-content: center;
            align-items: center; /* Centrado vertical y horizontal */
            font-family: 'Arial', sans-serif; /* Fuente más clara */
        }

        /* Estilo del título (h1) */
        form h1 {
            color: #333;
            font-size: 22px;
            margin-bottom: 30px;
        }

        /* Estilo para el formulario */
        form {
            width: 350px;
            padding: 30px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            text-align: center;
            position: relative;
            backdrop-filter: blur(10px);
            
        }

        /* Estilo para los campos de entrada */
        form input {
            width: 100%;
            padding: 12px 40px 12px 10px;
            margin: 10px 0;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            box-sizing: border-box;
            position: relative;
            color: #2c3e50;
            outline:none;
            border:none;
        }

        /* Placeholder estilizado */
        form input::placeholder {
            color: #666; /* Placeholder gris oscuro */
        }

        /* Estilo del botón de envío */
        form input[type="submit"] {
                background: #2980b9;
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                width: 100%;
                padding: 12px;
                font-size: 16px;
                margin-top: 20px;
                transition: background 0.3s ease;
                text-transform: uppercase;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }

            form input[type="submit"]:hover {
                background: #1e6c9a;
            }

        </style>
    </head>
    <body>
        
        <form method="POST" action="?">
            <h1>INSTALADOR</h1>
            <input type="text" name="usuario" placeholder="Usuario de la base de datos">
            <input type="text" name="contrasena" placeholder="Contraseña de la base de datos">
            <input type="text" name="servidor" placeholder="Servidor de la base de datos">
            <input type="text" name="basededatos" placeholder="Nombre de la base de datos">
            <input type="submit">
        </form>
    </body>
</html>

<?php } ?>