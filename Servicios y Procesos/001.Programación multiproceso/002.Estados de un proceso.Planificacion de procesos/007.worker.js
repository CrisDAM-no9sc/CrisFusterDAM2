onmessage = function(datos){

    console.log("worker arrancado, vamos a trabajar");
  // Se recorre cada píxel de la imagen (cada píxel tiene 4 valores: rojo, verde, azul y alfa)
    for(let i = 0; i < datos.data.length; i += 4){  
        // Se accede a los datos del píxel actual
        let c = datos.data;  


      //realiza cálculos intensivos para cada píxel, incrementando la carga de trabajo del procesador
        for(let i = 0; i < 100; i++){  
          // Se multiplica el valor del canal rojo por un pequeño valor para modificar ligeramente su intensidad
          c[i] *= 1.00000000045; 
          // Se multiplica el valor del canal verde por el mismo valor 
          c[i+1] *= 1.00000000045; 
          // Se multiplica el valor del canal azul por el mismo valor 
          c[i+2] *= 1.00000000045;  
        }
        //calculamos los promedios de los varoles RGB para convertir cada pixel en gris
        let gris = Math.round((c[i] + c[i+1] + c[i+2]) / 3);  
        //Actualizamos los valores de los canales rojo,verde y azul
        datos.data[i] = gris;     
        datos.data[i+1] = gris;   
        datos.data[i+2] = gris;   
      }
    console.log("worker finalizado,devolvemos al hilo principal")
    // Se envían de vuelta los datos procesados al hilo principal
    postMessage(datos.data);
    
}


