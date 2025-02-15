fun main() {
    // Llamamos a las funciones creadas
    saludar()
    saludaNombre("María")
    saludarNombre("Carlos", 25)

    println(saludanombreReturn("Jose Vicente", 46))
}


fun saludar() {
    println("¡Hola! Bienvenido al programa.")
}


fun saludaNombre(nombre: String) {
    println("¡Hola, $nombre! ¿Cómo estás?")
}


fun saludarNombre(nombre: String, edad: Int) {
    println("¡Hola, $nombre! Tienes $edad años. ¡Qué joven te ves!")
}

// Cuarta función: Acepta dos parámetros y retorna un valor de tipo String
fun saludanombreReturn(nombre: String, edad: Int): String {
    return "¡Hola, $nombre! Tienes $edad años. ¡Qué joven te ves!"
}
