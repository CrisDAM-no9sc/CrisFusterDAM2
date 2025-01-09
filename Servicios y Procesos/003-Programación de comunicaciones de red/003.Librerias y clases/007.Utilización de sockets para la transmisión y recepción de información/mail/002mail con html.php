<?php
//se tiene que hacer desde un servidor , que no sea xampp
$to = 'cristinafg4631@gmail.com';
$subject = 'Asunto del correo';
$message = 'hola desde php';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content type: text/html: charset=iso-8859-1';
$headers[] = 'To: Cristina <crsitinafg4631@gmail.com>';
$headers[] = 'From: Cristina <fustercristina0793@gmail.com>';


mail($to, $subject, $message, implode("\r\n", $headers));

?>