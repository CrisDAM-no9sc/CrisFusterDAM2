<?php
    //le indicamos que archivo tiene las tareas
    $file = 'tareas.txt';

    //las lee todas y las guarda en file como un array
    //cada elemeto del array representa una linea del archivo
    $lines = file($file);
    //imprime la respuesta que es la que es capturada por el fetch
    //y se la asignamos al usuario
    echo $lines[0];
    //eliminamos el primer elemento delarray
    //asignara la tarea al usuario y eliminara del listado la tarea asignada
    array_shift($lines);
    //aqui combina las lineas restantes en una cadena de textousando implode
    //y escribimos esa cadena en el texto, sobreescribiendo el contenido sin incluir la tarea asignada
    file_put_contents($file, implode('', $lines));

?>