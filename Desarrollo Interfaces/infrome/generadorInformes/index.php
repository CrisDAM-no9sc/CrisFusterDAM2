<?php
// index.php
// Habilitar reporte de errores MySQLi (útil en desarrollo)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Conexión a la base de datos MySQL (ajusta los datos según corresponda)
$mysqli = mysqli_connect("localhost", "crismon1", "crismon1", "crismon1");

// Consulta a la tabla ips_control
$query_ips = "SELECT * FROM ips_control";
$result_ips = mysqli_query($mysqli, $query_ips);
$ipsControl = mysqli_fetch_all($result_ips, MYSQLI_ASSOC);

// (Opcional) Cierra la conexión
// mysqli_close($mysqli);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generador de Informes</title>
  <!-- Enlazamos el CSS -->
  <link rel="stylesheet" href="estilo.css">
  <!-- Enlazamos el JS de gráficos -->
  <script src="generadorInforme.js"></script>
</head>
<body>
  <header>
    <h1>Informe de Accesos</h1>
  </header>

  <section class="grafico-seccion">
    <h2>Distribución de Navegadores</h2>
    <div id="grafico-pastel" class="contenedor-grafico"></div>
  </section>

  <section class="grafico-seccion">
    <h2>Bloqueos por País</h2>
    <div id="grafico-barras" class="contenedor-grafico"></div>
  </section>

  <section class="grafico-seccion">
    <h2>Actividad por Fecha</h2>
    <div id="mapa-calor" class="contenedor-grafico"></div>
  </section>

  <footer>
    <p>Generado el <?php echo date("d/m/Y"); ?></p>
  </footer>

  <script>
    document.addEventListener("DOMContentLoaded", function () {
      const datosIpsControl = <?php echo json_encode($ipsControl); ?>;

      // Gráfico Pastel: Navegadores
      const graficoPastel = new generadorInforme.Grafico("#grafico-pastel", datosIpsControl);
      graficoPastel.crearGraficoPastel(document.querySelector("#grafico-pastel"));
      
      // Gráfico de Barras: Bloqueos por País
      const graficoBarras = new generadorInforme.Grafico("#grafico-barras", datosIpsControl);
      graficoBarras.crearGraficoBarras(document.querySelector("#grafico-barras"));
      
      // Mapa de Calor: Fechas de Registro
      const mapaCalor = new generadorInforme.Grafico("#mapa-calor", datosIpsControl);
      mapaCalor.crearMapaCalor(document.querySelector("#mapa-calor"));
    });
  </script>
</body>
</html>
