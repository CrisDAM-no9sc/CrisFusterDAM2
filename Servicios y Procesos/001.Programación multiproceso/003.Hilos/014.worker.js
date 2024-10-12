onmessage = function(event) {
    const datos = event.data.data;
    const width = event.data.width;
    const copy = datos.slice(); // Hacer una copia de los datos originales
    const offsets = [-1, 0, 1]; // Para moverse en los píxeles vecinos

    // Aplicar un efecto de desenfoque simple
    for (let i = 0; i < datos.length; i += 4) {
        let r = 0, g = 0, b = 0, count = 0;

        // Calcular las coordenadas del píxel actual
        const x = (i / 4) % width;
        const y = Math.floor(i / (4 * width));

        // Recorrer los píxeles vecinos
        for (let dx of offsets) {
            for (let dy of offsets) {
                let posX = x + dx;
                let posY = y + dy;

                // Asegurarse de que estamos dentro de los límites
                if (posX >= 0 && posX < width && posY >= 0 && posY < width) {
                    const index = (posY * width + posX) * 4;
                    r += copy[index];
                    g += copy[index + 1];
                    b += copy[index + 2];
                    count++;
                }
            }
        }

        // Asignar el promedio a los canales RGB
        datos[i] = Math.floor(r / count);     // Rojo
        datos[i + 1] = Math.floor(g / count); // Verde
        datos[i + 2] = Math.floor(b / count); // Azul
    }

    postMessage(datos); // Enviar los datos procesados de vuelta al hilo principal
}
