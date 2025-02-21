function convierteTipoDato(tipo){

    //------------------------- CONFIGURACIÓN DINAMICA  --------------------------//
    let tipodevuelto
    //aqui estamos haciendo que en cada casilla contyenga el datos que le corresponde 
    //si la columna es varchar, el input sera del tipo text
    if(tipo.includes("varchar")){
        tipodevuelto = "text";
    }else if(tipo.includes("text")){
        tipodevuelto = "textarea";
    //si es date, sera un selector de fecha 
    }else if(tipo.includes("int")){
        tipodevuelto = "number";
    //si es date, sera un selector de fecha 
    }else if(tipo.includes("date")){
        tipodevuelto = "date";
    }else if(tipo.includes("decimal")){
        tipodevuelto = "number";
    }else if(tipo.includes("blob")){
        tipodevuelto = "file";
    }


    return tipodevuelto
}