import cv2
import mediapipe as mp
import pyautogui
import numpy as np

# Configuración de MediaPipe y PyAutoGUI
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh
# Desactivar el modo fail-safe para evitar que el cursor se mueva a la esquina si se sale de la pantalla

pyautogui.FAILSAFE = False  
################################ DEFINICION DE RESOLUCION DE PANTALLA Y SENSIBILIDAD #######################################

anchura = 1366
altura = 768
centropantallax = round(anchura / 2)
centropantallay = round(altura / 2)
resolucion_video_x = 640
resolucion_video_y = 480
centrovideox = round(resolucion_video_x / 2)
centrovideoy = round(resolucion_video_y / 2)
# Sensibilidad para el movimiento del cursor
sensibilidad = 5  

###################################### Parámetros para la detección de parpadeos  ###########################################
# Umbral para el parpadeo (cuanto menor, más sensible)
EAR_UMBRAL = 0.2  
# Número de parpadeos consecutivos para registrar un clic
CONSECUTIVO_PARPADEROS = 2  
contador_parpadeo = 0

# Índices de los puntos clave del ojo derecho para el cálculo de EAR
eye_right_indices = [33, 160, 158, 133, 153, 144]

######################################### CALCULO DEL EAR ###################################################################
def calcular_ear(ojo):
    A = np.linalg.norm(np.array([ojo[1].x, ojo[1].y]) - np.array([ojo[5].x, ojo[5].y]))
    B = np.linalg.norm(np.array([ojo[2].x, ojo[2].y]) - np.array([ojo[4].x, ojo[4].y]))
    C = np.linalg.norm(np.array([ojo[0].x, ojo[0].y]) - np.array([ojo[3].x, ojo[3].y]))
    ear = (A + B) / (2.0 * C)
    return ear

######################################## CAPTURA DE VIDEO Y PROCESAMIENTO DE LA IMAGEN ######################################
cap = cv2.VideoCapture(0)
with mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as face_mesh:
    ##########################################    PROCESAMIENTO DEL VIDEO     ##############################################
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        ############################ Convertir la imagen a RGB para MediaPipe ################################
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(image)

        # Convertir de nuevo la imagen a BGR para OpenCV
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        ##################################### DETECCION E LA NARIZ Y MOVIMIEBNO DEL CURSOR ########################

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Obtener las coordenadas del punto de la nariz (para el movimiento del cursor)
                nose_landmark = face_landmarks.landmark[1]
                h, w, _ = image.shape
                x_nose = int(nose_landmark.x * w)
                y_nose = int(nose_landmark.y * h)

                # Calcular el desplazamiento del cursor con respecto al centro de la pantalla
                desplazamiento_x = x_nose - centrovideox
                desplazamiento_y = y_nose - centrovideoy
                movimiento_x = centropantallax + (desplazamiento_x * sensibilidad)
                movimiento_y = centropantallay + (desplazamiento_y * sensibilidad)
                
                # Asegurar que el cursor esté dentro de los límites de la pantalla
                movimiento_x = max(10, min(anchura - 10, movimiento_x))
                movimiento_y = max(10, min(altura - 10, movimiento_y))

                ################################# MOVER EL CURSOR Y HACER CLICK ################################
                # Mover el cursor suavemente
                pyautogui.moveTo(movimiento_x, movimiento_y, duration=0.1)

                # Dibujar un círculo en la posición de la nariz
                cv2.circle(image, (x_nose, y_nose), 5, (0, 255, 0), -1)

                # Calcular el EAR para detectar parpadeo
                ojo_derecho = [face_landmarks.landmark[i] for i in eye_right_indices]
                ear_derecho = calcular_ear(ojo_derecho)
                
                print(f"EAR actual: {ear_derecho}, Contador de parpadeo: {contador_parpadeo}")

                ###################### Detección de guiño (parpadeo) ####################################
                if ear_derecho < EAR_UMBRAL:
                    contador_parpadeo += 1
                else:
                    # Si el número de parpadeos consecutivos es suficiente, hacer clic
                    if contador_parpadeo >= CONSECUTIVO_PARPADEROS:
                         # Confirmación en consola
                        print("Clic ejecutado") 
                        # Realizar el clic
                        pyautogui.click()  
                    # Resetear el contador de parpadeos
                    contador_parpadeo = 0
                
                # Dibujar los landmarks del rostro
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles
                    .get_default_face_mesh_tesselation_style())
        

        #######################################   MOSTRAR LA IMAGEN Y CONTROLAR LA SALIDA #################################        
        # Mostrar la imagen procesada con efecto espejo
        cv2.imshow('MediaPipe Face Mesh', cv2.flip(image, 1))
        
        # Salir del bucle si se presiona la tecla ESC
        if cv2.waitKey(5) & 0xFF == 27:
            break
            
# Liberar la cámara y cerrar las ventanas
cap.release()
cv2.destroyAllWindows()
