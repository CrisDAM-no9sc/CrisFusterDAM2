import cv2  # Importación de la librería OpenCV para tratamiento de imagen y video
import mediapipe as mp  # Mediapipe se apoya en OpenCV para reconocimiento de manos, faciales, etc.
mp_drawing = mp.solutions.drawing_utils  # Utilidad de dibujo de Mediapipe
mp_drawing_styles = mp.solutions.drawing_styles  # Estilos de dibujo de Mediapipe
mp_hands = mp.solutions.hands  # Inicialización del módulo de reconocimiento de manos
import math  # Biblioteca para funciones matemáticas
import pyautogui  # Biblioteca para controlar el cursor del ratón

# Función para calcular la distancia euclidiana entre dos puntos en el espacio tridimensional
def distance_between_points(point1, point2):
    return math.sqrt((point2[0] - point1[0])**2 + 
                     (point2[1] - point1[1])**2 + 
                     (point2[2] - point1[2])**2)

# Mueve el cursor a una posición inicial en la pantalla
pyautogui.moveTo(10, 10)

# Para procesar imágenes estáticas (aunque la lista de archivos está vacía en este caso)
IMAGE_FILES = []
with mp_hands.Hands(
    static_image_mode=True,  # Configuración para procesar imágenes estáticas
    max_num_hands=1,  # Número máximo de manos a detectar en cada imagen
    min_detection_confidence=0.5) as hands:  # Confianza mínima para detectar una mano

    # Recorre cada archivo en IMAGE_FILES
    for idx, file in enumerate(IMAGE_FILES):
        image = cv2.flip(cv2.imread(file), 1)  # Lee y voltea la imagen horizontalmente
        results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))  # Convierte imagen a RGB y procesa

        print('Handedness:', results.multi_handedness)  # Imprime la mano detectada (izquierda o derecha)
        if not results.multi_hand_landmarks:  # Si no hay manos detectadas, pasa a la siguiente imagen
            continue

        # Obtiene el tamaño de la imagen
        image_height, image_width, _ = image.shape
        annotated_image = image.copy()  # Crea una copia de la imagen para anotaciones

        # Recorre los puntos de referencia de cada mano detectada
        for hand_landmarks in results.multi_hand_landmarks:
            print('hand_landmarks:', hand_landmarks)
            print(
                f'Index finger tip coordinates: (',
                f'{hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x * image_width}, '
                f'{hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * image_height})'
            )

            # Dibuja la malla de la mano en la imagen
            mp_drawing.draw_landmarks(
                annotated_image,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style())

        # Guarda la imagen anotada en el sistema de archivos
        cv2.imwrite(
            '/tmp/annotated_image' + str(idx) + '.png', cv2.flip(annotated_image, 1))

        # Dibuja los puntos de referencia de la mano en coordenadas tridimensionales si están disponibles
        if not results.multi_hand_world_landmarks:
            continue
        for hand_world_landmarks in results.multi_hand_world_landmarks:
            mp_drawing.plot_landmarks(
                hand_world_landmarks, mp_hands.HAND_CONNECTIONS, azimuth=5)

# Procesamiento de video desde la cámara en tiempo real
cap = cv2.VideoCapture(0)
with mp_hands.Hands(
    model_complexity=0,  # Reduce la complejidad del modelo para acelerar el procesamiento
    min_detection_confidence=0.5,  # Confianza mínima para detección de manos
    min_tracking_confidence=0.5) as hands:  # Confianza mínima para el seguimiento de puntos

    while cap.isOpened():  # Bucle de captura de video
        success, image = cap.read()  # Lee un fotograma de la cámara
        if not success:  # Si falla la captura, omite este fotograma
            print("Ignoring empty camera frame.")
            continue

        # Marca la imagen como no modificable para optimizar el rendimiento
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convierte el fotograma a RGB
        results = hands.process(image)  # Procesa la imagen para detección de manos

        # Marca la imagen como modificable y convierte de nuevo a BGR para OpenCV
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        if results.multi_hand_landmarks:  # Si se detectan manos, realiza anotaciones
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style())

                # Extrae las coordenadas del pulgar (punto 4) y del índice (punto 8)
                thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
                index_finger_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]

                # Convierte coordenadas normalizadas a píxeles en la imagen
                image_height, image_width, _ = image.shape
                x_pixel = int(index_finger_tip.x * image_width)
                y_pixel = int(index_finger_tip.y * image_height)

                # Calcula la distancia entre el pulgar y el índice en 3D
                distance = distance_between_points(
                    (thumb_tip.x, thumb_tip.y, thumb_tip.z),
                    (index_finger_tip.x, index_finger_tip.y, index_finger_tip.z)
                )

                # Imprime las coordenadas si el pulgar y el índice están cerca (distancia < 0.1)
                if distance < 0.1:
                    print(f"Se están tocando. Coordenadas del círculo morado (punta del índice) -> x: {x_pixel}, y: {y_pixel}")

        # Muestra la imagen procesada en una ventana, volteada horizontalmente
        cv2.imshow('MediaPipe Hands', cv2.flip(image, 1))
        if cv2.waitKey(5) & 0xFF == 27:  # Cierra la ventana si se presiona la tecla Esc
            break

# Libera la cámara y cierra todas las ventanas de OpenCV
cap.release()
cv2.destroyAllWindows()
