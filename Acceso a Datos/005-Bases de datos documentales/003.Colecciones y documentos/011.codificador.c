#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const char base64_chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Función para codificar una cadena en Base64
void codificarBase64(const char *entrada, char *salida) {
    int i = 0, j = 0;
    int longitud = strlen(entrada);
    unsigned char array3[3];
    unsigned char array4[4];

    while (longitud--) {
        array3[i++] = *(entrada++);
        if (i == 3) {
            array4[0] = (array3[0] & 0xfc) >> 2;
            array4[1] = ((array3[0] & 0x03) << 4) + ((array3[1] & 0xf0) >> 4);
            array4[2] = ((array3[1] & 0x0f) << 2) + ((array3[2] & 0xc0) >> 6);
            array4[3] = array3[2] & 0x3f;

            for (i = 0; i < 4; i++) {
                salida[j++] = base64_chars[array4[i]];
            }
            i = 0;
        }
    }

    if (i) {
        for (int k = i; k < 3; k++) {
            array3[k] = '\0';
        }

        array4[0] = (array3[0] & 0xfc) >> 2;
        array4[1] = ((array3[0] & 0x03) << 4) + ((array3[1] & 0xf0) >> 4);
        array4[2] = ((array3[1] & 0x0f) << 2) + ((array3[2] & 0xc0) >> 6);
        array4[3] = array3[2] & 0x3f;

        for (int k = 0; k < i + 1; k++) {
            salida[j++] = base64_chars[array4[k]];
        }

        while (i++ < 3) {
            salida[j++] = '=';
        }
    }

    salida[j] = '\0';
}

// Función para decodificar una cadena en Base64
int buscarIndiceBase64(char c) {
    if (c >= 'A' && c <= 'Z') return c - 'A';
    if (c >= 'a' && c <= 'z') return c - 'a' + 26;
    if (c >= '0' && c <= '9') return c - '0' + 52;
    if (c == '+') return 62;
    if (c == '/') return 63;
    return -1;
}

void decodificarBase64(const char *entrada, char *salida) {
    int longitud = strlen(entrada);
    int i = 0, j = 0, k;
    unsigned char array4[4], array3[3];

    while (longitud-- && (*entrada != '=') && buscarIndiceBase64(*entrada) != -1) {
        array4[i++] = *(entrada++);
        if (i == 4) {
            for (i = 0; i < 4; i++) {
                array4[i] = buscarIndiceBase64(array4[i]);
            }

            array3[0] = (array4[0] << 2) + ((array4[1] & 0x30) >> 4);
            array3[1] = ((array4[1] & 0xf) << 4) + ((array4[2] & 0x3c) >> 2);
            array3[2] = ((array4[2] & 0x3) << 6) + array4[3];

            for (i = 0; i < 3; i++) {
                salida[j++] = array3[i];
            }
            i = 0;
        }
    }

    if (i) {
        for (k = i; k < 4; k++) {
            array4[k] = 0;
        }

        for (k = 0; k < 4; k++) {
            array4[k] = buscarIndiceBase64(array4[k]);
        }

        array3[0] = (array4[0] << 2) + ((array4[1] & 0x30) >> 4);
        array3[1] = ((array4[1] & 0xf) << 4) + ((array4[2] & 0x3c) >> 2);
        array3[2] = ((array4[2] & 0x3) << 6) + array4[3];

        for (k = 0; k < i - 1; k++) {
            salida[j++] = array3[k];
        }
    }

    salida[j] = '\0';
}

// Función principal
int main() {
    const char *mensaje = "Hola, mundo!";
    char codificado[256];
    char decodificado[256];

    // Codificar el mensaje
    codificarBase64(mensaje, codificado);
    printf("Mensaje original: %s\n", mensaje);
    printf("Codificado en Base64: %s\n", codificado);

    // Decodificar el mensaje
    decodificarBase64(codificado, decodificado);
    printf("Decodificado desde Base64: %s\n", decodificado);

    return 0;
}
