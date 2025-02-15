/*
creacion de un array con el contructor

fun main() {
    // Crear un array de tamaño 5, con valores iniciales a 0
    val array = Array(5) { 0 }
    println("Array inicial: ${array.joinToString(", ")}") // Muestra el array como texto

    // Cambiar un valor en el array
    array[2] = 10
    println("Array después de modificar el índice 2: ${array.joinToString(", ")}")
}
*/

////////////////////////////// iterar sobre un array /////////////////////////////////

fun main(){
    // Crear un array de cadenas
    val nombres = arrayOf("Juan", "Maria", "Pedro", "Ana")

    println("Usando un bucle for:")                                 //aqui nos movemos por el indice con el bucle for
    for (i in nombres.indices) {                                    //el resultado esperado es :Nombre en el índice 0: Juan,etc
        println("Nombre en el índice $i: ${nombres[i]}")
    }
    
    println("\nUsando forEach:")                                    // usando el bucle forEach iterasmos sobre el resultado nombre 
    nombres.forEach { nombre ->                                     //Nos sacara este valor :Nombre: Juan, etc
        println("Nombre: $nombre")
    }
}

///////////////////// tambien podemos utilizar la propiedad size ////////////////////
/*  
esta propiedad lo qu enos va a permitir es sacar el tamaño total de numeros 

fun main() {
    val numeros = intArrayOf(10, 20, 30, 40, 50)
    println("Tamaño del array de números: ${numeros.size}")
}

*/

/*

OPERACIONES FUNCIONALES 
nOS OFRECE FUNCIONES COMO :
- MAP => QUE APLCIA UNA TRANSFORMACION A CADA ELEMENTO 
- FILTER => FILTRA LOS ELEMENTOS QUE CUMPLAN UNA CONDICIÓN
- reduce => para reducir todos los elementos a un solo valor


////////////////////////////// DECLARACIONES BÁSICAS /////////////////////////////////////

- arrayOf() => lo utilizamos para crear un array que puede almacenar cualquier tipo de datos (numero, cadenas , objetos,etc)
- con metodos como intArrayOf(enteros), doubleArrayOf (para decimales), booleanArrayOf,ect 
- Arrays vacios utilizaremos emptyArray() => emptyArray<String>()

 */

 /*
 
fun main() {
    // Crear un array de nombres
    var nombres = arrayOf("Maria", "Antonio", "Sofia", "Belen")

    // Mostrar el primer elemento del array
    println("Primer nombre en el array: ${nombres[0]}")

    // Modificar el primer elemento del array
    nombres[0] = "Maria del Carmen"

    // Mostrar el valor actualizado del primer elemento
    println("Nombre actualizado en el array: ${nombres[0]}")
}

*/