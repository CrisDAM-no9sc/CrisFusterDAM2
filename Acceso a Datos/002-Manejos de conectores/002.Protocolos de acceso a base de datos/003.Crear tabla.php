<?php

$enlace = mysqli_connect("localhost", "accesoadatos", "accesoadatos", "accesoadatos") OR die("error");

mysqli_query($enlace, "
    CREATE TABLE `accesoadatos`.`clientes` (
    `Identificador` INT(255) NOT NULL AUTO_INCREMENT , 
    `nombre` VARCHAR(255) NOT NULL , 
    `apellidos` VARCHAR(255) NOT NULL , 
    PRIMARY KEY (`Identificador`)
    ) ENGINE = InnoDB;
 ");
?>
