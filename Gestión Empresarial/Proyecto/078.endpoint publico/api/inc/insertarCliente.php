<?php

$peticion = "
    SELECT * FROM clavesapi
    WHERE clave = '".$_POST['clave']."'
";
$resultado = mysqli_query($mysqli, $peticion);
if($fila = mysqli_fetch_assoc($resultado)){
    echo "Acceso correcto, vamos a realizar la insercion";
}else{
    die("Error de acceso");
}

$ip_servidor = $_SERVER['SERVER_ADDR'];

// Si estás trabajando en un entorno local, puede ser tanto IPv4 como IPv6
if ($ip_servidor == "192.168.0.22" || $ip_servidor == "127.0.0.1" || $ip_servidor == "::1") {
    // Si la IP coincide, continuamos con la inserción
} else {
    die("Error de IP no admitida");
}
//if($_SERVER['SERVER_ADDR'] == "192.168.0.22"){}

///////////////// AQUI VAMOS APONER LA LOGICA DE INSERTAR ////////////
if(isset($_POST['nombre']) && isset($_POST['apellidos'])){
    $peticion = "
        INSERT INTO clientes
        (nombre, apellidos)
        VALUES (
            '".$_POST['nombre']."',
            '".$_POST['apellidos']."'
        );
    ";
    $resultado = mysqli_query($mysqli, $peticion);
}else{
    echo "Error en la petición";
}

?>