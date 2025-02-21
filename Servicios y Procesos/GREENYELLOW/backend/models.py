# backend/models.py
# Modelos de la base de datos (Usuario, Feedback, etc.)
## Se encarga de definir los modelos de la base de datos, es decir, las tablas, sus campos y relaciones.
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Usuario(UserMixin, db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    contexto = db.Column(db.Text, nullable=False)
    palabra_aceptada = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    
    usuario = db.relationship('Usuario', backref=db.backref('feedbacks', lazy=True))

# Ejemplo de modelo para registrar palabras frecuentes por usuario:
class PalabraUsuario(db.Model):
    __tablename__ = 'palabras_usuario'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    palabra = db.Column(db.String(100), nullable=False)
    frecuencia = db.Column(db.Integer, default=1)
    usuario = db.relationship('Usuario', backref=db.backref('palabras', lazy=True))

