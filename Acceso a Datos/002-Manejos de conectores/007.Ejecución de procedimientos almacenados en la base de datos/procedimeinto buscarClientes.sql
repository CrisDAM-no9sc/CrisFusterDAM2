DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarClientes`()
BEGIN
    SELECT
        CONCAT(nombre, ' ', apellidos) AS nombrecompleto,
        email,
        direccion
    FROM clientes
    WHERE nombre LIKE '%ju%';
END$$

DELIMITER ;