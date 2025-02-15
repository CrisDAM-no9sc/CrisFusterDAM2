<?php
    //utilizamos una superglobal sesion de php para acceder a una variable de sesion de llamada edad
    //esta variable nos permite almacenar infromacion que persiste a traves de múltiple solicitudes del mismo usuario
    session_start();
    echo "Tu edad es de " . $_SESSION['edad'] . " años";

?>