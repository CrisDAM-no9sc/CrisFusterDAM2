<?php

    $contrasena = "123";

    function codifica ($entrada){
        for($i =0; $i<strlen($entrada); $i++){
            $entrada[$i] = chr(ord($contrasena[$i])+5);
        }
        return $entrada;
    }
echo codifica($contrasena)
?>