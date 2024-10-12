<?php
    $archivo = "tareas.txt";
    $linea = file($archivo);
    if ($linea){
        echo $linea[0];
        array_shift($linea);
        file_put_contents($archivo, implode("", $linea));
    }
    
?>