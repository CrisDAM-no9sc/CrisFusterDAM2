<?php

    $contrasena = "123";
    $encriptar = base64_encode($contrasena);
    echo "la constraseña encriptada es :".$encriptar;
    //con dos cadenas 
    $desencriptar = base64_decode($encriptar);
    echo "la constraseña encriptada es :".$desencriptar;

?>