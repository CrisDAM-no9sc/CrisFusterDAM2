fun main() {
    
    val a = 10
    val b = 3

    ////////////////////////////////////////////////  ARITMÉTRICOS ///////////////////////////////////////

    println("Operadores aritméticos:")
    // Suma: 10 + 3 = 13
    var resultado = a + b                   
    println("a + b = $resultado")           
    // Resta: 10 - 3 = 7
    resultado = a - b                       
    println("a - b = $resultado")          
    // Multiplicación: 10 * 3 = 30
    resultado = a * b                       
    println("a * b = $resultado")           
    // División (entera): 10 / 3 = 3
    resultado = a / b                       
    println("a / b = $resultado")           
    // Módulo (resto de la división): 10 % 3 = 1
    resultado = a % b                       
    println("a % b = $resultado")           

    ///////////////////////////////////// COMPARACIÓN /////////////////////////////////////////////////

    println("\nOperadores de comparación:")
    // Mayor que: 10 > 3 es true
    resultado = if (a > b) 1 else 0         
    println("a > b = $resultado")           
    // Menor que: 10 < 3 es false
    resultado = if (a < b) 1 else 0         
    println("a < b = $resultado")           
    // Mayor o igual: 10 >= 3 es true
    resultado = if (a >= b) 1 else 0        
    println("a >= b = $resultado")          
    // Menor o igual: 10 <= 3 es false
    resultado = if (a <= b) 1 else 0        
    println("a <= b = $resultado")          
    // Igualdad: 10 == 3 es false
    resultado = if (a == b) 1 else 0        
    println("a == b = $resultado")         
    // Desigualdad: 10 != 3 es true
    resultado = if (a != b) 1 else 0        
    println("a != b = $resultado")          

    ////////////////////////////////////////// LÓGICOS BOOLEANS //////////////////////////////////////////////////////

    val x = true
    val y = false

    println("\nOperadores lógicos:")

    resultado = if (x && y) 1 else 0        // AND lógico: true && false es false
    println("x && y = $resultado")          

    resultado = if (x || y) 1 else 0        // OR lógico: true || false es true
    println("x || y = $resultado")          

    resultado = if (!x) 1 else 0            // Negación lógica: !true es false
    println("!x = $resultado")              
    
    /* 
    ======================= PARA ANDROID STUDIO =======================

    var resultado = 4 == 4 && 3 == 3 && 2 == 1
    Toast.makeText                   => FORMA RAPIDA DE MOSTRAR MENSAJES AL USUARIO
    (this,resultado.toString(),      => EVALUAMOS Y COMVETIMOS EL MENSAJE EN TEXTO 
    Toast.LENGTH_SHORT).show()       => Indica que el mensaje será breve
    */
    /////////////////////////////////////// OPERADORES DE ASIGNACIÓN  /////////////////////////////////////////
    /*
        var edad:Byte = 46
        (edad += 5).toByte()

        Toast.makeText(context:this,edad.toString(), Toast.LENGTH_SHORT).show()
    */
    var c = 5
    println("\nOperadores de asignación:")

    c += 3 // Suma 3 a c, ahora c = 8
    println("Después de sumar 3, el valor de c es: $c")   

    c *= 2 // Multiplica c por 2, ahora c = 16
    println("Después de multiplicar por 2, el valor de c es: $c")

    c -= 4 // Resta 4 a c, ahora c = 12
    println("Después de restar 4, el valor de c es: $c")


}
