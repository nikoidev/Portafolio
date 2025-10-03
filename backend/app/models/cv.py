"""
Modelo de CV/Currículum para el portafolio
"""
from sqlalchemy import Column, String, Text, Integer, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
from .base import BaseModel


class CV(BaseModel):
    """Modelo de CV/Currículum"""
    __tablename__ = "cv"
    
    # Información personal
    full_name = Column(String(200), nullable=False)
    title = Column(String(200), nullable=False)  # ej: "Full Stack Developer"
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    location = Column(String(200), nullable=True)
    
    # Resumen profesional
    summary = Column(Text, nullable=True)
    
    # Experiencia laboral (JSON array)
    work_experience = Column(JSON, nullable=True, default=list)
    # Estructura: [{"company": "", "position": "", "start_date": "", "end_date": "", "description": "", "technologies": []}]
    
    # Educación (JSON array)
    education = Column(JSON, nullable=True, default=list)
    # Estructura: [{"institution": "", "degree": "", "field": "", "start_date": "", "end_date": "", "description": ""}]
    
    # Habilidades técnicas
    technical_skills = Column(JSON, nullable=True, default=list)
    # Estructura: [{"category": "Frontend", "skills": ["React", "Vue", ...]}]
    
    # Idiomas
    languages = Column(JSON, nullable=True, default=list)
    # Estructura: [{"language": "Español", "level": "Nativo"}]
    
    # Certificaciones
    certifications = Column(JSON, nullable=True, default=list)
    # Estructura: [{"name": "", "issuer": "", "date": "", "url": ""}]
    
    # Proyectos destacados (referencias a proyectos)
    featured_projects = Column(JSON, nullable=True, default=list)
    # Array de IDs de proyectos
    
    # Fuente del CV
    cv_source = Column(String(20), default="generated", nullable=False)  # "manual" o "generated"
    
    # CV Manual (subido por el usuario)
    manual_cv_url = Column(String(500), nullable=True)
    
    # Configuración del PDF generado
    pdf_template = Column(String(50), default="modern", nullable=False)
    pdf_color_scheme = Column(String(50), default="blue", nullable=False)
    
    # Archivo PDF generado automáticamente
    pdf_url = Column(String(500), nullable=True)
    pdf_generated_at = Column(Date, nullable=True)
    
    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="cv_data")
    
    def __repr__(self):
        return f"<CV(full_name={self.full_name}, title={self.title})>"
