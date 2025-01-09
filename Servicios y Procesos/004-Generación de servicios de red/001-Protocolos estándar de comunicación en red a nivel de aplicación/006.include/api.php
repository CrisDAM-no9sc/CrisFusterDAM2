<?php
//AQUI VAMOS A CEAR EL CONTROLADOR QUE VA A MANEJAR LAS OSLICITUDES DE LA API
//RECIBE LOS PARAMETROS DE LA URL Y DECIDIRA QUE ACCION TOMAR 

ini_set('display_errors', 1); // Activo errores
ini_set('display_startup_errors', 1); // Activo errores de inicio
error_reporting(E_ALL);  // Reporto todos los errores

$mysqli = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");


// Verifica si existe el parámetro 'o' en la URL
if (isset($_GET['o'])) { 
    // Si existe, se hace un switch según el valor de 'o'
    switch ($_GET['o']) { 
        // Si 'o' es igual a 'clientes', incluye el archivo 'damepedidos.php'
        case "clientes": 
            include "inc/damepedidos.php";
            break;

        // Si 'o' es igual a 'insertarCliente', maneja la inserción de un nuevo cliente
        case "insertarCliente":
            // Verificamos si los datos del formulario fueron enviados
            if (isset($_POST['nombre']) && isset($_POST['apellidos'])) {
                $nombre = $_POST['nombre'];
                $apellidos = $_POST['apellidos'];

                // Creamos la consulta para insertar el nuevo cliente
                $peticion = "
                    INSERT INTO clientes (nombre, apellidos) 
                    VALUES ('$nombre', '$apellidos');
                ";

                // Ejecutamos la consulta y verificamos si fue exitosa
                if (mysqli_query($mysqli, $peticion)) {
                    echo "Cliente insertado correctamente.";
                } else {
                    echo "Error al insertar el cliente: " . mysqli_error($mysqli);
                }
            } else {
                echo "Por favor, complete todos los campos.";
            }
            break;

        default:
            echo "Acción no válida.";
            break;
    }
} else {
    echo "No se ha recibido la acción.";
}



?>