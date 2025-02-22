function comprimir(coleccion){
    ////////////////////////////  PRIMERO QUITAMOS LA TRANSPARENCIA //////////////////////////
    const sintransparencia = [];
    //para cada pixel
    for (let i = 0; i < coleccion.length; i += 4) {
        //descartamos la transparencia y los unificamos 
        sintransparencia.push((coleccion[i] << 16) | (coleccion[i + 1] << 8) | coleccion[i + 2]);
    }
    //////////////// LUEGO COMPRIMIMOS RLE //////////////
    let comprimido = rleCompressionArray(sintransparencia);
    return comprimido;
}

function descomprimir(coleccion) {
    let descomprimido = rleDecompressionArray(coleccion);
    const descomprime = new Uint8ClampedArray(descomprimido.length * 4);
    let j = 0;
    for (let i = 0; i < descomprimido.length; i++) {
        descomprime[j++] = (descomprimido[i] >> 16) & 255; // R
        descomprime[j++] = (descomprimido[i] >> 8) & 255;  // G
        descomprime[j++] = descomprimido[i] & 255;         // B
        descomprime[j++] = 255;                             // A
    }
    return descomprime;
}


function rleCompressionArray(arr) {
    let compresion = []; 
    let contador = 1;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === arr[i - 1]) {
            contador++;
        } else {
            compresion.push([arr[i - 1], contador]);
            contador = 1;
        }
    }
    compresion.push([arr[arr.length - 1], contador]); 
    return compresion;
}

function rleDecompressionArray(comprimido) {
    const descomprimido = [];

    for (let i = 0; i < comprimido.length; i++) {
        const [valor, contador] = comprimido[i]; 
        for (let j = 0; j < contador; j++) {
            descomprimido.push(valor); 
        }
    }

    return descomprimido;
}

function insertar(arr, elemento){
    for(let i =3;i< arr.length; i +=4){
        arr.splice(i,0,elemento);
        i++;
    }
    return arr;
}