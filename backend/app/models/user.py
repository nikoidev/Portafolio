"""
Modelo de Usuario para el sistema de administración
"""
from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.orm import relationship
from .base import BaseModel


class User(BaseModel):
    """Modelo de Usuario (Admin del portafolio)"""
    __tablename__ = "users"
    
    # Información básica
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Estado del usuario
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=True, nullable=False)  # Por defecto admin
    
    # Información del perfil
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Redes sociales
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    twitter_url = Column(String(255), nullable=True)
    website_url = Column(String(255), nullable=True)
    
    # Relaciones
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    cv_data = relationship("CV", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(email={self.email}, name={self.name})>"
