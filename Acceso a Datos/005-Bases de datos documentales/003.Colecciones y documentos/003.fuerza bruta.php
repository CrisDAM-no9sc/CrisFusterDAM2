<?php

//Es una función recursiva que toma una cadena de texto ($letras) como entrada y devuelve un arreglo con todas las posibles 
//combinaciones de las letras, incluyendo la cadena vacía.

function  generarCombinaciones($letras){
    //si la cadena esta vacia devolvera un arreglo de con una cadena vacia 
    if ($letras === "") {
        return [""];
    }

    $resultado = [];
    //Se separa la primera letra de la cadena:
    $primeraLetra= $letras[0];
    //El resto de la cadena se obtiene usando substr
    $restoLetras = substr($letras, 1);
    //llamamos a la funcion con el resto de letras 
    $combinacionesResto =  generarCombinaciones($restoLetras);
    //para cada conbinacion se genera dos nuevas combinaciones 
    foreach ($combinacionesResto as $combinacion){
        $resultado[] = $combinacion;                        ///una sin agregar la primera letra 
        $resultado[] = $primeraLetra . $combinacion;        // otra agregando la primera letra al inicio
    }
    //nos devuelve el arreglo con todas las combinaciones generadas
    return $resultado;
}

$letras = "aabbff";
$combinaciones =  generarCombinaciones($letras);

//recorremos el arreglo y oara cada combinación
foreach($combinaciones as $clave => $valor){
    // imprmimos sui hash usando la funcion md5
    echo $valor." : ".md5($valor)."<br>";
}
?>