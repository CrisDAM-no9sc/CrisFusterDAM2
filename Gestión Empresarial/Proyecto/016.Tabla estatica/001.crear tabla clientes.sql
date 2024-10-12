CREATE TABLE `crismon1`.`clientes` (
    `Identificador` INT(255) NOT NULL AUTO_INCREMENT , 
    `nombre` VARCHAR(255) NOT NULL , 
    `apellidos` VARCHAR(100) NOT NULL , 
    `email` VARCHAR(255) NOT NULL , 
    `telefono` VARCHAR(100) NOT NULL , 
    `direccion` VARCHAR(255) NOT NULL , 
    `pais` VARCHAR(255) NOT NULL , 
    `cp` VARCHAR(20) NOT NULL , 
    PRIMARY KEY (`Identificador`)
    ) ENGINE = InnoDB;