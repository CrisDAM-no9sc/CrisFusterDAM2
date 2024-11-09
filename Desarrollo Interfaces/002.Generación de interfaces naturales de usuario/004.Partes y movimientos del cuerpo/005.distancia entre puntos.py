# Importa la biblioteca OpenCV para el tratamiento de imágenes y videos
import cv2        
# Importa Mediapipe, que usa OpenCV para el reconocimiento facial, de manos y de cuerpo
import mediapipe as mp  
## Inicializa los módulos de dibujo y la solución de manos de Mediapipe
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
# Módulo específico para el reconocimiento de manos en Mediapipe
mp_hands = mp.solutions.hands  
import math

## cALCULAMOS LA DISTANCIA EUCLIDIANA ENTRE LOS DOS PUTNOS EN EL ESPACIO TRIDIMENSIONAL
def distance_between_points(point1, point2):
   return math.sqrt((point2[0] - point1[0])**2 +
                    (point2[1] - point1[1])**2 + 
                    (point2[2] - point1[2])**2)


# Lista de archivos de imagen para procesar (vacía en este caso)
IMAGE_FILES = []

# Configura la solución de detección de manos en modo imagen estática
with mp_hands.Hands(     
    # Indica que se procesarán imágenes estáticas                                                                       
    static_image_mode=True,
    # Define el número máximo de manos a detectar                  
    max_num_hands=1, 
    # Confianza mínima para considerar una detección                        
    min_detection_confidence=0.5) as hands:  

  # Procesa cada imagen en IMAGE_FILES
  for idx, file in enumerate(IMAGE_FILES): 
    # Lee y voltea la imagen horizontalmente para simular un efecto espejo
    image = cv2.flip(cv2.imread(file), 1)    

    # Convierte la imagen de BGR a RGB, necesario para que Mediapipe procese correctamente
    results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))                            

    # Imprime la "mano" detectada (si es la derecha o la izquierda)
    print('Handedness:', results.multi_handedness) 

    # Si no se detectaron landmarks (puntos clave) de la mano, continúa con la siguiente imagen
    if not results.multi_hand_landmarks:
      continue

    # Obtiene la altura y ancho de la imagen
    image_height, image_width, _ = image.shape

    # Crea una copia de la imagen para añadir anotaciones
    annotated_image = image.copy()

    # Procesa cada conjunto de landmarks (puntos de referencia) de la mano detectada
    for hand_landmarks in results.multi_hand_landmarks:
      print('hand_landmarks:', hand_landmarks)  # Imprime las coordenadas de los puntos clave

      # Imprime las coordenadas del punto correspondiente a la punta del dedo índice
      print(
          f'Index finger tip coordinates: (',
          f'{hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x * image_width}, '
          f'{hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * image_height})'
      )

      # Dibuja los landmarks (puntos de la mano) en la imagen de salida
      mp_drawing.draw_landmarks(
          annotated_image,
          hand_landmarks,
          mp_hands.HAND_CONNECTIONS,  # Conexiones entre los puntos de la mano
          # Estilo de los puntos
          mp_drawing_styles.get_default_hand_landmarks_style(),  
          # Estilo de las conexiones
          mp_drawing_styles.get_default_hand_connections_style()) 

    # Guarda la imagen anotada en un archivo temporal, reflejada horizontalmente
    cv2.imwrite(
        '/tmp/annotated_image' + str(idx) + '.png', cv2.flip(annotated_image, 1))
    
    # Si no hay landmarks en el espacio tridimensional, pasa a la siguiente imagen
    if not results.multi_hand_world_landmarks:
      continue

    # Dibuja los landmarks de la mano en 3D
    for hand_world_landmarks in results.multi_hand_world_landmarks:
      mp_drawing.plot_landmarks(
        hand_world_landmarks, mp_hands.HAND_CONNECTIONS, azimuth=5)

# Inicializa la captura de video desde la cámara (0 representa la cámara predeterminada)
cap = cv2.VideoCapture(0)

# Configura la solución de detección de manos para el video en tiempo real
with mp_hands.Hands(
  # Complejidad del modelo (0 para rapidez)
    model_complexity=0,     
    # Confianza mínima para detectar la mano               
    min_detection_confidence=0.5,
    # Confianza mínima para realizar seguimiento de la mano          
    min_tracking_confidence=0.5) as hands: 
  # Bucle hasta que se cierre la cámara
  while cap.isOpened():                    

    # Lee un fotograma de la cámara
    success, image = cap.read()
    if not success:
      # Muestra un mensaje si el fotograma está vacío
      print("Ignoring empty camera frame.")  
      continue  # Omite este fotograma

    # Deshabilita la capacidad de escritura de la imagen para mejorar la eficiencia
    image.flags.writeable = False
    # Convierte el color de la imagen de BGR a RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # Procesa la imagen para detectar manos
    results = hands.process(image)

    # Permite nuevamente la escritura en la imagen
    image.flags.writeable = True
    # Convierte el color de la imagen de RGB a BGR para mostrarla en OpenCV
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Si se detectan manos, procesa cada conjunto de landmarks
    if results.multi_hand_landmarks:
      for hand_landmarks in results.multi_hand_landmarks:
        # Dibuja los landmarks en la imagen
        mp_drawing.draw_landmarks(
            image,
            hand_landmarks,
             # Conexiones entre puntos de la mano
            mp_hands.HAND_CONNECTIONS, 
             # Estilo de landmarks
            mp_drawing_styles.get_default_hand_landmarks_style(), 
            # Estilo de conexiones
            mp_drawing_styles.get_default_hand_connections_style()) 
        
        ############## COMPRAMOS LAS DISTANCIA ENTRE DOS PUTNOS #################
        ##Mpara marcar la distancia
        umbral = 5
        ##iniciamos con coordenadas,para almacenar las cordenadas 
        punto1 = (0,0,0)
        punto2 = (0,0,0)
        #recorre la lista de puntos de la mano detectados
        for idx, landmark in enumerate(hand_landmarks.landmark):
            ##si el indice es 4 guarda las coordenadas en putno1
            if idx == 4:
                punto1 = (landmark.x,landmark.y,landmark.z)
            #si el indice es 8 las guarda en putno2
            elif idx == 8:
                punto2 = (landmark.x,landmark.y,landmark.z) 
        
        ##Calcula e imprime la distancia entre punto1 y punto2 usando la función distance_between_points.
        distance = distance_between_points(punto1, punto2)
        print(distance)


        
    # Muestra el fotograma procesado en una ventana, reflejado horizontalmente (selfie view)
    cv2.imshow('MediaPipe Hands', cv2.flip(image, 1))

    # Si se presiona la tecla "ESC" (código 27), se rompe el bucle
    if cv2.waitKey(5) & 0xFF == 27:
      break

# Libera la cámara y cierra todas las ventanas de OpenCV
cap.release()
