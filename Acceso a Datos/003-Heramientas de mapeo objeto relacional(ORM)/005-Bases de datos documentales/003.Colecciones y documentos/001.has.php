<?php

    $contrasena = "123";
    $picadillo = md5($contrasena);
    //con dos cadenas 

    $picadillo2 = md5($contrasena);
    echo $picadillo;
    echo "<br>";
    echo $picadillo2;
?>