<div id="modal">
      <div id="contienemodal"></div>
    </div> 

    <!-- Modal para la ventana flotante de ayuda -->
    <div id="modal-ayuda" class="modal">
      <div class="modal-contenido">
          <button class="cerrar" id="cerrar-ayuda">❌</button>
          <iframe id="iframe-ayuda" src="" style="width: 100%; height: 500px; border: none;"></iframe>
      </div>
  </div>

<script><?php echo file_get_contents("modulos/modal/modal.js");?></script>
<style><?php echo file_get_contents("modulos/modal/modal.css");?></style>
