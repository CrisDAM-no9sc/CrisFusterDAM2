CREATE USER 'crimson'@'localhost' IDENTIFIED BY 'crimson';

/* metemos los privilegios en la base de datos */
GRANT ALL PRIVILEGES ON crimson.* TO 'crismon'@'localhost';


FLUSH PRIVILEGES;