# Estructura del Proyecto

- **096.implemnetar mejora en vistaTabla/**
    - **api/**
        - formulario.html
        - index.php
        - ip.php
        - **inc/**
            - damepedidos.php
            - error.php
            - insertarCliente.php
    - **cliente/**
        - estilologin.css
        - index.php
        - login.js
        - **analisis/**
            - cosigo.js
            - estilo.css
            - index.html
        - **aplicaciones/**
            - **cms/**
            - **crm/**
        - **escritorio/**
            - comportamiento.js
            - estilo.css
            - index.html
            - **img/**
                - cerrar_sesion.png
                - icono.png
                - logo.png
        - **img/**
            - aplicacioenes.png
            - clientes.png
            - documento.png
            - eliminar.png
            - icnotabla.png
            - icono.png
            - iconodocumento.png
            - informe.png
            - listapedidos.png
            - lupa.png
            - nombrecliente.png
            - pedidos.png
            - productos.png
            - usuarios.png
        - **include/**
            - idiomas.php
        - **supercontrolador/**
            - comportamiento.js
            - estilo.css
            - index.php
            - **apps/**
                - apps.json
                - **clientes/**
                    - **ficha_clientes/**
                        - index.html
                    - **historico_compra/**
                        - index.html
                - **pedidos/**
                    - **detalle_pedido/**
                        - index.html
            - **ayuda/**
                - index.php
                - **docs/**
                    - 003.Preguntas Frecuentes.html
            - **img/**
                - icono.png
                - iconoconsola.png
                - informe.png
            - **js/**
                - cargaDatosTabla.js
                - cargarDatosColeccion.js
                - convierteTipoDato.js
                - crearMenuTablas.js
                - funciones.js
                - pueblaTabla.js
            - **lib/**
                - **ampliador/**
                    - ampliador.css
                    - ampliador.js
                - **graficos/**
                    - graficos.js
                - **selectjv/**
                    - selectjv.css
                    - selectjv.js
                - **textEditor/**
                    - TextEditor.css
                    - TextEditor.js
                - **tooltip/**
                    - tooltip.css
                    - tooltip.js
                - **vistaTabla/**
                    - vistaTabla.css
                    - vistaTabla.js
            - **modulos/**
                - **cabecera/**
                    - cabecera.css
                    - cabecera.js
                    - cabecera.php
                - **cierre/**
                    - cierre.css
                    - cierre.php
                - **librerias/**
                    - librerias.php
                - **modal/**
                    - modal.css
                    - modal.js
                    - modal.php
                - **principal/**
                    - principal.css
                    - principal.js
                    - principal.php
        - **traductor/**
            - en.json
            - es.json
    - **documentación/**
        - diagrama cliente_servidor.odg
        - diagrama.odg
    - **formularios/**
        - envia.php
        - estilo.css
        - index.php
        - panel.php
        - vista.php
        - **documentos/**
            - 1738667300.json
            - 1738667456.json
            - 1738668266.json
        - **forms/**
            - cliente.json
            - productos.json
            - registro.json
        - **lib/**
            - **validadorForm/**
                - validadorForm.css
                - validadorForm.js
    - **public/**
        - index.php
    - **servidor/**
        - ConectorMongoDB.php
        - conexionDB.php
        - index.php
        - **antiguo/**
            - columnas_tabla.php
            - datos_tabla.php
            - eliminar_dato.php
            - insertar.php
            - lista_aplicaciones.php
            - lista_tablas.php
            - loginusuario.php
        - **lib/**
            - codificador.php
            - fuerza_bruta.php
            - registros.php
            - sanear.php

# Documentación de Archivos

## api\formulario.html

cuando el usuario rellena los datos del formulario al apretar el boton de enviar esos datos se pasaran al archivo de api
para que sean procesados e insertados en la base de datos

## cliente\estilologin.css

Estilo General del Cuerpo

## cliente\analisis\cosigo.js

FUNCIONES PARA LISTAR LAS TABLAS  /////////////////////////////

## cliente\escritorio\estilo.css

Estilo global

## cliente\supercontrolador\estilo.css

Estilo global

## cliente\supercontrolador\js\cargaDatosTabla.js

CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

## cliente\supercontrolador\lib\ampliador\ampliador.css

Estilo de la Página General

## cliente\supercontrolador\lib\textEditor\TextEditor.js

Enumeramos los elementos textarea

## cliente\supercontrolador\lib\vistaTabla\vistaTabla.js

Función que configura la tabla, la ordena y la actualiza

## cliente\supercontrolador\modulos\cabecera\cabecera.css

Estilo del header

## cliente\supercontrolador\modulos\cabecera\cabecera.js

Función para mostrar el nombre de usuario guardado en localStorage

## cliente\supercontrolador\modulos\cierre\cierre.css

Estilo del footer

## cliente\supercontrolador\modulos\modal\modal.css

****************** ESTILO VENTANA EMERGENTE ***********************

## cliente\supercontrolador\modulos\modal\modal.js

--- Ventana modal para INSERTAR REGISTROS ---

## cliente\supercontrolador\modulos\principal\principal.js

Función para listar las tablas según la aplicación seleccionada

## formularios\estilo.css

Estilo general del formulario

## formularios\lib\validadorForm\validadorForm.css

Clase para campos inválidos (error)

## formularios\lib\validadorForm\validadorForm.js

Seleccionamos todos los elementos <input> del documento

