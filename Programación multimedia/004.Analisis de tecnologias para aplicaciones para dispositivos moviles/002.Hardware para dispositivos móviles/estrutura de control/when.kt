/////////////////////////////////// CONDICIONALES ////////////////////////////
//parecido al switch nos permite evaluar multiples condiciones y ejecutar diferentes bloques dependiendo del valor de una variable 
fun main() {
    var diasemana: Int = 1

    // Usamos `when` para evaluar el día de la semana
    var resultado = when (diasemana) {
        1 -> "Hoy es lunes"
        2 -> "Hoy ya estamos a martes"
        3 -> "Hoy ya estamos a miércoles"
        4 -> "Hoy estamos a jueves"
        5 -> "Hoy ya estamos a viernes"
        6 -> "Nos encontramos en sábado"
        7 -> "Ya estamos a domingo, se acaba la semana"
        else -> "El día ingresado no es válido"
    }

    // Usamos interpolación para incluir el resultado en la cadena
    println("ESTAMOS EN EL DÍA DE LA SEMANA: $resultado")
}