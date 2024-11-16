<?php 

  // Comprueba si los datos y turno se han enviado mediante la solicitud GET
  if (isset($_GET['datos']) && isset($_GET['turno'])) {
      // Abrimos y creamos un archivo en modo escritura
      $file = fopen("tablero.html", "w");

      // Verificamos si se pudo abrir el archivo
      if (!$file) {
          die("Error al abrir el archivo.");
      }

      // Escribe el contenido de los datos y turno en el archivo tablero.html
      fwrite($file, $_GET['datos'] . "<!--TURN--> " . $_GET['turno']);

      // Cerramos el archivo después de escribir en él
      fclose($file);

      // Envía una cadena de texto al cliente que hizo la solicitud GET
      echo "Turno guardado.";
  } else {
      // Si no se recibieron los datos o el turno, mostramos un error
      echo "Faltan datos o turno en la solicitud.";
  }
  /*
    $myfile = fopen("tablero.html", "w")or die("No se puede abrir el archivo");
    $txt = $_GET['datos'];
    fwrite($myfile, $txt);
    fclose($myfile);
    echo "Todo bien";
    */
?>
