function selectjv(selector) {
    let contenedores = [];  // Definir contenedores correctamente

    contenedores.push(document.createElement("div"));
    contenedores[contenedores.length - 1].classList.add("selectjv");

    contenedores[contenedores.length - 1].onclick = function (e) {
        e.stopPropagation();
    };

    selector.replaceWith(contenedores[contenedores.length - 1]);

    let caja = document.createElement("div");
    caja.classList.add("caja");
    caja.textContent = selector.querySelector("option:first-child").textContent;
    contenedores[contenedores.length - 1].appendChild(caja);
    contenedores[contenedores.length - 1].appendChild(selector);

    caja.onclick = function (e) {
        e.stopPropagation();
        caja.classList.add("radio2");

        let resultados = document.createElement("div");
        resultados.classList.add("resultados");
        this.appendChild(resultados);

        let buscador = document.createElement("input");
        buscador.setAttribute("type", "search");
        buscador.setAttribute("placeholder", "busca...");
        resultados.appendChild(buscador);

        buscador.onclick = function (e) {
            e.stopPropagation();
        };

        let contieneresultados = document.createElement("div");
        contieneresultados.onclick = function (e) {
            e.stopPropagation();
        };

        let opciones = selector.querySelectorAll("option");
        opciones.forEach(function (opcion) {
            let texto = document.createElement("p");
            texto.textContent = opcion.textContent;
            contieneresultados.appendChild(texto);

            texto.onclick = function () {
                console.log("Has hecho clic en una opción: ", texto.textContent);
                resultados.remove();
                caja.textContent = texto.textContent;

                let opciones2 = selector.querySelectorAll("option");
                opciones2.forEach(function (opcion2) {
                    if (opcion2.textContent == texto.textContent) {
                        opcion2.setAttribute("selected", true);
                    } else {
                        opcion2.removeAttribute("selected");
                    }
                });
            };
        });

        resultados.appendChild(contieneresultados);

        buscador.onkeyup = function (e) {
            let busca = this.value;
            contieneresultados.innerHTML = "";

            opciones.forEach(function (opcion) {
                if (opcion.textContent.toLowerCase().includes(busca.toLowerCase())) {
                    let texto = document.createElement("p");
                    texto.textContent = opcion.textContent;
                    contieneresultados.appendChild(texto);

                    texto.onclick = function () {
                        console.log("Has hecho clic en una opción: ", texto.textContent);
                        resultados.remove();
                        caja.textContent = texto.textContent;

                        let opciones2 = selector.querySelectorAll("option");
                        opciones2.forEach(function (opcion2) {
                            if (opcion2.textContent == texto.textContent) {
                                opcion2.setAttribute("selected", true);
                            } else {
                                opcion2.removeAttribute("selected");
                            }
                        });
                    };
                }
            });
        };
    };

    document.onclick = function () {
        contenedores.forEach(function (contenedor) {
            try {
                contenedor.querySelector(".resultados").remove();
                contenedor.querySelector(".caja").classList.remove("radio2");
            } catch (error) {
                console.log("error pero no pasa nada");
            }
        });
    };
}
