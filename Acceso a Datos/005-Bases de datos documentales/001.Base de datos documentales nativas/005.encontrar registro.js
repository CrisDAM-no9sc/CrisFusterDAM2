
/// Esta consulta busca todos los documentos en la colección que coincidan con ese nombre 
//si hay varios documentos que coinciden con el filtro, todos se devolverán
db.clientes.find({nombre:"Maria"})
// Devuelve solo un único documento (el primero que encuentra).
db.clientes.findOne({nombre:"Maria"})