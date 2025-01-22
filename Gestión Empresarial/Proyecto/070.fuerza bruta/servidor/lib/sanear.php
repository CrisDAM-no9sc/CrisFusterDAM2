<?php
/*
function sanear($elemento){
		//var_dump($elemento);
		$coleccion = [
			'delete', 
			'drop', 
			'truncate',
			'table'
			];
		$entradas = $elemento;
		foreach ($entradas as $clave=>$valor) {
			 
			$entrada = strtolower($clave);
			if (array_filter($coleccion, fn($elemento) => strpos($entrada, $elemento) !== false)) {
				 die('{"resultado":"error 2"}');
			} 
			$entrada = strtolower($valor);
			if (array_filter($coleccion, fn($elemento) => strpos($entrada, $elemento) !== false)) {
				die('{"resultado":"error 2"}');
			} 
			 
		}
	}
*/

function sanear($elemento){
    // Asegurarse de que $elemento sea un array o un objeto antes de procesarlo
    if (!is_array($elemento) && !is_object($elemento)) {
        die(json_encode(["resultado" => "error 1"]));  // Si no es un array u objeto, terminamos con un error
    }

    // Definir palabras clave que queremos evitar
    $coleccion = [
        'delete', 
        'drop', 
        'truncate',
        'table'
    ];

    foreach ($elemento as $clave => $valor) {
        // Sanitizar la clave
        $entradaClave = strtolower($clave);
        foreach ($coleccion as $palabra) {
            if (strpos($entradaClave, $palabra) !== false) {
                die(json_encode(["resultado" => "error 2"]));
            }
        }

        // Sanitizar el valor si es una cadena
        if (is_string($valor)) {
            $entradaValor = strtolower($valor);
            foreach ($coleccion as $palabra) {
                if (strpos($entradaValor, $palabra) !== false) {
                    die(json_encode(["resultado" => "error 2"]));
                }
            }
        }
    }
}


?>