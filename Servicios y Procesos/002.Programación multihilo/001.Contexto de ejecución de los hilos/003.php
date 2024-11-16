<?php
	//aqui le indicamos que quwremos abrir un nuevo archivo llamado usuarios.text en modo anexado
	//con fopen lo que acemos es decirle que abra o cree si no existe el archivo
	//a: si ya esxxiste se posicionara al final del archivo para escribir sin eliminar el contenido
	$myfile = fopen("usuarios.txt", "a");
	//el archivo recibe el parametro usuario mediante el get
	//la cadena que lael get nos proporciona sera la que se almacene en la variable $txt
	$txt = $_GET['usuario']."\n";
	//aqui escribira la cadena de txt en el archivo myfile
	fwrite($myfile, $txt);
	//crerramos el archivo
	fclose($myfile);
    
?>
