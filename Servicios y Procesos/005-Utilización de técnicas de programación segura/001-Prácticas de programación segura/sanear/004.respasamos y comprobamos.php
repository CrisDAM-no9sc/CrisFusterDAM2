<?php
    //aqui vamos a poner las validaciones que no queremos que el usuario pueda insertar en el formulario
    $coleccion = ['DELETE', 'DROP', 'TRUNCATE'];
    $entradas = $_REQUEST;
    foreach($entradas as $clave => $valor){

        $entrada = $clave;
        if (array_filter($coleccion, fn($elemento) => strpos($entrada, $elemento) !== false)){
            die("No permitido");
        }

        $entrada = $valor;
        if (array_filter($coleccion, fn($elemento) => strpos($entrada, $elemento) !== false)){
            die("No permitido");
        }
    }

    echo "todo Ok";
?>