<?php
    //aqui abrimos el archivo
    $file = 'tareas.txt';

    //lo lee y lo guarda como un array de lineas
    //Cda linea se convierte en un elemento del array
    $lines = file($file);
    //Coje la primera tarea y la guarda en la variable
	$tarea = $lines[0];
    //enseña la primera tarea de la salida 
    echo $lines[0];

    //Elimina la primera linea del array(ya a sido asignada)
    array_shift($lines);
    //escribir el contenido actulizado (sin la primera tarea) de vuelta en el archivo 'tareas.txt'
    //usamos implode para convertirlo en una caena de texto, uniendo las lineas
    file_put_contents($file, implode('', $lines));
    //creamos un txt para las asignaciones  en modo escritura
    $myfile = fopen("asignaciones.txt", "a");
    //añade el usuario y tarea asginada
    //Usa $_GET para obtener el parámetro 'usuario' desde la URL
	$txt = "Al usuario ".$_GET['usuario']." le ha tocado la tarea: ".$tarea."\n";
    //ecribimos la cadena en el archivo
	fwrite($myfile, $txt);
    //creramos el archivo despues de escribir
	fclose($myfile);

?>