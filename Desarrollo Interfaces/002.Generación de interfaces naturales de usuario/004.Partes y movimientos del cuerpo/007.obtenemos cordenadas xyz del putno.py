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

def distance_between_points(point1, point2):
   return math.sqrt((point2[0] - point1[0])**2 +
                    (point2[1] - point1[1])**2 + 
                    (point2[2] - point1[2])**2)


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

    # Obtiene la altura y ancho de la imagen
    image_height, image_width, _ = image.shape

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
        # Establecemos un umbral de distancia
        umbral = 0.1
        # Inicializamos las coordenadas de los puntos
        punto1 = (0,0,0)
        punto2 = (0,0,0)

        # Recorre la lista de puntos de la mano detectados
        for idx, landmark in enumerate(hand_landmarks.landmark):
            ## Si el índice es 4 guarda las coordenadas en punto1 (punta del pulgar)
            if idx == 4:
                punto1 = (landmark.x,landmark.y,landmark.z)
            # Si el índice es 8 las guarda en punto2 (punta del índice)
            elif idx == 8:
                punto2 = (landmark.x,landmark.y,landmark.z) 
        
        # Calcula la distancia y verifica si es menor al umbral
        distance = distance_between_points(punto1, punto2)
        if distance < umbral:
            x_pixel = int(punto2[0] * image_width)
            y_pixel = int(punto2[1] * image_height)
            # Imprime las coordenadas en píxeles si los dedos están "tocándose"
            print(f"Se están tocando. Coordenadas 2D en píxeles -> x: {x_pixel}, y: {y_pixel}")

    # Muestra el fotograma procesado en una ventana, reflejado horizontalmente (selfie view)
    cv2.imshow('MediaPipe Hands', cv2.flip(image, 1))

    # Si se presiona la tecla "ESC" (código 27), se rompe el bucle
    if cv2.waitKey(5) & 0xFF == 27:
      break

# Libera la cámara y cierra todas las ventanas de OpenCV
cap.release()
