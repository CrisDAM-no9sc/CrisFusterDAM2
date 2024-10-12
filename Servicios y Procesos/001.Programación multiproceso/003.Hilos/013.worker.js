onmessage = function(event) {
    console.log("Worker 2 arrancado, vamos a trabajar");
    // Obtengo los datos enviados por el hilo principal
    let datos = event.data; 

    // Recorro cada píxel de la imagen
    for (let i = 0; i < datos.length; i += 4) {
        // Convierto a negativo
        datos[i] = 255 - datos[i]; // Actualizo el canal rojo
        // Actualizo el canal verde
        datos[i + 1] = 255 - datos[i + 1];
        // Actualizo el canal azul 
        datos[i + 2] = 255 - datos[i + 2]; 
    }

    console.log("Worker 2 finalizado, devolvemos al hilo principal");
    // Envio los datos procesados de vuelta
    postMessage(datos); 
}
