<?php

    $contrasena = "123";
    for($i =0; $i<strlen($contrasena); $i++){
        //La función ord obtiene el valor ASCII del carácter actual
        echo $contrasena[$i]." - ".ord($contrasena[$i])." - ".(ord($contrasena[$i]+5))."<br>";
    }
?>