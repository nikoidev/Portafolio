"""
Modelo de Configuración Global del Sitio
"""
from sqlalchemy import Column, String, Boolean, Text, JSON
from .base import BaseModel


class Settings(BaseModel):
    """Modelo para configuración global del sitio"""
    __tablename__ = "settings"
    
    # Información del Sitio
    site_name = Column(String(100), nullable=False, default="Mi Portafolio")
    site_description = Column(Text, nullable=True)
    site_logo_url = Column(String(500), nullable=True)
    site_favicon_url = Column(String(500), nullable=True)
    
    # Contacto Global
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    contact_location = Column(String(255), nullable=True)
    contact_availability = Column(String(255), nullable=True)
    
    # Social Links Global (JSON)
    social_links = Column(JSON, nullable=True, default=list)
    # Formato: [{"name": "GitHub", "url": "...", "icon": "...", "enabled": true}]
    
    # SEO y Marketing
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    seo_keywords = Column(Text, nullable=True)
    seo_og_image = Column(String(500), nullable=True)
    google_analytics_id = Column(String(50), nullable=True)
    google_search_console = Column(String(100), nullable=True)
    
    # Apariencia
    theme_mode = Column(String(20), nullable=False, default="auto")  # light, dark, auto
    primary_color = Column(String(20), nullable=True, default="#3B82F6")
    font_family = Column(String(100), nullable=True)
    
    # Avisos y Notificaciones
    maintenance_mode = Column(Boolean, nullable=False, default=False)
    maintenance_message = Column(Text, nullable=True)
    global_banner = Column(Text, nullable=True)
    banner_enabled = Column(Boolean, nullable=False, default=False)
    banner_type = Column(String(20), nullable=True, default="info")  # info, warning, error, success
    
    # Newsletter
    newsletter_enabled = Column(Boolean, nullable=False, default=False)
    newsletter_provider = Column(String(50), nullable=True)
    newsletter_api_key = Column(String(255), nullable=True)
    
    # Integraciones
    facebook_pixel = Column(String(50), nullable=True)
    hotjar_id = Column(String(50), nullable=True)
    
    # Metadata adicional (renombrado porque 'metadata' está reservado)
    extra_config = Column(JSON, nullable=True, default=dict)
    
    def __repr__(self):
        return f"<Settings(site_name={self.site_name})>"
