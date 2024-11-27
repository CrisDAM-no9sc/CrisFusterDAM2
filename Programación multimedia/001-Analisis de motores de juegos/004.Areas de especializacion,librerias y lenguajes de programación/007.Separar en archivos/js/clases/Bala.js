class Bala{
    constructor() {
        //son las mismas posiciones quie las del jugador 
        this.x = jugador.x; 
        this.y = jugador.y;
        this.vx = 10; 
        this.direccion = 1; 
        //el jugador va hacia la izquierda
        if(jugador.direccion == "izquierda"){
           //la velociad de la bala es negativa              
           this.direccion = -1  
        //va hacia la derecha                           
        }else{                                            
           this.direccion = 1                              
        }
    }
    mueve() {
        this.x += this.direccion * this.vx;
    }
    dibuja() {
        contexto.beginPath();
        contexto.arc(this.x-desfase_global_x, this.y, 10, 0, Math.PI * 2);
        contexto.fill();
    }
}