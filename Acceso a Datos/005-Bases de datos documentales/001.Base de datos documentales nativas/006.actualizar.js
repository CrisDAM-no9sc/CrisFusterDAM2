// esta funcion solo la vamos a utilizar para un documento que coincida con el filtro de nomrbe 
// busca el primer documento e la colección
// y si hay mas de un nombre igual solo el prmero sera actualizado
db.clientes.updateOne(
    {nombre:"Maria"},               //criterio de busqueda
    { 
        $set: { nombre: "Juana" }   // por el nombre que se va a a cambiar 
    }

)

//esta funcion la utilizamos para actualizar todos los resultados que coincdan con el criterio que le pasemos
// Todos los documentos que tengan nombre: "Maria" serán actualizados
db.clientes.updateMany(
    {nombre:"Maria"},
    { 
        $set: { nombre: "Juana" } 
    }

)