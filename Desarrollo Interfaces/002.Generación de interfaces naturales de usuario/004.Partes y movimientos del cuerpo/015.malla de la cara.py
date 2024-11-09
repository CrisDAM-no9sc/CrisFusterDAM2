################## Importación de librerías ##################

import cv2  # Importa la librería OpenCV para procesamiento de imágenes
import mediapipe as mp  # Importa la librería MediaPipe para procesamiento de malla facial

# Inicializa módulos de dibujo y estilos para MediaPipe
mp_drawing = mp.solutions.drawing_utils  # Utilidad para dibujar en MediaPipe
mp_drawing_styles = mp.solutions.drawing_styles  # Estilos de dibujo para MediaPipe
mp_face_mesh = mp.solutions.face_mesh  # Inicializa el módulo de malla facial de MediaPipe

################## Configuración y procesamiento de imágenes estáticas ##################

# Lista de archivos de imagen para procesar
IMAGE_FILES = []
# Define especificaciones de dibujo
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)  # Grosor de línea y radio de puntos

# Inicia el modelo de malla facial para imágenes estáticas
with mp_face_mesh.FaceMesh(
    static_image_mode=True,  # Procesamiento en modo de imagen estática
    max_num_faces=1,  # Máximo de 1 rostro a detectar
    refine_landmarks=True,  # Refinamiento en los puntos clave de la cara
    min_detection_confidence=0.5) as face_mesh:  # Confianza mínima para detección
  for idx, file in enumerate(IMAGE_FILES):  # Recorre cada archivo de imagen
    image = cv2.imread(file)  # Lee la imagen
    # Convierte la imagen de BGR a RGB para procesarla con MediaPipe
    results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    # Verifica si se detectaron puntos de malla facial en la imagen
    if not results.multi_face_landmarks:
      continue  # Si no hay rostros, pasa a la siguiente imagen

    # Copia la imagen para anotarla con puntos de malla facial
    annotated_image = image.copy()
    for face_landmarks in results.multi_face_landmarks:  # Recorre cada rostro detectado
      print('face_landmarks:', face_landmarks)  # Imprime los puntos de malla detectados

      # Dibuja la malla de puntos de la cara (triangulación)
      mp_drawing.draw_landmarks(
          image=annotated_image,
          landmark_list=face_landmarks,
          connections=mp_face_mesh.FACEMESH_TESSELATION,
          landmark_drawing_spec=None,
          connection_drawing_spec=mp_drawing_styles
          .get_default_face_mesh_tesselation_style())
      
      # Dibuja los contornos de la cara
      mp_drawing.draw_landmarks(
          image=annotated_image,
          landmark_list=face_landmarks,
          connections=mp_face_mesh.FACEMESH_CONTOURS,
          landmark_drawing_spec=None,
          connection_drawing_spec=mp_drawing_styles
          .get_default_face_mesh_contours_style())
      
      # Dibuja los puntos del iris
      mp_drawing.draw_landmarks(
          image=annotated_image,
          landmark_list=face_landmarks,
          connections=mp_face_mesh.FACEMESH_IRISES,
          landmark_drawing_spec=None,
          connection_drawing_spec=mp_drawing_styles
          .get_default_face_mesh_iris_connections_style())
    
    # Guarda la imagen anotada en la carpeta temporal
    cv2.imwrite('/tmp/annotated_image' + str(idx) + '.png', annotated_image)

################## Procesamiento en tiempo real con cámara ##################

# Configuración de dibujo para cámara en vivo
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)
cap = cv2.VideoCapture(0)  # Abre la cámara 

# Inicializa el modelo de malla facial para video en tiempo real
with mp_face_mesh.FaceMesh(
    max_num_faces=1,  # Máximo de 1 rostro a detectar
    refine_landmarks=True,  # Refinamiento en los puntos clave
    min_detection_confidence=0.5,  # Confianza mínima de detección
    min_tracking_confidence=0.5) as face_mesh:  # Confianza mínima para seguimiento
  
  # Bucle hasta que se cierre la cámara
  while cap.isOpened():  
    success, image = cap.read()  # Lee un frame de la cámara
    if not success:
      print("Ignoring empty camera frame.")  # Ignora frames vacíos
      continue  # Pasa al siguiente frame

    # Marca la imagen como no modificable para mejorar el rendimiento
    image.flags.writeable = False
    # Convierte la imagen de BGR a RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # Procesa la imagen para detectar la malla facial
    results = face_mesh.process(image)

    # Habilita la imagen para modificarla nuevamente
    image.flags.writeable = True
    # Convierte la imagen de vuelta a BGR para mostrarla en pantalla
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    # Si se detectan puntos de malla en el rostro
    if results.multi_face_landmarks:
      for face_landmarks in results.multi_face_landmarks:

        ######################## Dibuja la malla de puntos de la cara ###########################
        mp_drawing.draw_landmarks(
            image=image,
            landmark_list=face_landmarks,
            connections=mp_face_mesh.FACEMESH_TESSELATION,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles
            .get_default_face_mesh_tesselation_style())
        
        ############################ Dibuja los contornos de la cara ##########################
        mp_drawing.draw_landmarks(
            image=image,
            landmark_list=face_landmarks,
            connections=mp_face_mesh.FACEMESH_CONTOURS,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles
            .get_default_face_mesh_contours_style())
        
        ########################## Dibuja los puntos del iris (ojos) ##############################
        mp_drawing.draw_landmarks(
            image=image,
            landmark_list=face_landmarks,
            connections=mp_face_mesh.FACEMESH_IRISES,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles
            .get_default_face_mesh_iris_connections_style())
    
    ##################### Muestra la imagen con la malla de puntos en pantalla #############################
    # Invierte la imagen para modo espejo
    cv2.imshow('MediaPipe Face Mesh', cv2.flip(image, 1)) 
    # Detiene el bucle al presionar "Esc" 
    if cv2.waitKey(5) & 0xFF == 27:  
      break

cap.release()  # Libera la cámara una vez finalizado el proceso
