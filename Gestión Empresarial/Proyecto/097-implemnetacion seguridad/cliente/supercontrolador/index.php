<?php

/**
 * # Página Principal de la Aplicación
 *
 * ## Descripción:
 * Este archivo carga los módulos principales de la aplicación, organizando el layout de la interfaz.
 *
 * ## Módulos incluidos:
 * - **Cabecera (`cabecera.php`)**: Contiene el encabezado del sistema.
 * - **Principal (`principal.php`)**: Cuerpo principal donde se muestra la información.
 * - **Modal (`modal.php`)**: Ventanas emergentes o modales para interacciones.
 * - **Librerías (`librerias.php`)**: Carga scripts y estilos adicionales.
 * - **Cierre (`cierre.php`)**: Pie de página o cierre de estructuras HTML abiertas.
 *
 * ## Funciones principales:
 * - Ensamblar los módulos del sistema.
 * - Cargar los scripts de comportamiento (`comportamiento.js`).
 */

  include "modulos/cabecera/cabecera.php";
  include "modulos/principal/principal.php";
  include "modulos/modal/modal.php";
  include "modulos/librerias/librerias.php";
  include "modulos/cierre/cierre.php";

?>
<!-- Script principal de comportamiento -->
<script src="comportamiento.js"></script>
