<?php
//se tiene que hacer desde un servidor , que no sea xampp
$to = 'cristinafg4631@gmail.com';
$subject = 'Asunto del correo';
$message = 'hola desde php';
$headers = 'From: fustercristina0793@gmail.com'."\r\n".
    'Reply-to: cristinafg4631@gmail.com'."\r\n".
    'X-Mailer: PHP/'.phpversion();

mail($to, $subject, $message, $headers);

?>