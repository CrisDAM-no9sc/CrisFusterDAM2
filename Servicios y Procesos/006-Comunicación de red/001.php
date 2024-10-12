<?php
    $myfile = fopen("usuario.txt", "a");
    $txt =$_GET['usuario']."\n";
    fwrite($myfile,$txt);
    
    fclose($myfile);
?>