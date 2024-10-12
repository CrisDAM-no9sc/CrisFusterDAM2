window.onload = function(){
    fetch("../../servidor/aplicaciones.php")               //llamamos al archivo de aplicciones
        .then(response => {
          return response.json();                       // Quiero que el servidor me devuelva un json
        })
        .then(data => {
            console.log(data)                           //le decimos que nos imorima el jsn en pantalla
        })
}