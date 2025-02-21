<?php

// Función para obtener imágenes de una carpeta
function obtenerImagenes($carpeta) {
    $imagenes = [];
    if (is_dir($carpeta)) {
        $archivos = scandir($carpeta);
        foreach ($archivos as $archivo) {
            if (preg_match('/\.(jpg|jpeg|png|gif|svg)$/i', $archivo)) {
                $imagenes[] = $archivo;
            }
        }
    }
    return $imagenes;
}

// Directorios de las gráficas
$carpetasGraficas = [
    'hora' => 'img/hora',
    'minuto' => 'img/minuto',
    'segundo' => 'img/segundo',
];

// Obtener el tipo de gráfica seleccionada
$tipoSeleccionado = isset($_GET['tipo']) && isset($carpetasGraficas[$_GET['tipo']]) ? $_GET['tipo'] : 'hora';
$imagenes = obtenerImagenes($carpetasGraficas[$tipoSeleccionado]);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SISTEMAS DE GRÁFICOS</title>
    <link rel="stylesheet" href="estilos.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- Cargar Chart.js -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> <!-- Cargar jQuery -->
</head>
<body>

        <!-- Encabezado -->
        <div class="encabezado">
            <div class="nombre-app">
                SISTEMAS DE GRÁFICOS
            </div>
        </div>
    <div class="contenedor">
        <h1>Panel de Control en Tiempo Real</h1>

        <!-- Selección de Intervalo -->
        <div class="controles">
            <label for="tiempoCantidad">Actualizar cada:</label>
            <input type="number" id="tiempoCantidad" value="1" min="1">
            <select id="tiempoUnidad">
                <option value="segundos">Segundos</option>
                <option value="minutos">Minutos</option>
                <option value="horas">Horas</option>
            </select>
        </div>

        <!-- Contenedor de gráficos en línea -->
        <div class="graficos-container">
            <canvas id="graficoCPU"></canvas>
            <canvas id="graficoRAM"></canvas>
            <canvas id="graficoDisco"></canvas>
        </div>

        <!-- Botones de exportación -->
        <a href="api_metrica.php?tipo=csv" class="boton-exportar">Descargar CSV</a>
        <a href="api_metrica.php?tipo=json" class="boton-exportar">Descargar JSON</a>
    </div>

    <script>
        // Variables para almacenamiento de datos
        let datosCPU = [], datosRAM = [], datosDisco = [], etiquetas = [];

        // Crear gráficos con Chart.js
        const ctxCPU = document.getElementById('graficoCPU').getContext('2d');
        const graficoCPU = new Chart(ctxCPU, {
            type: 'line',
            data: { labels: etiquetas, datasets: [{ label: 'CPU (%)', data: datosCPU, borderColor: 'red' }] },
            options: { responsive: true }
        });

        const ctxRAM = document.getElementById('graficoRAM').getContext('2d');
        const graficoRAM = new Chart(ctxRAM, {
            type: 'line',
            data: { labels: etiquetas, datasets: [{ label: 'RAM (%)', data: datosRAM, borderColor: 'blue' }] },
            options: { responsive: true }
        });

        const ctxDisco = document.getElementById('graficoDisco').getContext('2d');
        const graficoDisco = new Chart(ctxDisco, {
            type: 'line',
            data: { labels: etiquetas, datasets: [{ label: 'Disco (%)', data: datosDisco, borderColor: 'green' }] },
            options: { responsive: true }
        });

        // Función para actualizar los datos desde la API
        function actualizarMetrica() {
            $.getJSON('api_metrica.php', function(response) {
                let datos = response.metrica;

                if (datos.length > 0) {
                    let ultimaMetrica = datos[datos.length - 1];

                    etiquetas.push(ultimaMetrica.tiempo);
                    datosCPU.push(ultimaMetrica.cpu);
                    datosRAM.push(ultimaMetrica.ram);
                    datosDisco.push(ultimaMetrica.disco);

                    // Mantener solo los últimos 10 datos en el gráfico
                    if (datosCPU.length > 10) {
                        etiquetas.shift();
                        datosCPU.shift();
                        datosRAM.shift();
                        datosDisco.shift();
                    }

                    // Actualizar gráficos
                    graficoCPU.update();
                    graficoRAM.update();
                    graficoDisco.update();
                }
            });
        }

        // Función para calcular el tiempo en milisegundos según la unidad elegida
        function obtenerIntervalo() {
            let cantidad = parseInt(document.getElementById("tiempoCantidad").value);
            let unidad = document.getElementById("tiempoUnidad").value;
            
            if (unidad === "segundos") {
                return cantidad * 1000;  // Convertir segundos a milisegundos
            } else if (unidad === "minutos") {
                return cantidad * 60 * 1000;  // Convertir minutos a milisegundos
            } else if (unidad === "horas") {
                return cantidad * 60 * 60 * 1000;  // Convertir horas a milisegundos
            }
        }

        // Configurar el intervalo de actualización dinámico
        let intervaloID = setInterval(actualizarMetrica, obtenerIntervalo());

        // Cuando el usuario cambie el tiempo, se actualiza la frecuencia
        document.getElementById("tiempoCantidad").addEventListener("change", function() {
            clearInterval(intervaloID);
            intervaloID = setInterval(actualizarMetrica, obtenerIntervalo());
        });

        document.getElementById("tiempoUnidad").addEventListener("change", function() {
            clearInterval(intervaloID);
            intervaloID = setInterval(actualizarMetrica, obtenerIntervalo());
        });

        // Ejecutar una vez al inicio
        actualizarMetrica();
    </script>

</body>
</html>
