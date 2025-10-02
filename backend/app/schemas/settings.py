"""
Esquemas Pydantic para Settings
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, HttpUrl
from .base import BaseSchema, TimestampMixin


class SocialLink(BaseModel):
    """Esquema para link social"""
    name: str = Field(..., min_length=1, max_length=50)
    url: str = Field(..., min_length=1)
    icon: str = Field(..., min_length=1)  # URL del icono
    enabled: bool = True


class SettingsBase(BaseSchema):
    """Esquema base para Settings"""
    # Información del Sitio
    site_name: str = Field("Mi Portafolio", min_length=1, max_length=100)
    site_description: Optional[str] = None
    site_logo_url: Optional[str] = None
    site_favicon_url: Optional[str] = None
    
    # Contacto Global
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_location: Optional[str] = None
    contact_availability: Optional[str] = None
    
    # Social Links Global
    social_links: List[SocialLink] = []
    
    # SEO y Marketing
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    seo_og_image: Optional[str] = None
    google_analytics_id: Optional[str] = None
    google_search_console: Optional[str] = None
    
    # Apariencia
    theme_mode: str = Field("auto", pattern="^(light|dark|auto)$")
    primary_color: str = "#3B82F6"
    font_family: Optional[str] = None
    
    # Avisos y Notificaciones
    maintenance_mode: bool = False
    maintenance_message: Optional[str] = None
    global_banner: Optional[str] = None
    banner_enabled: bool = False
    banner_type: str = Field("info", pattern="^(info|warning|error|success)$")
    
    # Newsletter
    newsletter_enabled: bool = False
    newsletter_provider: Optional[str] = None
    newsletter_api_key: Optional[str] = None
    
    # Integraciones
    facebook_pixel: Optional[str] = None
    hotjar_id: Optional[str] = None
    
    # Configuración adicional
    extra_config: Optional[Dict[str, Any]] = {}


class SettingsCreate(SettingsBase):
    """Esquema para crear configuración"""
    pass


class SettingsUpdate(BaseSchema):
    """Esquema para actualizar configuración (todos los campos opcionales)"""
    # Información del Sitio
    site_name: Optional[str] = Field(None, min_length=1, max_length=100)
    site_description: Optional[str] = None
    site_logo_url: Optional[str] = None
    site_favicon_url: Optional[str] = None
    
    # Contacto Global
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_location: Optional[str] = None
    contact_availability: Optional[str] = None
    
    # Social Links Global
    social_links: Optional[List[SocialLink]] = None
    
    # SEO y Marketing
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    seo_og_image: Optional[str] = None
    google_analytics_id: Optional[str] = None
    google_search_console: Optional[str] = None
    
    # Apariencia
    theme_mode: Optional[str] = Field(None, pattern="^(light|dark|auto)$")
    primary_color: Optional[str] = None
    font_family: Optional[str] = None
    
    # Avisos y Notificaciones
    maintenance_mode: Optional[bool] = None
    maintenance_message: Optional[str] = None
    global_banner: Optional[str] = None
    banner_enabled: Optional[bool] = None
    banner_type: Optional[str] = Field(None, pattern="^(info|warning|error|success)$")
    
    # Newsletter
    newsletter_enabled: Optional[bool] = None
    newsletter_provider: Optional[str] = None
    newsletter_api_key: Optional[str] = None
    
    # Integraciones
    facebook_pixel: Optional[str] = None
    hotjar_id: Optional[str] = None
    
    # Configuración adicional
    extra_config: Optional[Dict[str, Any]] = None


class SettingsResponse(SettingsBase, TimestampMixin):
    """Esquema para respuesta de configuración"""
    
    class Config:
        from_attributes = True


class SettingsPublic(BaseSchema):
    """Esquema público de configuración (sin datos sensibles)"""
    # Información del Sitio
    site_name: str
    site_description: Optional[str] = None
    site_logo_url: Optional[str] = None
    site_favicon_url: Optional[str] = None
    
    # Contacto Global (público)
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_location: Optional[str] = None
    contact_availability: Optional[str] = None
    
    # Social Links Global
    social_links: List[SocialLink] = []
    
    # SEO (solo info pública)
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    
    # Apariencia
    theme_mode: str
    primary_color: str
    
    # Avisos públicos
    global_banner: Optional[str] = None
    banner_enabled: bool
    banner_type: str
    maintenance_mode: bool
    maintenance_message: Optional[str] = None
    
    class Config:
        from_attributes = True

