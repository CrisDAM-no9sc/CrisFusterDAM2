

<?php
$contenido = file_get_contents('php://input');

$data = json_decode($contenido, true);

$archivo = fopen("resultado1.txt" , "w");
$texto = $_POST['nombre'];
fwrite($archivo, $texto);
fclose($archivo);


?>