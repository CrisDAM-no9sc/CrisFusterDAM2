/**
 * # Generador de Gráficos Dinámicos
 * 
 * ## Descripción:
 * Esta clase permite generar gráficos de pastel y de barras de manera dinámica utilizando
 * el elemento `<canvas>`. Se pueden personalizar los colores, el título y el contenedor
 * donde se insertará el gráfico.
 * 
 * ## Funcionalidades principales:
 * - Creación de gráficos circulares (tipo pastel).
 * - Creación de gráficos de barras.
 * - Soporte para personalización de colores y títulos.
 * - Conversión de colores de formato hexadecimal a RGB.
 * - Distribución automática de etiquetas en los gráficos.
 */

class GeneradorGrafica {
    constructor(datos, color, selector, titulo) {
        this.datos = datos;     // Los datos del gráfico
        this.color = color;     // Color base para el gráfico
        this.selector = selector; // El selector del contenedor donde se mostrará el gráfico
        this.titulo = titulo;   // Título opcional del gráfico
    }
    
 
    creargrafica() {
        let anchura = 512;
        let altura = 512;

        let lienzo = document.createElement("canvas");
        lienzo.width = anchura;
        lienzo.height = altura;
        lienzo.style.border = "1px solid silver";
        let contexto = lienzo.getContext("2d");

        let variaciones = 100;
        let micolor = this.convertirHex(this.color);
        let supercolor = this.color;
        let supertitulo = this.titulo;

        document.querySelector(this.selector).appendChild(lienzo);

        let total = this.datos.reduce((acc, dato) => acc + dato.valor, 0);
        let inicioangulo = 0;

        this.datos.forEach((dato) => {
            let r = micolor[0] + Math.round((Math.random() - 0.5) * variaciones);
            let g = micolor[1] + Math.round((Math.random() - 0.5) * variaciones);
            let b = micolor[2] + Math.round((Math.random() - 0.5) * variaciones);

            let finalangulo = (dato.valor / total) * Math.PI * 2;
            contexto.fillStyle = `rgb(${r}, ${g}, ${b})`;

            // Dibujar la porción del gráfico
            contexto.beginPath();
            contexto.moveTo(anchura / 2, altura / 2);
            contexto.arc(anchura / 2, altura / 2, anchura / 2 - 50, inicioangulo, inicioangulo + finalangulo);
            contexto.lineTo(anchura / 2, altura / 2);
            contexto.fill();

            // Calcular el ángulo medio para posicionar el texto
            let angulotexto = inicioangulo + finalangulo / 2;

            // Calcular la posición del texto
            let radioTexto = (anchura / 2 - 100); // Radio más pequeño para centrar el texto
            let xTexto = anchura / 2 + Math.cos(angulotexto) * radioTexto;
            let yTexto = altura / 2 + Math.sin(angulotexto) * radioTexto;

            // Guardar el estado del contexto antes de rotar
            contexto.save();

            // Trasladar y rotar el contexto
            contexto.translate(xTexto, yTexto);
            let rotacion = angulotexto;
            if (angulotexto > Math.PI) {
                rotacion += Math.PI; // Invertir el texto si está en la mitad inferior
            }
            contexto.rotate(rotacion);

            // Dibujar el texto principal (nombre del dato)
            contexto.fillStyle = "black"; // Color del texto
            contexto.font = "10px Arial"; // Tamaño y fuente del texto
            contexto.textAlign = "center";
            contexto.textBaseline = "middle";
            contexto.fillText(dato.texto, 0, -8); // Texto principal, ligeramente más arriba

            // Dibujar el porcentaje debajo del texto principal
            contexto.font = "9px Arial"; // Fuente ligeramente más pequeña
            contexto.fillText(`${((dato.valor / total) * 100).toFixed(1)}%`, 0, 4); // Porcentaje debajo del texto

            // Restaurar el estado original del contexto
            contexto.restore();

            // Actualizar el ángulo de inicio para la siguiente porción
            inicioangulo += finalangulo;
        });

        // Dibujar el círculo central
        contexto.fillStyle = "white";
        contexto.beginPath();
        contexto.arc(anchura / 2, altura / 2, 100, 0, Math.PI * 2);
        contexto.fill();

        // Dibujar el título
        contexto.textAlign = "center";
        contexto.fillStyle = supercolor;
        contexto.font = "bold 20px Arial";
        contexto.fillText(supertitulo, anchura / 2, 30); // Solo se dibuja una vez en la parte superior
    }

    // Método para generar un gráfico de barras
    creargraficabarras() {
        // Dimensiones del gráfico
        let anchura = 512;
        let altura = 512;

        // Crear el lienzo
        let lienzo = document.createElement("canvas");
        lienzo.width = anchura;
        lienzo.height = altura;

        // Obtener el contexto 2D
        let contexto = lienzo.getContext("2d");

        // Añadir el lienzo al contenedor
        document.querySelector(this.selector).appendChild(lienzo);

        // Calcular valores de referencia
        let total = this.datos.reduce((acc, dato) => acc + dato.valor, 0); // Total de valores
        let anchoBarra = anchura / this.datos.length - 10; // Ancho de cada barra
        let maxValor = Math.max(...this.datos.map((dato) => dato.valor)); // Valor máximo

        // Dibujar cada barra
        this.datos.forEach((dato, index) => {
            // Altura proporcional de la barra
            let alturaBarra = (dato.valor / maxValor) * (altura - 50);

            // Posición de la barra
            let x = index * (anchoBarra + 10);
            let y = altura - alturaBarra;

            // Colores aleatorios para cada barra
            let micolor = this.convertirHex(this.color);
            let r = micolor[0] + Math.round((Math.random() - 0.5) * 50);
            let g = micolor[1] + Math.round((Math.random() - 0.5) * 50);
            let b = micolor[2] + Math.round((Math.random() - 0.5) * 50);

            // Dibujar barra
            contexto.fillStyle = `rgb(${r}, ${g}, ${b})`;
            contexto.fillRect(x, y, anchoBarra, alturaBarra);

            // Dibujar etiquetas
            contexto.fillStyle = "black";
            contexto.textAlign = "center";
            contexto.fillText(dato.texto, x + anchoBarra / 2, altura - 10); // Etiqueta del texto
            contexto.fillText(`${dato.valor}`, x + anchoBarra / 2, y - 5); // Etiqueta del valor
        });
    }

    // Método para convertir un color hexadecimal a RGB
    convertirHex(codigohexadecimal) {
        codigohexadecimal = codigohexadecimal.replace(/^#/, '');
        let numerohex = parseInt(codigohexadecimal, 16);
        let rojo = (numerohex >> 16) & 255;
        let verde = (numerohex >> 8) & 255;
        let azul = numerohex & 255;
        return [rojo, verde, azul];
    }
}