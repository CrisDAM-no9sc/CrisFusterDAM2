from flask import Flask
##iniciamos el inventario con un valor de 20
#cada vez que el servidor reciba la solicitud el numero del valor sera descreciente en 1
inventario = 20
#creamos una instancia y le asignamos a la variable app
#aqui lo que esta haciendo es configurar la aplicacion para que se pueda manejar rutas y solicitudes
app = Flask(__name__)
#aqui tenemos un decorador que va a definir la ruta
# / la ruta es la raiz del servidor, cada vex que se acceda a localhost se ejecutar la funcion
@app.route('/')

#----------------------------- definimos la ruta raiz  ----------------------------# 
#se ejecutara solo cuando alguien visite la ruta
#aqui definimos lo que tiene que hacer el servidor y lo que le tinee que devolver al cliente cuando
#reciba la informacion
def inicio():
    #la declaramos en global dentro de la funcion para poder modigficar su valor 
    global inventario
    inventario -= 1
    #contruimos una cadena de texto para ver cuantos elementos quedan en el inventario
    #la funcion str se encarga de convertir a texto y concatenarlo con el mensaje
    return "Te quedan "+str(inventario)+" elementos en el inventario"

#------------------------------- INICIAMOS EL SERVIDOR -----------------------------#
#verificamos si el archivo se esta ejecutando directamente y no como modulo
if __name__ == '__main__':
    #iniciamos el servidor flask, debug nos va a apermiti recargar automaticamente el servidor cuando el codigo cambie
    #especificamos el puerto en el que el servidor estara escuchando
    app.run(debug=True, host='127.0.0.1', port=5000)