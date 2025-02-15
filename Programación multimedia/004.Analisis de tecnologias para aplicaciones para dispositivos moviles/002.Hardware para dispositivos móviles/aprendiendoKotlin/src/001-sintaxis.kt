fun main(){
    println("¡Hola, Kotlin desde Visual Studio Code!")
}

/*


VAL => cuanod queremos que el valor sea inmutable, que no podemos cambiar su valor una vez que lo hayamos asignasdo
VAR => lo utilizamos cunado queremos que la variable se pueda cambiar despues de haberla declarado 

ejemplo de uso:

fun main() {
    val pi = 3.14159      // `val` porque el valor de pi no cambia.
    var contador = 0      // `var` porque vamos a modificar su valor.

    println("Valor inicial del contador: $contador")

    // Incrementamos el contador
    contador += 1
    println("Valor del contador después de incrementar: $contador")

    // Intentamos cambiar `pi` (esto generará un error si lo descomentamos)
    // pi = 3.14
}

////////////////////////////////// OTRAS FORMAS DE CONCATENAR EN KOTLIN ///////////////////////

- CON INTERPOLACION => $ 
    $nombre       => para incluir variables directamente dentro de las cadenas
    ${edad + 5}   => si necesitamos realizar o utilizar una expresion mas compleja 
 
- CONCATENACION CON OPERADOR => +
    + nombre + => crea objetos adicionales en memoria al combinar cadenas 

- USANDO EL METODO => StringBuilder
    Cuanod necesitamos concatenar muchas cadenas como en un bucle 


*/