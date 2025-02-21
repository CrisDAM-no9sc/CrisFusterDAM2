<?php

/**
 * Clase simple para interactuar con el sistema de base de datos en C++ (cyan.out).
 */
class BaseDeDatos
{
    private $ejecutable;
    private $nombreBaseDeDatos;

    /**
     * Constructor de la clase
     *
     * @param string $nombreBaseDeDatos Nombre de la "base de datos" (carpeta).
     */
    public function __construct($nombreBaseDeDatos)
    {
        $this->ejecutable = "C:/xampp/htdocs/Acceso a Datos/cyan/miPrograma.exe";
        $this->nombreBaseDeDatos = $nombreBaseDeDatos;
    }

    /**
     * Operación seleccionar:
     * Llama al programa en C++ con "seleccionar" para listar los archivos .json en la base de datos.
     *
     * @param bool $parsearJson Si es `true`, devuelve los datos como array PHP.
     * @return array|string Devuelve los datos en texto o en array.
     */
    
    public function seleccionar($parsearJson = false)
    {
        // Construir el comando
        $cmd = '"' . $this->ejecutable . '" "' . $this->nombreBaseDeDatos . '" seleccionar';
    
        echo "<pre>Comando ejecutado: " . htmlspecialchars($cmd) . "</pre>";
        // Ejecutar el comando
        $salida = shell_exec($cmd);
    
        // Verificar si hubo error o la salida está vacía
        if ($salida === null || trim($salida) === "") {
            throw new RuntimeException("Error al ejecutar el comando 'seleccionar' o la base de datos está vacía.");
        }
    
        // Si no se requiere parseo, devolver la salida tal cual
        if (!$parsearJson) {
            return $salida;
        }
    
        // Procesar la salida en un array PHP
        $lineas = explode("\n", $salida);
        $resultados = [];
        $archivoActual = null;
        $jsonActual = "";
    
        for ($i = 0; $i < count($lineas); $i++) {
            $linea = trim($lineas[$i]);
    
            if (strpos($linea, 'Archivo: ') === 0) {
                // Guardar el registro anterior antes de empezar el nuevo
                if ($archivoActual !== null && strlen($jsonActual) > 0) {
                    $decodificado = json_decode($jsonActual, true);
                    // Si no se puede decodificar, guardar el JSON crudo
                    $resultados[] = [
                        'archivo' => $archivoActual,
                        'datos' => $decodificado ?? $jsonActual
                    ];
                }
                // Nuevo archivo encontrado
                $archivoActual = substr($linea, strlen('Archivo: '));
                $jsonActual = "";
            } elseif ($linea === 'Contenido:' || $linea === '') {
                continue; // Saltar estas líneas
            } else {
                // Acumular contenido del JSON
                $jsonActual .= ($jsonActual === "" ? $linea : "\n".$linea);
            }
        }
    
        // Guardar el último registro si quedó pendiente
        if ($archivoActual !== null && strlen($jsonActual) > 0) {
            $decodificado = json_decode($jsonActual, true);
            $resultados[] = [
                'archivo' => $archivoActual,
                'datos' => $decodificado ?? $jsonActual
            ];
        }
    
        return $resultados;
    }

    /**
     * Operación insertar:
     * Inserta datos en la base de datos.
     *
     * @param string|array $datosJson Datos en JSON o array PHP.
     * @return string Salida del programa C++.
     */
    public function insertar($datosJson)
    {
        // Si es un array, convertirlo a JSON correcto
        if (is_array($datosJson)) {
            $datosJson = json_encode($datosJson, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
    
        // Validar que el JSON generado sea válido
        if ($datosJson === false || empty($datosJson) || strpos($datosJson, '"') === false) {
            throw new RuntimeException("Error: JSON mal formateado antes de enviarlo a miPrograma.exe");
        }
    
        // Construir el comando manualmente sin escapeshellarg()
        $cmd = '"' . $this->ejecutable . '" "' . $this->nombreBaseDeDatos . '" insertar "' . addslashes($datosJson) . '"';
    
        // Depuración: Imprimir el comando antes de ejecutarlo
        echo "<pre>Comando ejecutado: " . htmlspecialchars($cmd) . "</pre>";
    
        // Ejecutar el comando
        $salida = shell_exec($cmd);
    
        // Si no hay salida, mostrar error
        if ($salida === null || trim($salida) === "") {
            throw new RuntimeException("Error al ejecutar el comando 'insertar'.");
        }
    
        return $salida;
    }
}
