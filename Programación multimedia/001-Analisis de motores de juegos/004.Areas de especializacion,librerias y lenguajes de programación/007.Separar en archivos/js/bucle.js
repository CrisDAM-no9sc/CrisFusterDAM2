 //arrancamos el bucle
 var temporizador = setTimeout("bucle()",100);
 function bucle(){
   //si el jugador se acerca al limite de la derecha
   if(jugador.x+desfase_global_x > 400){
       //aumenta el desfase hacia a izquierda
       desfase_global_x += 2;//la velocidad
   }
   //si se acerca demasiado al limite de la derecha
   if(jugador.x+desfase_global_x < 120){
       //aumenta el desfase hacia la izquierda
       desfase_global_x -= 2;

   }

   contexto.clearRect(0,0,512,512); // Limpio el lienzo 1
   contexto2.clearRect(0,0,512,512); // Limpio el lienzo 2
   //limpioamos el contexto de las platafomras
   contextoplataformas.clearRect(0,0,512,512);  
   //pintamos las plataformas actualizadas de espacio 
   contextoplataformas.drawImage(imagennivel,0-desfase_global_x,0,2048,512) 

   // A continuación movemos a todos los npc llamando a sus métodos
   for(let i = 0;i<numeronpc;i++){
     misnpcs[i].mueve()
     misnpcs[i].rebota();
     misnpcs[i].dibuja();
   }
   //llamamos a los metodos de las balas 
   for(let i = 0;i<balas.length;i++){                                          
     balas[i].mueve()                                                          
     balas[i].dibuja();                                                        
   }
   //////// detectar colisiones entre las blaas y los npcs  //////// 
   for(let i = 0;i<balas.length;i++){
     // La variable j representa el índice del NPC actual.
     for(let j = 0;j<misnpcs.length;j++){
       //aqui llamamos a la funcion para calcular la distancia entre las posiciones 
       if(calculateDistance(
         balas[i].x, 
         balas[i].y, 
         misnpcs[j].x, 
         misnpcs[j].y
         //y si la distancia es menos de 20 la bla a alcanzado a un ncp
       )  < 20){
         console.log("colision")
       }
     }
   }
   jugador.mueve();
   // Dibujamos al jugador 1
   jugador.dibuja();
   
   // Mediante la siguiente linea soy capaz de obtener un array con los componentes de color de un pixel
   var datos = contexto.getImageData(jugador.x,jugador.y,1,1).data;
   var alpha = datos[3]; // El índice 3 es la transparencia
   if(alpha == 255){
     window.location = window.location // Esto es recargar la página, lo que viene a querer decir que has perdido
   }
   clearTimeout(temporizador);
   temporizador = setTimeout("bucle()",30);
 }