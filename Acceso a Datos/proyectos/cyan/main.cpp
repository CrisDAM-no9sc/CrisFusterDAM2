#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <regex>
#include <set>

// Función para validar si una cadena es JSON correcto (verifica comillas en claves)
bool esJsonValido(const std::string& json) {
    std::regex jsonRegex(R"(\{\s*\"[\w\s]+\"\s*:\s*\"?.+\"?\s*(,\s*\"[\w\s]+\"\s*:\s*\"?.+\"?\s*)*\})");
    return std::regex_match(json, jsonRegex);
}

/////////// obtener el numero del archivo //////////////////////////////
int obtenerSiguienteNumeroArchivo(const std::string& nombreBaseDeDatos) {
    int numero = 1;
    std::set<int> numerosExistentes;

    // Buscar archivos existentes y registrar sus números
    for (const auto& entrada : std::filesystem::directory_iterator(nombreBaseDeDatos)) {
        std::string nombreArchivo = entrada.path().filename().string();
        std::regex regexArchivo(R"(producto(\d+)\.json)");
        std::smatch match;

        if (std::regex_match(nombreArchivo, match, regexArchivo)) {
            int num = std::stoi(match[1].str());
            numerosExistentes.insert(num);
        }
    }

    // Buscar el número más bajo disponible
    while (numerosExistentes.count(numero)) {
        numero++;
    }
    return numero;
}

int main(int argc, char* argv[]) {
    // Se asegura de que el usuario pase los argumentos correctos.
    if (argc < 3) {
        std::cerr << "Uso:\n"
                  << "  " << argv[0] << " <nombreBaseDeDatos> seleccionar\n"
                  << "  " << argv[0] << " <nombreBaseDeDatos> insertar <datosJSON>\n"
                  << "  " << argv[0] << " <nombreBaseDeDatos> eliminar <idArchivo>\n";
        return 1;
    }
    ////////////////////////// CREAR LA CARPETA DE LA BASE DE DATOS ////////////////////////
    std::string nombreBaseDeDatos = argv[1];
    std::string operacion = argv[2];

    // Asegurar que la carpeta de la base de datos existe
    try {
        std::filesystem::create_directories(nombreBaseDeDatos);
    } catch (const std::exception &ex) {
        std::cerr << "Error al crear/verificar el directorio: " << ex.what() << '\n';
        return 1;
    }
    ////////////////////////////////////// MOSTRAR LOS REGISTROS ///////////////////////////////
    //Lista todos los archivos JSON en la carpeta y los muestra en la terminal.
    if (operacion == "seleccionar") {
        try {
            for (const auto& entrada : std::filesystem::directory_iterator(nombreBaseDeDatos)) {
                if (entrada.is_regular_file() && entrada.path().extension() == ".json") {
                    std::ifstream archivoEntrada(entrada.path());
                    if (!archivoEntrada) {
                        std::cerr << "Error al abrir el archivo: " << entrada.path() << '\n';
                        continue;
                    }

                    std::string contenido((std::istreambuf_iterator<char>(archivoEntrada)),
                                          std::istreambuf_iterator<char>());

                    // Validar JSON antes de imprimir
                    if (!esJsonValido(contenido)) {
                        std::cerr << "Error: Archivo JSON malformado en " << entrada.path().filename().string() << '\n';
                        continue;
                    }

                    std::cout << "Archivo: " << entrada.path().filename().string() << '\n';
                    std::cout << "Contenido:\n" << contenido << "\n\n";
                }
            }
        } catch (const std::exception &ex) {
            std::cerr << "Error al leer el contenido del directorio: " << ex.what() << '\n';
            return 1;
        }
    }
    ////////////////////////////////////// INSERTAR REGISTROS ///////////////////////////////
    //Guarda nuevos registros con nombres como
    else if (operacion == "insertar") {
        if (argc < 4) {
            std::cerr << "Error: Falta el dato JSON para la operación de inserción.\n";
            return 1;
        }

        std::string datosJSON = argv[3];

        // Obtener el siguiente número de archivo disponible (producto1.json, producto2.json, etc.)
        int numeroArchivo = obtenerSiguienteNumeroArchivo(nombreBaseDeDatos);
        std::string nombreArchivo = "producto" + std::to_string(numeroArchivo) + ".json";
        std::filesystem::path rutaArchivo = std::filesystem::path(nombreBaseDeDatos) / nombreArchivo;

        // Escribir el archivo con el nuevo nombre
        try {
            std::ofstream archivoSalida(rutaArchivo);
            if (!archivoSalida) {
                std::cerr << "Error al crear el archivo: " << rutaArchivo.string() << '\n';
                return 1;
            }
            archivoSalida << datosJSON;
            archivoSalida.close();
            std::cout << "Datos insertados correctamente en: " << rutaArchivo.string() << '\n';
        } catch (const std::exception &ex) {
            std::cerr << "Error al escribir el archivo: " << ex.what() << '\n';
            return 1;
        }
    }
    ///////////////////////////////////// ELIMINAR EL REGISTRO ////////////////////////////////////
    
    else if (operacion == "eliminar") {
        if (argc < 4) {
            std::cerr << "Error: Falta el ID del registro para eliminar.\n";
            return 1;
        }

        std::string idArchivo = argv[3];
        std::filesystem::path rutaArchivo = std::filesystem::path(nombreBaseDeDatos) / idArchivo;

        // Verificar si el archivo existe antes de eliminarlo
        if (!std::filesystem::exists(rutaArchivo)) {
            std::cerr << "Error: El archivo no existe." << std::endl;
            return 1;
        }

        try {
            std::filesystem::remove(rutaArchivo);
            std::cout << "Registro eliminado correctamente: " << rutaArchivo.string() << '\n';
        } catch (const std::exception &ex) {
            std::cerr << "Error al eliminar el archivo: " << ex.what() << '\n';
            return 1;
        }
    }
    else {
        std::cerr << "Error: Operación desconocida '" << operacion << "'. Use 'seleccionar' o 'insertar'.\n";
        return 1;
    }

    return 0;
}
