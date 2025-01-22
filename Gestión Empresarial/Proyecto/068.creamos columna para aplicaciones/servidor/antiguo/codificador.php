<?php
class Cifrado {

// Método para codificar
public function codifica($entrada) {
    $salida = '';
    for ($i = 0; $i < strlen($entrada); $i++) {
        $salida .= chr(ord($entrada[$i]) + 5);  
    }
    $salida = base64_encode(base64_encode(base64_encode($salida)));  
    return $salida;
}

// Método para decodificar
public function descodifica($entrada) {
    $entrada = base64_decode(base64_decode(base64_decode($entrada)));  
    $salida = '';
    for ($i = 0; $i < strlen($entrada); $i++) {
        // Deshacer el cambio en los caracteres
        $salida .= chr(ord($entrada[$i]) - 5);  
    }
    return $salida;
}
}


?>