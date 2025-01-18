db.clientes.insertOne(
    {
        nombre: "Maria", 
        apellidos: "Cifuentes Normal",
        // el campo email es u array que contiene objetos 
        // Cada objeto tiene dos campos 
        emails: [
            {
                tipo: 'personal',
                email: 'marcifuentes@personal.com'
            },{
                tipo: 'empresa',
                email: 'marcifuentes@empresa.com'
            } 
        ]
    }
)


