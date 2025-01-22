class GeneradorGrafica {
    constructor(datos, color, selector, titulo) {
        this.datos = datos;     // Los datos del gráfico
        this.color = color;     // Color base para el gráfico
        this.selector = selector; // El selector del contenedor donde se mostrará el gráfico
        this.titulo = titulo;   // Título opcional del gráfico
    }

    // Método que genera la gráfica
    creargrafica() {
        // Definir las dimensiones del lienzo (gráfico)
        let anchura = 512;
        let altura = 512;
        
        // Crear el elemento canvas (lienzo) y asignar sus dimensiones
        let lienzo = document.createElement("canvas");
        lienzo.width = anchura;
        lienzo.height = altura;
        //lienzo.style.border = "1px solid silver"; // Agregar borde al lienzo

        // Obtener el contexto 2D del lienzo para dibujar sobre él
        let contexto = lienzo.getContext("2d");

        // Variaciones para la creación de colores aleatorios en el gráfico
        let variaciones = 100;

        // Convertir el color base de hexadecimal a RGB
        let micolor = this.convertirHex(this.color);
        let supercolor = this.color
        let supertitulo = this.titulo
        // Insertar el lienzo en el DOM, dentro del contenedor especificado
        document.querySelector(this.selector).appendChild(lienzo);

        // Calcular el total de los valores para el gráfico (para las proporciones)
        let total = this.datos.reduce((acc, dato) => acc + dato.valor, 0);

        // Ángulo inicial de la primera porción
        let inicioangulo = 0;

        // Dibujar cada sección del gráfico (porción del pastel)
        this.datos.forEach((dato) => {
            // Crear colores aleatorios para cada porción
            let r = micolor[0] + Math.round((Math.random() - 0.5) * variaciones);
            let g = micolor[1] + Math.round((Math.random() - 0.5) * variaciones);
            let b = micolor[2] + Math.round((Math.random() - 0.5) * variaciones);

            // Calcular el ángulo final de la porción en el gráfico
            let finalangulo = (dato.valor / total) * Math.PI * 2;

            // Establecer el color para la porción
            contexto.fillStyle = `rgb(${r}, ${g}, ${b})`;

            // Comenzar a dibujar la porción (parte del círculo)
            contexto.beginPath();
            contexto.moveTo(anchura / 2, altura / 2); // Moverse al centro del gráfico
            contexto.arc(anchura / 2, altura / 2, anchura / 2 - 30, inicioangulo, inicioangulo + finalangulo); // Dibujar arco de la porción
            contexto.lineTo(anchura / 2, altura / 2); // Volver al centro
            contexto.fill(); // Llenar la porción con el color

            // Calcular la posición del texto de la etiqueta (en el centro de la porción)
            let angulotexto = inicioangulo + finalangulo / 2;

            // Definir el radio para las etiquetas (distancia del centro al texto)
            let radioEtiqueta = anchura / 2 - 120; 
            let desplazamiento = 35;
            let xEtiqueta = anchura / 2 + Math.cos(angulotexto) * (radioEtiqueta + desplazamiento);
            let yEtiqueta = altura / 2 + Math.sin(angulotexto) * (radioEtiqueta + desplazamiento);


            // Dibujar el texto de la etiqueta
            contexto.fillStyle = "white"; // Color del texto
            contexto.textAlign = angulotexto > Math.PI ? "right" : "left"; // Alineación dependiendo de la posición
            let desplazamientoHorizontal = angulotexto < Math.PI ? -10 : 20;
            contexto.fillText(dato.texto, xEtiqueta + desplazamientoHorizontal, yEtiqueta - 5); // Texto de la porción
            contexto.fillText(
                `${((dato.valor / total) * 100).toFixed(1)}%`, // Porcentaje de la porción
                xEtiqueta + desplazamientoHorizontal,
                yEtiqueta + 5
            );
            ///////////////// texto titulo ////////////////
            contexto.textAlign = "center";
            contexto.fillStyle = supercolor;
            contexto.fillText(supertitulo, anchura/2,10)


            

            // Actualizar el ángulo de inicio para la siguiente porción
            inicioangulo += finalangulo;
        });

        // Dibujar el círculo central para crear el efecto de gráfico de pastel
        contexto.fillStyle = "white"; // Color blanco para el círculo central
        contexto.beginPath();
        contexto.arc(anchura / 2, altura / 2, 100, 0, Math.PI * 2); // Crear un círculo central más pequeño
        contexto.fill(); // Llenar el círculo con el color blanco
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