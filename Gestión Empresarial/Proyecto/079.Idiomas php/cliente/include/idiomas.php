<?php

$idioma = explode(",",$_SERVER['HTTP_ACCEPT_LANGUAGE'])[0];


$archivojson = 'traductor/'.$idioma.'.json';


$contenidojson = file_get_contents($archivojson);
$idioma = json_decode($contenidojson, true);




?>