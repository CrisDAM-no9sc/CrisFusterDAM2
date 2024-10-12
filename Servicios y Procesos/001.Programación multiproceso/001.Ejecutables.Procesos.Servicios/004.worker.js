// 004.worker.js
onmessage = function() {
    console.log("hola");
    postMessage("ok soy el ordenador y vuelvo al proceso principal");
}
