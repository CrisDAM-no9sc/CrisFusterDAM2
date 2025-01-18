<?php

    $contrasena = "123";

    function codifica ($entrada){
        for($i =0; $i<strlen($entrada); $i++){
            $entrada[$i] = chr(ord($contrasena[$i])+5);
        }
        $entrada = base64_encode(base64_encode(base64_encode($entrada)));
        return $entrada;
    }

    function descodifica ($entrada){
        $entrada = base64_decode(base64_decode(base64_decode($entrada)));

        for($i =0; $i<strlen($entrada); $i++){
            $entrada[$i] = chr(ord($contrasena[$i])-5);
        }
        return $entrada;
    }

    echo "La contraseña es:".$contrasena."<br>";
    $codificado = codifica($contrasena);
    echo "La contraseña es:".$codificado."<br>";
    $descodifica = descodifica($codificado);
    echo "La contraseña es:".$descodifica."<br>";
?>