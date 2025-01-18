CREATE DATABASE IF NOT EXISTS accesoadatos;

USE accesoadatos;

CREATE TABLE personas (
    Identificador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    apellidos VARCHAR(255),
    edad VARCHAR(255)
);
