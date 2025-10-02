"""
Modelo de Proyecto para el portafolio
"""
from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .base import BaseModel


class Project(BaseModel):
    """Modelo de Proyecto del portafolio"""
    __tablename__ = "projects"
    
    # Información básica
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    short_description = Column(String(500), nullable=True)
    
    # Contenido
    content = Column(Text, nullable=True)  # Descripción detallada en markdown
    
    # URLs y enlaces
    github_url = Column(String(500), nullable=True)
    
    # DEMO CONFIGURATION
    # VIDEO DEMO
    demo_video_type = Column(String(20), nullable=True)  # 'youtube', 'local', null
    demo_video_url = Column(String(500), nullable=True)  # YouTube URL o ruta local (/uploads/videos/...)
    demo_video_thumbnail = Column(String(500), nullable=True)  # Thumbnail personalizado
    
    # GALLERY DEMO (screenshots del proyecto)
    demo_images = Column(JSON, nullable=True)  # [{"url": "...", "title": "...", "order": 1}]
    
    # Archivos y medios
    thumbnail_url = Column(String(500), nullable=True)
    images = Column(JSON, nullable=True)  # Array de URLs de imágenes (legacy)
    demo_files = Column(JSON, nullable=True)  # Archivos del demo (legacy)
    
    # Tecnologías y tags
    technologies = Column(JSON, nullable=False, default=list)  # Array de objetos: [{"name": "Python", "icon": "https://...", "enabled": true}]
    tags = Column(JSON, nullable=True, default=list)  # Tags adicionales
    
    # Configuración
    is_featured = Column(Boolean, default=False, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    order_index = Column(Integer, default=0, nullable=False)  # Para ordenar proyectos
    
    # Métricas
    view_count = Column(Integer, default=0, nullable=False)
    
    # Relaciones
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="projects")
    
    def __repr__(self):
        return f"<Project(title={self.title}, slug={self.slug})>"
