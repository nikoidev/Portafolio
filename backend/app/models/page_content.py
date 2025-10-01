"""
Modelo de Contenido de Páginas para el CMS
"""
from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .base import BaseModel


class PageContent(BaseModel):
    """Modelo de contenido de páginas del CMS"""
    __tablename__ = "pages_content"
    
    # Identificación de la página y sección
    page_key = Column(String(100), nullable=False, index=True)  # home, about, projects, contact
    section_key = Column(String(100), nullable=False, index=True)  # hero, features, contact-form
    
    # Información de la sección
    title = Column(String(200), nullable=False)  # Título descriptivo para admin
    description = Column(Text, nullable=True)  # Descripción de qué hace esta sección
    
    # Contenido (estructura JSON flexible)
    content = Column(JSON, nullable=False, default=dict)
    # Ejemplo: {"title": "Hola", "subtitle": "Soy dev", "cta": {"text": "Ver", "url": "/"}}
    
    # Configuración visual
    styles = Column(JSON, nullable=True, default=dict)  # Estilos personalizados
    # Ejemplo: {"background": "gradient", "textColor": "white"}
    
    # Estado
    is_active = Column(Boolean, default=True, nullable=False)
    is_editable = Column(Boolean, default=True, nullable=False)  # Algunas secciones pueden ser no editables
    order_index = Column(Integer, default=0, nullable=False)  # Orden de las secciones
    
    # Metadatos
    version = Column(Integer, default=1, nullable=False)  # Versionado simple
    last_edited_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relaciones
    editor = relationship("User", foreign_keys=[last_edited_by])
    
    def __repr__(self):
        return f"<PageContent(page={self.page_key}, section={self.section_key})>"

