<?php
    //aqui vamos a poner las validaciones que no queremos que el usuario pueda insertar en el formulario
    $coleccion = ['DELETE', 'DROP', 'TRUNCATE'];
    $entrada = $_POST['entrada'];

    if (array_filter($coleccion, fn($elemento) => strpos($entrada, $elemento) !== false)){
        echo "La cadena contiene al menos un elementos en el array ";
    }else{
        echo "La cadena no contiene ningun elementos en el array ";
    }

?>