 //cargamos las imagenes del bueno y del malo y plataforma
 var imagenbueno = new Image();
 imagenbueno.src = "img/cara_a_b.png";

 var imagenmalo = new Image();
 imagenmalo.src = "img/malo.png";

 var imagenplataformas = new Image();
 imagenplataformas.src= "img/plataformas.png";
 //cuando a cargado la imagen de las plataformas 
 imagenplataformas.onload = function(){
   //la pintamos sobre el lienzo del fondo
   contextoplataformas.drawImage(imagenplataformas,0,0)
 }

 var imagenfondo = new Image();
 imagenfondo.src= "img/fondo_1.png";
 imagenfondo.onload = function(){
   contextofondo.drawImage(imagenfondo,0,0)
 }

 var imagennivel = new Image();
 imagennivel.src = "img/nivel_1.png";
 imagennivel.onload = function(){
   console.log("Imagen cargada");
   contextoplataformas.imageSmoothingEnabled = false;
   //contextoplataformas.drawImage(imagennivel,0,0,2028,500);
   contextoplataformas.drawImage(imagennivel,0,0,2048,512); 
 }