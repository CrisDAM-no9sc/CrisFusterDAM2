################## Importación de librerías ##################
import cv2  # Importa la librería OpenCV para procesamiento de imágenes y video
import mediapipe as mp  # Importa MediaPipe para mapeo de malla facial
import pyautogui  # Importa PyAutoGUI para controlar el cursor del ratón.

# Inicializa utilidades y estilos de dibujo para MediaPipe
mp_drawing = mp.solutions.drawing_utils  # Utilidad de dibujo en MediaPipe
mp_drawing_styles = mp.solutions.drawing_styles  # Estilos de dibujo de MediaPipe
mp_face_mesh = mp.solutions.face_mesh  # Inicializa el módulo de malla facial de MediaPipe

############################ Captura de video desde la cámara ###################################

cap = cv2.VideoCapture(0)  # Abre la cámara (ID 0 para la cámara principal)

# Resoluciones de nuestra pantalla
anchura = 1366
altura = 768

centropantallax = round(anchura / 2)
centropantallay = round(altura / 2)

# Resolución del video de la webcam
resolucion_video_x = 640
resolucion_video_y = 480

centrovideox = round(resolucion_video_x / 2)
centrovideoy = round(resolucion_video_y / 2)

sensibilidad = 7  # Prueba con una sensibilidad más baja

###################################### Configuración y uso de malla facial ###############################

with mp_face_mesh.FaceMesh(
    max_num_faces=1,  # Detecta como máximo 1 rostro en el video
    refine_landmarks=True,  # Aumenta la precisión en los puntos clave
    min_detection_confidence=0.5,  # Confianza mínima para detección
    min_tracking_confidence=0.5) as face_mesh:  # Confianza mínima para seguimiento
    
    # Bucle para leer los fotogramas de la cámara hasta que esta se cierre
    while cap.isOpened():
        success, image = cap.read()  # Lee un frame de la cámara
        if not success:
            print("Ignoring empty camera frame.")  # Ignora los frames vacíos
            continue  # Pasa al siguiente frame

        # Para mejorar el rendimiento, marca la imagen como no modificable
        image.flags.writeable = False
        # Convierte la imagen de BGR a RGB, ya que MediaPipe usa RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        # Procesa la imagen para detectar y obtener la malla facial
        results = face_mesh.process(image)

        # Marca la imagen como modificable nuevamente
        image.flags.writeable = True
        # Convierte la imagen de vuelta a BGR para mostrarla con OpenCV
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        ################## Detección de malla facial y anotación ##################

        if results.multi_face_landmarks:  # Si se detecta una malla facial en el frame
            for face_landmarks in results.multi_face_landmarks:
                # Extrae las coordenadas del punto de la nariz
                nose_landmark = face_landmarks.landmark[1]  # Punta de la nariz (índice 1)
                # Obtiene la altura y anchura de la imagen 
                h, w, _ = image.shape 
                
                # Convierte las coordenadas normalizadas a valores de píxeles
                x_nose = int(nose_landmark.x * w)
                y_nose = int(nose_landmark.y * h)

                # Calcular movimiento respecto al centro de la pantalla
                desplazamiento_x = x_nose - centrovideox
                desplazamiento_y = y_nose - centrovideoy

                # Escalar movimiento según resolución y sensibilidad
                movimiento_x = centropantallax + (desplazamiento_x * sensibilidad)
                movimiento_y = centropantallay + (desplazamiento_y * sensibilidad)

                # Limitar el movimiento dentro de los límites de la pantalla con un margen de 20 píxeles
                movimiento_x = max(0, min(anchura, movimiento_x))
                movimiento_y = max(0, min(altura, movimiento_y))

                # Mover el cursor
                pyautogui.moveTo(1366-movimiento_x, movimiento_y)
                
                # Dibuja un círculo en la posición de la nariz
                cv2.circle(image, (x_nose, y_nose), 5, (0, 255, 0), -1)
                
                # Dibuja la malla facial completa en el rostro detectado
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles
                    .get_default_face_mesh_tesselation_style())
        
        # Muestra el frame de video con la malla facial en modo espejo
        cv2.imshow('MediaPipe Face Mesh', cv2.flip(image, 1))
        if cv2.waitKey(5) & 0xFF == 27:  # Cierra la ventana al presionar "Esc"
            break

# Libera la cámara una vez que se cierra el programa
cap.release()  # Libera la cámara al finalizar
cv2.destroyAllWindows()  # Cierra todas las ventanas de OpenCV
