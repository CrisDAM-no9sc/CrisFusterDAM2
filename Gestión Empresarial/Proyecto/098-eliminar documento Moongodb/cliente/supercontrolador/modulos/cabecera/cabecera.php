<header>
  supercontrolador
  <div id="contenedor-usuario">
    <div id="nombre-usuario"></div>
    <div class="boton email">
      <button id="correo" tooltip="Entrar en el correo">🖂</button>
      <button id="ayuda" tooltip="Consultar ayuda">❔</button>
      <button id="imprimir" tooltip="Imprimir sección">🖨️</button> 
      <button id="logout" tooltip="Salir de la Aplicación">Salir</button>
    </div>
  </div>
</header>

<script><?php echo file_get_contents("modulos/cabecera/cabecera.js"); ?></script>
<style><?php echo file_get_contents("modulos/cabecera/cabecera.css"); ?></style>
