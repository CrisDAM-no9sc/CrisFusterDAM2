<?php

    $contrasena = "123";

    function codifica ($entrada){
        for($i =0; $i<strlen($entrada); $i++){
            $entrada[$i] = chr(ord($contrasena[$i])+5);
        }
        $entrada = base64_encode(base64_encode(base64_encode($entrada)));
        return $entrada;
    }
    echo codifica($contrasena)
?>