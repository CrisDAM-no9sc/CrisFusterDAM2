class Jugador{
    //definimos las propiedades de inicio de la instancia
    constructor(){
      this.x = 256
      this.y = 256;
      this.vy = 0;
      this.cayendo = true;
      this.direccion = "izquierda";
      
    }
    //metodo para dibujar el jugador 
    dibuja(){
        if(this.direccion == "izquierda"){
            //aqui de la imagen de las cara a y b cojemos solo una parte que es la cara a
            contexto.drawImage(imagenbueno,0,0,35,35,this.x-desfase_global_x,this.y,35,35);
        }else{
            //cambiando el 35 significa que lo que hace en caso contrario es cojer el resto de pixel de la imagen donde esta la cara b
            contexto.drawImage(imagenbueno,35,0,35,35,this.x-desfase_global_x,this.y,35,35);
        }
    }
    //lo que hacemos con este metodo es que el jugador vaya cayendo cada vez maas
    mueve(){
        if(this.cayendo == true){
            jugador.vy += gravedad;
            jugador.y += jugador.vy;
        }
        
        this.muere();
        this.colisionPlataformas();
    }
    //metodo gestiona la muerte del jugador 
    muere(){
        if(this.y > 512){
            window.location = window.location;
        }
    }
    colisionPlataformas(){
        let pixel= contextoplataformas.getImageData(this.x, this.y+35,1,1);
        if(pixel.data[3] > 0){
            this.cayendo = false;
        }else{
            this.cayendo = true;
        }
    }
  }