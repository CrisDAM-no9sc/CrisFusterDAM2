<?php

    $contrasena = "123";
    for($i =0; $i<strlen($contrasena); $i++){
        //La función ord obtiene el valor ASCII del carácter actual
        // Se suma 5 al valor ASCII y se convierte nuevamente a carácter con chr
        echo $contrasena[$i]." - ".ord($contrasena[$i])." - "(ord($contrasena[$i])+5)." - ".chr(ord($contrasena[$i])+5)."<br>";
    }
?>