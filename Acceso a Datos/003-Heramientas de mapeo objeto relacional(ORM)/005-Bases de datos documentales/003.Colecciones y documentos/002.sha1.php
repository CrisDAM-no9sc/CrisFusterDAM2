<?php

    $contrasena = "123";
    $picadillo = md5($contrasena);
    $picadillo = sha1($contrasena);
    $picadillo2 = sha1($contrasena);
    $picadillo0 = sha1($contrasena);

    $picadillo2 = md5($contrasena);
    echo $picadillo;
    echo "<br>";
    echo $picadillo2;
    echo "<br>";
    echo $picadillo0;
?>