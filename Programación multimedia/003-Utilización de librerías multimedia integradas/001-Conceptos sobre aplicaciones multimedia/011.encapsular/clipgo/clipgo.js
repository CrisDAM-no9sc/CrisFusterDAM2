window.onload = function () {

    
    let videos = document.querySelectorAll("video");
    videos.forEach(function (video) {
        let etiquetavideo = video;

        ///////////////////////////// Crear contenedor principal //////////////////////////////////
        let contenedorvideo = document.createElement("div");
        contenedorvideo.classList.add("clipgo");
        etiquetavideo.replaceWith(contenedorvideo);
        contenedorvideo.appendChild(video);

        /////////////////////////////  Crear barra de controles //////////////////////////////////
        let barracontrol = document.createElement("div");
        barracontrol.classList.add("barracontrol");
        contenedorvideo.appendChild(barracontrol);

        /////////////////////////////  BARRA DE PROGRESO DEL VIDEO  //////////////////////////////////
        let barraprogreso = document.createElement("div");
        barraprogreso.classList.add("barraprogreso");
        contenedorvideo.appendChild(barraprogreso);

        let progresovideo = document.createElement("div");
        progresovideo.classList.add("progreso-video");
        barraprogreso.appendChild(progresovideo);

        ///////////////////////////////// CREAR BOTON ATRAS ///////////////////////////////
        //creamos la barra de progreso 
        let botonatras = document.createElement("button");
        botonatras.innerHTML = "<img src='img/atras.png' alt='atras'>";
        barracontrol.appendChild(botonatras);

        /////////////////////////////  Botón de Play/Pausa /////////////////////////////////////
        let play = document.createElement("button");
        play.innerHTML = "<img src='img/play.png' alt='Play'>";
        barracontrol.appendChild(play);

        ///////////////////////////////// CREAR BOTON ADELATE ///////////////////////////////
        let botonalante = document.createElement("button");
        botonalante.innerHTML = "<img src='img/alante.png' alt='alante'>";
        barracontrol.appendChild(botonalante);

        /////////////////////////////  CONTROL DE VOLUMEN /////////////////////////////////////
        //contenedor para el control de volumen
        let contenedorvolumen = document.createElement("div");
        contenedorvolumen.classList.add("volumen-container");
        barracontrol.appendChild(contenedorvolumen);
        //botón con el icono de altavoz
        let volumenBoton = document.createElement("button");
        volumenBoton.innerHTML = "<img src='img/volumen.png' alt='Volume'>";
        contenedorvolumen.appendChild(volumenBoton);

        /////////////////////////////  BARRA DE VOLUMEN /////////////////////////////////////
        //una barra de volumen que inicialmente la he puesto en oculto 
        let volumenBarra = document.createElement("div");
        volumenBarra.classList.add("volumen-barra");
        contenedorvolumen.appendChild(volumenBarra);
        //Aquí indicamos el nivel actual de volumen que tiene el video 
        let volumenProgreso = document.createElement("div");
        volumenProgreso.classList.add("volumen-progreso");
        volumenBarra.appendChild(volumenProgreso);



        ///////////////////////////// FUNCIONES PLAY/PAUSE /////////////////////////////
        let estado = "pause";
        play.onclick = function () {
            controlPlayPause();
        };

        //////////////////////////// Botón de Volumen //////////////////////////////
        volumenBoton.onclick = function () {
            if (etiquetavideo.muted) {
                etiquetavideo.muted = false;
                volumenBoton.innerHTML = "<img src='img/volumen.png' alt='Volume'>";
            } else {
                etiquetavideo.muted = true;
                volumenBoton.innerHTML = "<img src='img/mute.png' alt='Mute'>";
            }
            volumenBarra.classList.toggle("mostrar");
        };

        /////////////////////////// AJUSTE DE VOLUMEN //////////////////////////////
        volumenBarra.onclick = function (event) {
            let rect = volumenBarra.getBoundingClientRect();
            let posicionclick = event.clientX - rect.left;
            let nuevoVolumen = Math.max(0, Math.min(1, posicionclick / rect.width));
            etiquetavideo.volume = nuevoVolumen;
            etiquetavideo.muted = false;
            volumenBoton.innerHTML = "<img src='img/volumen.png' alt='Volume'>";
            volumenProgreso.style.width = `${nuevoVolumen * 100}%`;
        };

        ///////////// FUNCION PARA LOS BOTONES ADELATE/ATRAS //////////////
        botonatras.onclick = function () {
            etiquetavideo.currentTime -= 10;
        };

        botonalante.onclick = function () {
            etiquetavideo.currentTime += 10;
        };

        ///////////////////// ACTUALIZACIÓN DEL PROGRESO DE VIDEO //////////////////
        etiquetavideo.addEventListener('timeupdate', () => {
            let actual = etiquetavideo.currentTime;
            let total = etiquetavideo.duration;
            let porcentaje = (actual / total) * 100;
            progresovideo.style.width = porcentaje + "%";
        });

        /////////////////////////////// CLICK EN EL VIDEO /////////////////////////////
        etiquetavideo.onclick = function () {
            controlPlayPause();
        };

        function controlPlayPause(){
            if (estado === "pause") {
                etiquetavideo.play();
                play.innerHTML = "<img src='img/pause.png' alt='Pause'>";
                estado = "play";
            } else {
                etiquetavideo.pause();
                play.innerHTML = "<img src='img/play.png' alt='Play'>";
                estado = "pause";
            }
        }

    });
};