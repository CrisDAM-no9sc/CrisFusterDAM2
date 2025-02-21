##  (o en otro archivo de lógica de negocio): Se utiliza para definir la lógica de negocio, 
##  como por ejemplo la implementación del modelo n-gram, funciones de predicción, etc.
import nltk
from collections import defaultdict, Counter
import string
from models import db, PalabraUsuario
# Descargamos el paquete 'punkt' de NLTK, necesario para la tokenización.
# Esto se ejecuta la primera vez y luego quedará almacenado en la carpeta de datos de NLTK.
nltk.download('punkt')

class NGramModel:
    def __init__(self, n=3):
        """
        Inicializa el modelo n-gram.
        Parámetros:
          n: Tamaño del n-gram, por ejemplo, n=3 para trigramas.
        """
        self.n = n
        # Creamos un diccionario que, para cada contexto (tupla de n-1 palabras),
        # almacena un Counter con las palabras que aparecen a continuación y su frecuencia.
        self.ngrams = defaultdict(Counter)
    
    def train(self, corpus_text):
        """
        Entrena el modelo a partir del texto del corpus.
        Parámetros:
          corpus_text: Cadena con el texto completo (por ejemplo, "El Alquimista").
        """
        # Convertimos el texto a minúsculas y eliminamos la puntuación básica.
        corpus_text = corpus_text.lower().translate(str.maketrans('', '', string.punctuation))
        # Tokenizamos el texto en palabras utilizando NLTK.
        tokens = nltk.word_tokenize(corpus_text)
        
        # Creamos los n-gramas.
        # Por ejemplo, para n=3 (trigramas), usamos dos palabras (contexto) para predecir la tercera.
        for i in range(len(tokens) - self.n + 1):
            # Extraemos el contexto: una tupla de las (n-1) palabras.
            context = tuple(tokens[i:i+self.n-1])
            # La palabra siguiente que queremos predecir.
            next_word = tokens[i+self.n-1]
            # Incrementamos la frecuencia de next_word en ese contexto.
            self.ngrams[context][next_word] += 1
    
    ############ FUNCION PARA PREDECIR LA SIGUIENTE PALABRA ###################
    def predict(self, context, top_k=3):
        """
        Predice las palabras siguientes basándose en el contexto proporcionado.
        Parámetros:
          context: Cadena de texto con el contexto actual.
          top_k: Número máximo de sugerencias a devolver (por defecto 3).
        """
        # Convertimos el contexto a minúsculas y lo dividimos en tokens.
        context = context.lower().split()
        # Si no hay suficientes palabras en el contexto, devolvemos una lista vacía.
        if len(context) < self.n - 1:
            return []
        
        # Solo tomamos las últimas (n-1) palabras del contexto.
        context = tuple(context[-(self.n-1):])
        # Obtenemos el Counter de sugerencias para este contexto.
        suggestions = self.ngrams.get(context, {})
        # Si no hay sugerencias, retornamos una lista vacía.
        if not suggestions:
            return []
        # Ordenamos las sugerencias por frecuencia y devolvemos las top_k palabras.
        sorted_suggestions = suggestions.most_common(top_k)
        return [word for word, count in sorted_suggestions]

################################## Funciones de lógica para personalización  ##################################

def registrar_palabra(usuario_id, palabra):
    try:
        registro = PalabraUsuario.query.filter_by(usuario_id=usuario_id, palabra=palabra).first()
        if registro:
            registro.frecuencia += 1
        else:
            registro = PalabraUsuario(usuario_id=usuario_id, palabra=palabra, frecuencia=1)
            db.session.add(registro)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Error al registrar la palabra:", e)

def obtener_sugerencias_combinadas(context, usuario_id, top_k=3):
    """
    Combina las sugerencias del modelo n-gram con las palabras frecuentes usadas por el usuario.
    
    Parámetros:
      context: Cadena de texto con el contexto actual.
      usuario_id: ID del usuario actual.
      top_k: Número máximo de sugerencias a devolver.
    
    Retorna:
      Una lista de sugerencias combinadas.
    """
    sugerencias_modelo = model.predict(context, top_k=top_k)
    
    tokens = context.lower().split()
    ultimo_termino = tokens[-1] if tokens else ""
    
    palabras_usuario = PalabraUsuario.query.filter(
        PalabraUsuario.usuario_id == usuario_id,
        PalabraUsuario.palabra.ilike(f"{ultimo_termino}%")
    ).order_by(PalabraUsuario.frecuencia.desc()).all()
    palabras_usuario = [p.palabra for p in palabras_usuario]
    
    # Mezcla simple: alternar elementos de ambas listas
    combinadas = []
    i, j = 0, 0
    while len(combinadas) < top_k and (i < len(palabras_usuario) or j < len(sugerencias_modelo)):
        if i < len(palabras_usuario):
            combinadas.append(palabras_usuario[i])
            i += 1
        if len(combinadas) < top_k and j < len(sugerencias_modelo):
            if sugerencias_modelo[j] not in combinadas:
                combinadas.append(sugerencias_modelo[j])
            j += 1
    
    return combinadas       

####### Crear y entrenar la instancia global del modelo #########
with open('corpus.txt', encoding='utf-8') as f:
    corpus = f.read()

model = NGramModel(n=3)
model.train(corpus)

############################ 