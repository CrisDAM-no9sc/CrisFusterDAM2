/*******************    MEDIANTE COMANDOS    ************************************/
--este es el comando para la conexion a MySQL LINUX
sudo mysql -u root  
--para Windows no es necesario poner SUDO
mysql -u root -p  
-- -U ROOT = especifica que deseas conectarte como usuario
-- -p pedira contraseña para el usuario


/**************** AHORA VAMOS A CREAR UNA BASE DE DATOS *****************/
CREATE DATABASE accesoadatos;
--Crea un nuevo usuario llamado accesoadatos que se conecta desde localhost
--Permite a este usuario autenticarse en el servidor de base de datos usando la contraseña 'accesoadatos'
CREATE USER 'accesoadatos'@'localhost' IDENTIFIED BY 'accesoadatos';
--otorga al usuario todos los privilegios de la base de datos
/*Permite al usuario realizar cualquier operación en todas las tablas dentro de esa base de datos, 
como seleccionar, insertar, actualizar, y eliminar datos.*/
GRANT ALL PRIVILEGES ON accesoadatos.* TO 'accesoadatos'@'localhost';
--Recarga los privilegios en el servidor para que se apliquen los cambios realizados con la función GRANT
FLUSH PRIVILEGES;