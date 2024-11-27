      // Controles para mover al jugador con las teclas del teclado
      document.onkeydown = function(e){
        //para que no de el triple salto 
        if(e.key == "ArrowUp" && jugador.cayendo == false){
            jugador.y -= 15;
            jugador.vy = salto
        }
        if(e.key == "ArrowDown"){jugador.y += 15}
        //cuando paretemos la fecha de la izquierda cojera esa direccion
        if(e.key == "ArrowLeft"){jugador.x -= 15;jugador.direccion = "izquierda"} 
        if(e.key == "ArrowRight"){jugador.x += 15;jugador.direccion = "derecha"}
        ///aqui sacamos el valor de la barra espaciadora ///CREAMOS UNA NUEVA BALA
        if(e.keyCode == 32){console.log("ok disparo");balas.push(new Bala(jugador));}
        
      }