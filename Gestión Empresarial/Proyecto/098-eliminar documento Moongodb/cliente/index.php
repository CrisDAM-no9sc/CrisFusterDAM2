<!-- 
*** Es la página de inicio del sistema de login. Carga el formulario dinámicamente y permite la autenticación
*** Funciones principales:
* - Incluye sis_seguridad.php para validar el acceso seguro.
* - Carga las traducciones desde include/idiomas.php.
* - Genera dinámicamente el formulario con los textos en el idioma seleccionado.
* - Incluye login.js con defer para que se ejecute después de cargar el DOM.
-->


<?php include "inc/sis_seguridad.php"; ?>

<?php include "include/idiomas.php"; ?>

<!doctype html>
<html lang="es">
  <head>
    <title>
    <?php echo $idioma['titulo']['contenido']; ?>
    </title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="estilologin.css">
    <script src="login.js" defer></script>
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
