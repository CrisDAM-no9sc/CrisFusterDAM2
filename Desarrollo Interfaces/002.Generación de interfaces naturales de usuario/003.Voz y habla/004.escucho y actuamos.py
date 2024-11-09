

import speech_recognition as sr                                                                   

reconocimiento = sr.Recognizer()                                        

def reconocer():                                                         
    with sr.Microphone() as origen:                                       
        print("Ajustando ruido de fondo")                                  
        reconocimiento.adjust_for_ambient_noise(origen, duration=1)         
        print("Tus opciones: ")  
        print("1. Insertar un nuevo registro ")  
        print("2. Listar registros")  
        print("3. Actualizar un registro ")  
        print("4. Eliminar un registro ") 
        print("Escuchamos...")                                               
        audio = reconocimiento.listen(origen)                           

        try:                                                           
            print("Reconociendo...")           
            ##aqui es dodne escojemos el lenauaje de habla                            
            text = reconocimiento.recognize_google(audio, language="es-ES") 
            print(f"Reconocido: {text}")
            if text == "insertar":
                print("operación de insertar reconocida, vamos a inserar un nuevo registro")
            elif text == "listar":
                print("operación de listar reconocida, vamos a por la lista de clientes")
            elif text == "actualizar":
                print("operación de actualizar reconocida, vamos a actualizar un cliente")
            elif text == "eliminar":
                print("operación de listar reconocida, vamos a eliminar un cliente")
            else:
                print("Lo que has dictado no ha sido reconocido")                                   
        except sr.RequestError:                                             
            print("Error 1")
        except sr.UnknownValueError:
            print("Error 2")

reconocer()         
