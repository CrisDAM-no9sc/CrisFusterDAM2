# pip install SpeechRecognition
# pip install pyaudio

import speech_recognition as sr                                                                   

reconocimiento = sr.Recognizer()                                        

def reconocer():                                                         
    with sr.Microphone() as origen:                                       
        print("Ajustando ruido de fondo")                                  
        reconocimiento.adjust_for_ambient_noise(origen, duration=1)         
        print("Escuchamos...")                                              
        audio = reconocimiento.listen(origen)                           

        try:                                                           
            print("Reconociendo...")           
            ##aqui es dodne escojemos el lenauaje de habla                            
            text = reconocimiento.recognize_google(audio, language="es-ES") 
            print(f"Reconocido: {text}")                                   
        except sr.RequestError:                                             
            print("Error 1")
        except sr.UnknownValueError:
            print("Error 2")

reconocer()         
