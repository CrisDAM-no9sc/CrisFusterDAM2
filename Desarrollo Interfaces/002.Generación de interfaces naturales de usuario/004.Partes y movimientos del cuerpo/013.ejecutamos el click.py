import cv2  # Importa la librería OpenCV para el tratamiento de imágenes.
import mediapipe as mp  # Importa Mediapipe, que se utiliza para el reconocimiento de manos y otras características.
# Herramientas de dibujo para las manos.
mp_drawing = mp.solutions.drawing_utils  
# Estilos de dibujo para los landmarks.
mp_drawing_styles = mp.solutions.drawing_styles  
# Inicializa la solución para detección de manos.
mp_hands = mp.solutions.hands  
import math  # Importa la librería matemática para cálculos.
import pyautogui  # Importa PyAutoGUI para controlar el cursor del ratón.

########################### Función para calcular la distancia entre dos puntos en 3D  #############################
def distance_between_points(point1, point2):
                    # Calcula la diferencia en x y la eleva al cuadrado.
    return math.sqrt((point2[0] - point1[0])**2 + 
                     # Calcula la diferencia en y y la eleva al cuadrado. 
                     (point2[1] - point1[1])**2 +  
                     # Calcula la diferencia en z y la eleva al cuadrado.
                     (point2[2] - point1[2])**2)  

# Mueve el cursor a una posición inicial en la pantalla.
pyautogui.moveTo(10, 10)

##################################### Sección para manejar imágenes ##############################
# Lista vacía para archivos de imagen estáticos.
IMAGE_FILES = []  
# Crea un objeto de detección de manos.
with mp_hands.Hands(  
     # Modo de imagen estática.
    static_image_mode=True, 
     # Máximo número de manos a detectar.
    max_num_hands=1, 
    # Confianza mínima para detección de manos.
    min_detection_confidence=0.5) as hands:  
    
    # Itera sobre cada archivo de imagen 
    for idx, file in enumerate(IMAGE_FILES): 
        # Lee y voltea la imagen para efecto espejo. 
        image = cv2.flip(cv2.imread(file), 1)  
        # Convierte la imagen a RGB y procesa.
        results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))  
        # Imprime la mano que se está utilizando.
        print('Handedness:', results.multi_handedness) 
        # Si no hay landmarks de manos detectados, continua. 
        if not results.multi_hand_landmarks: 
            continue
        image_height, image_width, _ = image.shape  # Obtiene las dimensiones de la imagen.
        annotated_image = image.copy()  # Copia la imagen original para dibujar sobre ella.
        
        # Itera sobre las manos detectadas.
        for hand_landmarks in results.multi_hand_landmarks:
            # Imprime los landmarks de la mano.
            print('hand_landmarks:', hand_landmarks)  
            print(
                # Imprime las coordenadas de la punta del dedo índice.
                f'Index finger tip coordinates: (', 
                f'{hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x * image_width}, '
                f'{hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * image_height})'
            )
            ########################## Dibuja los landmarks de la mano en la imagen ##########################
            mp_drawing.draw_landmarks(
                annotated_image,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,  
                mp_drawing_styles.get_default_hand_landmarks_style(),  
                mp_drawing_styles.get_default_hand_connections_style()) 
        
        # Guarda la imagen anotada en un archivo.
        cv2.imwrite(
            '/tmp/annotated_image' + str(idx) + '.png', cv2.flip(annotated_image, 1))
        
        # Dibuja los landmarks de la mano en el espacio 3D (opcional).
        if not results.multi_hand_world_landmarks:  # Si no hay landmarks 3D, continua.
            continue
        for hand_world_landmarks in results.multi_hand_world_landmarks:
            # Plotea los landmarks 3D.
            mp_drawing.plot_landmarks(
                hand_world_landmarks, mp_hands.HAND_CONNECTIONS, azimuth=5)

#################################### Sección para manejar la entrada de la cámara #############################

 # Captura video desde la cámara por defecto.
cap = cv2.VideoCapture(0) 
 # Inicializa un contador para controlar el tiempo.
contador = 0 

# Configura la solución de detección de manos para video en tiempo real.
with mp_hands.Hands(
     # Complejidad del modelo (0 para menor carga computacional).
    model_complexity=0, 
    # Confianza mínima para detección de manos.
    min_detection_confidence=0.5,  
    min_tracking_confidence=0.5) as hands:
    
    ################### Bucle capturar y procesar cada fotograma ################################
    while cap.isOpened():
        # Incrementa el contador.
        contador += 1  
        # Lee un fotograma de la cámara.
        success, image = cap.read()  
        if not success:  
            # Si no se ha leído correctamente un fotograma, muestra un mensaje.
            print("Ignoring empty camera frame.")
            continue  

        # Marca la imagen como no writable para mejorar el rendimiento.
        image.flags.writeable = False
        # Convierte la imagen de BGR a RGB.
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  
        # Procesa la imagen para detectar manos.
        results = hands.process(image)  

        # Dibuja las anotaciones de la mano en la imagen.
        image.flags.writeable = True  # Permite escribir en la imagen nuevamente.
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convierte de nuevo a BGR para OpenCV.
        
        # Verifica si hay landmarks de manos detectados.
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Dibuja los landmarks de la mano en la imagen.
                mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style())

                # Extrae los puntos del pulgar (punto 4) y del índice (punto 8).
                thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]  # Punta del pulgar.
                index_finger_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]  # Punta del índice.

                ######################## Convierte las coordenadas a píxeles para el índice ###################
                # Obtiene las dimensiones de la imagen.
                image_height, image_width, _ = image.shape  
                # Coordenada x del dedo índice.
                x_pixel = int(index_finger_tip.x * image_width)  
                 # Coordenada y del dedo índice.
                y_pixel = int(index_finger_tip.y * image_height) 

                # Calcula la distancia entre el pulgar y el índice para detectar clics.
                distance = distance_between_points(
                    # Coordenadas del pulgar.
                    (thumb_tip.x, thumb_tip.y, thumb_tip.z), 
                    # Coordenadas del índice. 
                    (index_finger_tip.x, index_finger_tip.y, index_finger_tip.z)  
                )

                # Si el contador es múltiplo de 10, mueve el cursor a la posición del dedo índice.
                if contador % 10 == 0:
                    # Mueve el cursor, invirtiendo x para el efecto espejo.
                    pyautogui.moveTo(512 - x_pixel, y_pixel)  
                
                # Imprime un mensaje solo si la distancia es menor a 0.1 (se están tocando).
                if distance < 0.1:
                    # Muestra en consola que se está haciendo clic.
                    #print("click") 
                    # Mueve el cursor a la posición del dedo índice solo si el contador es múltiplo de 10.
                    if contador % 2 == 0:
                        # Mueve el cursor, invirtiendo x para el efecto espejo
                        #pyautogui.moveTo(512 - x_pixel, y_pixel)  
                        pyautogui.click()

        # Muestra la imagen procesada en una ventana con efecto espejo.
        # Refleja la imagen para una vista estilo selfie.
        cv2.imshow('MediaPipe Hands', cv2.flip(image, 1))  
        # Presiona la tecla ESC para salir.
        if cv2.waitKey(5) & 0xFF == 27:  
            break  

# Libera la cámara y cierra todas las ventanas de OpenCV al final.
cap.release()  # Libera el objeto de captura de video.
cv2.destroyAllWindows()  # Cierra todas las ventanas abiertas.
