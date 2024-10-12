
onmessage = function(datos) {
    console.log("Hola soy el núcleo:", datos.data); // Accede correctamente al mensaje recibido

    /*
    let numero = 1.00000054;
    let iteraciones = 10000000;
    for (let i = 0; i < iteraciones; i++) {
        numero *= 1.000000076;
    }
    postMessage("ok soy el ordenador y vuelvo al proceso principal");
    */
};