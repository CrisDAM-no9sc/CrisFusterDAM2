<main>
  <nav>
    <ul>
      <!-- Aquí se irán creando los elementos de navegación mediante JavaScript -->
    </ul>
  </nav>
  
  <section>
    <div class="titulotabla">
      <button id="insertar" tooltip="Insertar nuevo registro">+</button>
      <h5>Clientes</h5>
      <p>Aquí podremos ver los registros e ingresar nuevos</p>
    </div>
    <table>
      <thead>
        <tr></tr>
      </thead>
      <tbody></tbody>
    </table>
  </section>
</main>
<script><?php echo file_get_contents("modulos/principal/principal.js"); ?></script>
<style><?php echo file_get_contents("modulos/principal/principal.css"); ?></style>
