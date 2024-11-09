# Importa las bibliotecas necesarias
import cv2  # OpenCV para el procesamiento de imágenes
import mediapipe as mp  # Mediapipe para el reconocimiento de manos
import math  # Para cálculos matemáticos
import pyautogui  # Para controlar el mouse

# Inicializa los módulos de Mediapipe para el dibujo y la detección de manos
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands

# Función para calcular la distancia entre dos puntos 3D
def distance_between_points(point1, point2):
    return math.sqrt((point2[0] - point1[0])**2 +
                     (point2[1] - point1[1])**2 +
                     (point2[2] - point1[2])**2)

# Configura la captura de video desde la cámara
cap = cv2.VideoCapture(0)  # 0 para usar la cámara principal

# Configura la solución de detección de manos para el video en tiempo real
with mp_hands.Hands(
    model_complexity=1,  # Complejidad del modelo (1 para mejor precisión)
    min_detection_confidence=0.7,  # Confianza mínima para la detección de la mano
    min_tracking_confidence=0.5) as hands:

    while cap.isOpened():
        success, image = cap.read()  # Lee un fotograma de la cámara
        if not success:
            print("Ignoring empty camera frame.")
            continue  # Omite si no se ha leído un fotograma

        # Convierte la imagen de BGR a RGB para el procesamiento
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False  # Mejora la eficiencia
        results = hands.process(image)  # Procesa la imagen para detectar manos
        image.flags.writeable = True  # Permite escribir en la imagen de nuevo
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Vuelve a convertir la imagen a BGR para OpenCV

        # Verifica si hay manos detectadas
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Dibuja los landmarks en la imagen
                mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style())

                # Extrae los puntos del pulgar y del índice
                thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
                index_finger_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]

                # Convierte las coordenadas normalizadas a píxeles
                image_height, image_width, _ = image.shape
                x_pixel = int(index_finger_tip.x * image_width)  # Coordenada x
                y_pixel = int(index_finger_tip.y * image_height)  # Coordenada y

                # Calcula la distancia entre el pulgar y el índice
                distance = distance_between_points(
                    (thumb_tip.x, thumb_tip.y, thumb_tip.z),
                    (index_finger_tip.x, index_finger_tip.y, index_finger_tip.z)
                )

                # Si los dedos están cerca (distancia menor a 0.05), mueve el cursor
                if distance < 0.05:  # Ajusta este valor si es necesario
                    pyautogui.moveTo(x_pixel, y_pixel)  # Mueve el cursor a la posición del índice

        # Muestra la imagen procesada en una ventana
        cv2.imshow('MediaPipe Hands', cv2.flip(image, 1))  # Refleja la imagen
        if cv2.waitKey(5) & 0xFF == 27:  # Presiona ESC para salir
            break

# Libera la cámara y cierra todas las ventanas de OpenCV
cap.release()
cv2.destroyAllWindows()
