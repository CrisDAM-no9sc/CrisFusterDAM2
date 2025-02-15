<?php include "include/idiomas.php"; ?>

<!doctype html>
<html lang="es">
  <head>
    <title>
    <?php echo $idioma['titulo']['contenido']; ?>
    </title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="estilologin.css">
    <script src="login.js"></script>
  </head>
  <body>
    <div id="formlogin">
      <img src="img/icono.png" id="logo">
      <input type="text" id="usuario" placeholder="<?php echo $idioma['usuario']['contenido']; ?>">
      <input type="text" id="contrasena" placeholder="<?php echo $idioma['contrasena']['contenido']; ?>">
      <button id="login"><?php echo $idioma['login']['contenido']; ?></button>
      <div id="comentario"></div>
    </div>
    <div id="toast"></div>
  </body>
</html>
