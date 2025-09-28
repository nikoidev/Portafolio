"""
Modelo de Configuración del sitio
"""
from sqlalchemy import Column, String, Text, Boolean, JSON, Integer
from .base import BaseModel


class SiteSettings(BaseModel):
    """Configuración general del sitio"""
    __tablename__ = "site_settings"
    
    # Información del sitio
    site_title = Column(String(200), default="Mi Portafolio", nullable=False)
    site_description = Column(Text, nullable=True)
    site_keywords = Column(String(500), nullable=True)
    
    # Hero section
    hero_title = Column(String(200), nullable=True)
    hero_subtitle = Column(String(500), nullable=True)
    hero_description = Column(Text, nullable=True)
    hero_image_url = Column(String(500), nullable=True)
    hero_background_url = Column(String(500), nullable=True)
    
    # About section
    about_title = Column(String(200), default="Sobre mí", nullable=False)
    about_content = Column(Text, nullable=True)
    about_image_url = Column(String(500), nullable=True)
    
    # Configuración de contacto
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    contact_form_enabled = Column(Boolean, default=True, nullable=False)
    
    # Redes sociales
    social_links = Column(JSON, nullable=True, default=dict)
    # Estructura: {"github": "url", "linkedin": "url", "twitter": "url", ...}
    
    # Configuración de SEO
    seo_meta_title = Column(String(200), nullable=True)
    seo_meta_description = Column(String(500), nullable=True)
    seo_og_image = Column(String(500), nullable=True)
    
    # Configuración del tema
    theme_primary_color = Column(String(20), default="#3B82F6", nullable=False)
    theme_secondary_color = Column(String(20), default="#1E40AF", nullable=False)
    theme_accent_color = Column(String(20), default="#F59E0B", nullable=False)
    dark_mode_enabled = Column(Boolean, default=True, nullable=False)
    
    # Analytics
    google_analytics_id = Column(String(50), nullable=True)
    
    # Configuración de proyectos
    projects_per_page = Column(Integer, default=6, nullable=False)
    show_project_count = Column(Boolean, default=True, nullable=False)
    
    # Footer
    footer_text = Column(Text, nullable=True)
    footer_links = Column(JSON, nullable=True, default=list)
    # Estructura: [{"text": "Política de Privacidad", "url": "/privacy"}]
    
    # Configuración técnica
    maintenance_mode = Column(Boolean, default=False, nullable=False)
    maintenance_message = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<SiteSettings(site_title={self.site_title})>"


class Analytics(BaseModel):
    """Modelo para métricas y analytics básicos"""
    __tablename__ = "analytics"
    
    # Métricas de página
    page_path = Column(String(500), nullable=False)
    page_title = Column(String(200), nullable=True)
    
    # Información del visitante
    visitor_ip = Column(String(45), nullable=True)  # IPv6 compatible
    user_agent = Column(Text, nullable=True)
    referrer = Column(String(500), nullable=True)
    
    # Ubicación (opcional)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    
    # Métricas de tiempo
    session_duration = Column(Integer, nullable=True)  # en segundos
    
    # Información adicional
    device_type = Column(String(50), nullable=True)  # desktop, mobile, tablet
    browser = Column(String(100), nullable=True)
    os = Column(String(100), nullable=True)
    
    def __repr__(self):
        return f"<Analytics(page_path={self.page_path})>"
