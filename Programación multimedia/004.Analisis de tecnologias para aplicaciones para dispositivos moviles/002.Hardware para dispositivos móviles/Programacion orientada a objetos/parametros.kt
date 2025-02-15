class Personas (var nombre: String, var edad: Int) {

    init {
        // Puedes inicializar valores aquí si lo necesitas
    }

    // Función para saludar
    fun saludar() {
        println("Hola, soy $nombre y tengo $edad años.")
    }

    // Función para hablar
    fun hablar(mensaje: String) {
        println("$nombre dice: $mensaje")
    }

    // Función para cantar
    fun cantar(cancion: String) {
        println("$nombre está cantando la canción: $cancion")
    }
}

fun main() {
    // Creamos un objeto de la clase Persona con los parámetros necesarios
    val persona = Personas("Carlos", 30)

    // Llamamos a las funciones de la clase
    persona.saludar()                               // Llamada a la función saludar
    persona.hablar("¡Qué día tan bonito!")          // Llamada a la función hablar
    persona.cantar("Despacito")                     // Llamada a la función cantar
}
