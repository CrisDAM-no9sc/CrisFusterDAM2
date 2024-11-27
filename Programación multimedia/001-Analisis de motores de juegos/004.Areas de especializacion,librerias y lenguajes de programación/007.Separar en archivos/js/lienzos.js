
      //seleccionamos la etiqueta de html en este caso el id de canvas 
      var lienzo = document.querySelector("#lienzo1");
      //pintamos en 2d
      var contexto = lienzo.getContext("2d");
      lienzo.width = 512;
      lienzo.height = 512;
      
      var lienzo2 = document.querySelector("#lienzo2");
      var contexto2 = lienzo2.getContext("2d");
      lienzo2.width = 512;
      lienzo2.height = 512;
      contexto2.fillStyle = "green"
      
      var lienzoplataformas = document.querySelector("#lienzoplataformas");
      var contextoplataformas = lienzoplataformas.getContext("2d");
      lienzoplataformas.width = 512;
      lienzoplataformas.height = 512;
      contexto2.fillStyle = "green"

      var lienzofondo = document.querySelector("#lienzofondo");
      var contextofondo = lienzofondo.getContext("2d");
      lienzofondo.width = 512;
      lienzofondo.height = 512;
      lienzofondo.fillStyle = "green"