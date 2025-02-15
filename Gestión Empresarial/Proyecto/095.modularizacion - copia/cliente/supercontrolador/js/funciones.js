function renderizarTabla(arrayAsociado) {
    let tabla =  `<table class='vistaTabla'>`;
    tabla += `<thead><tr><th>Clave</th><th>Valor</th></tr></thead>`;
    tabla += `<tbody>`;

    for (const clave in arrayAsociado) {
        tabla += `<tr><td>${clave}</td><td>${arrayAsociado[clave]}</td></tr>`;
    }

    tabla += `</tbody></table>`;
    return tabla;
}


