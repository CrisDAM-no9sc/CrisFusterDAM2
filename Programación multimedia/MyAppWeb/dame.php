<?php
// Permitir solicitudes desde cualquier origen (CORS)
header('Access-Control-Allow-Origin: *');           // permite que el servidor acepte solicitudes desde cualquier origen
header('Content-Type: application/json');           // especificamos que las respuestas esten en json

/////////////////////////////// archivo de respuesta ///////////////////
$archivo = 'respuesta.text';
//////////////////////////////// validacion del parametro ///////////////
if (isset($_GET['option'])){

    $opcion = $_GET['option'];
    //validamos si el parametro es A o B
    if($opcion === 'a' || $opcion === 'b'){
        ///////////////////////////////// RESGISTRO DE RESPUESTA /////////////////////////
         //guardar respuesta 
        file_put_contents($archivo, $opcion. PHP_EOL, FILE_APPEND | LOCK_EX);           // escribimos la opcion seleccionada la agregamos al final del archivo 
        // leeer respuesta                                                              // evita que otros procesos escriban en el archivo
        $respuestas = file($archivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);    //lee todas las lineas creando un arreglo donde cada linea es un elemento 
                                                                                        // eliminamos saltos de linea e ignoramos linea vacias 
        //////////////////////////////////// CALCULAMOS LA ESTADISTICAS /////////////////
        //contamos la respuesta para acda opcion
        $count_a = count(array_filter($respuestas, fn($respuesta)=> $respuesta === 'a'));   //con array_filter estamos filtrando las respuestas para contar
        $count_b = count(array_filter($respuestas, fn($respuesta)=> $respuesta === 'b'));   //count calculamos todos los elementos filtrados 
        //sumamos el conteno de ambas opciones
        $total = $count_a + $count_b;
        //calaculamos el porcentaje 
        $porcentaje_a = $total > 0 ? round(($count_a / $total) * 100, 2) : 0;      
        $porcentaje_b = $total > 0 ? round(($count_b / $total) * 100, 2) : 0;

        ////////////////////////// RESPUESTA EN JSON ////////////////////////////////////
        header('Content-Type: application/json');
        echo json_encode([
            'a' => $porcentaje_a,
            'b' => $porcentaje_b,
            'total' => $total
        ]);
    }else{
        //respondemos con este erro si el parametro no es valido 
        http_response_code(400);
        echo json_encode(['error' => 'Opcion invalida']);
    }
}else{
    //por si falta algun parametro
    http_response_code(400);
    echo json_encode(['error' => 'parámetro de opción faltante']);
}

?>