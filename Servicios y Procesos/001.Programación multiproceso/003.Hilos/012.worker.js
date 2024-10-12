onmessage = function(datos){

    console.log("worker arrancado, vamos a trabajar");
    // Se recorre cada píxel de la imagen (cada píxel tiene 4 valores: rojo, verde, azul y alfa)
    for(let i = 0; i < datos.data.length; i+=4){  
        // Se accede a los datos del píxel actual
        let c = datos.data; 
        // Se calcula el promedio de los valores RGB para convertir el píxel en un tono de gris
        let gris = Math.round((c[i] + c[i+1] + c[i+2]) / 3);  
        // Se actualiza el valor del canal rojo con el valor de gris calculado
        datos.data[i] = gris;
        // Se actualiza el valor del canal verde con el valor de gris calculado     
        datos.data[i+1] = gris; 
        // Se actualiza el valor del canal azul con el valor de gris calculado  
        datos.data[i+2] = gris;   
      }
    console.log("worker finalizado,devolvemos al hilo principal")
    postMessage(datos.data);
    
}


onmessage = function(datos){
    console.log("worker arrancado, vamos a trabajar")
    for(let i = 0;i<datos.data.length;i+=4){              // Recorro cada pixel
        let c = datos.data                                  // Cargo los datos de ese pixel
        /* GRIS
        let gris = Math.round((c[i] + c[i+1] + c[i+2])/3)   // Saco el promedio
        datos.data[i] = gris;                               // actualizo el color rojo para que sea gris
        datos.data[i+1] = gris;                             // actualizo el color verde para que sea gris
        datos.data[i+2] = gris;                             // actualizo el color azul para que sea gris
        */
        
        /* NEGATIVO
        datos.data[i] = 255-datos.data[i];                               // actualizo el color rojo para que sea gris
        datos.data[i+1] = 255-datos.data[i+1];                             // actualizo el color verde para que sea gris
        datos.data[i+2] = 255-datos.data[i+2];                             // actualizo el color azul para que sea gris
        */
        
         //UMBRAL 
        if(datos.data[i] < 100){
            datos.data[i] = 0;                              
            datos.data[i+1] = 0;                             
            datos.data[i+2] = 0;                             
        }else{
            datos.data[i] = 255;                            
            datos.data[i+1] = 255;                            
            datos.data[i+2] = 255;                          
        }
      }
      
      
      //console.log(datos.data)
      console.log("worker finalizado, devolvemos al hilo principal")
     postMessage(datos.data)
}