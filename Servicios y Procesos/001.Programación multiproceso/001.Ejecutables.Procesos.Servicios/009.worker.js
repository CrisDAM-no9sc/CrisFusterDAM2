// Esta función se ejecuta cuando el Worker recibe un mensaje del hilo principal.
onmessage = function(datos) {
    // Mostramos el mensaje recibido (el índice 'w', que indica el ID del Worker).
    console.log("Hola soy el núcleo:", datos.data); 

    /*
    let numero = 1.00000054;
    let iteraciones = 10000000;
    for (let i = 0; i < iteraciones; i++) {
        numero *= 1.000000076;
    }*/
     // Enviamos de vuelta un mensaje al hilo principal para indicar que el Worker ha terminado.
    postMessage("ok soy el ordenador y vuelvo al proceso principal");
    
};