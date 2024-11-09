##pip install SpeechRecognition
#pip install pyaudio
############ SOLO RECONOCE EL INGLES ############
import speech_recognition as sr

# Creamos una instancia del objeto reconocedor
reconocimiento = sr.Recognizer()

# Creamos una función a la que vamos a llamar 
def reconocer():
    ##obtenemos el audio del microfono y lo llamamos origen
    with sr.Microphone() as origen:
        print("Ajustando ruido de fondo")
        ##para medir el ruido de fondoque hay en un segundo
        reconocimiento.adjust_for_ambient_noise(origen, duration=1)
        print("Escuchamos...")
        ##esta linea escucha lo que dice el usurio
        audio = reconocimiento.listen(origen)

        try:
            print("Reconocimiento...")
            #aqui metemos en google lo que ha escuchado 
            text = reconocimiento.recognize_google(audio)
            #y lo lanza por pantalla
            print(f"Reconocido: {text}") 
        except sr.RequestError:
            print("Error 1: Error de solicitud a la API de Google")
        except sr.UnknownValueError:
            print("Error 2: No se pudo entender el audio")

#ejecutamos la funcion
reconocer()
