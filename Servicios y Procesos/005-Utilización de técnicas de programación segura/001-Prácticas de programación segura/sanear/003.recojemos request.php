<?php

    $entradas = $_REQUEST;
    foreach($entradas as $clave => $valor){
        echo $clave ." - ".$valor."<br>";
    }


?>