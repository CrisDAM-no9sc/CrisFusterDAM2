/////////////////////////////// CONDICIONALES ////////////////////
//dependeindo del valor de la variable nos permite tomar decisiones 
fun main(){
    var edad:Int = 46
    if(edad < 10){
        println("Eres un niño")
    }else if (edad >= 10 && edad < 20){
        println("Eres un joven")
    }else if (edad >= 20 && edad < 29){
        println("Eres un joven")
    }else{
        println("Ya no eres un chaval")
    }
}