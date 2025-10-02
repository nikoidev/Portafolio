"""
Servicio para gestión de configuración global
"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.settings import Settings
from app.schemas.settings import SettingsCreate, SettingsUpdate


class SettingsService:
    """Servicio para gestionar configuración global del sitio"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_settings(self) -> Optional[Settings]:
        """
        Obtener configuración global (solo existe un registro)
        """
        return self.db.query(Settings).first()
    
    def get_or_create_settings(self) -> Settings:
        """
        Obtener configuración o crear una por defecto si no existe
        """
        settings = self.get_settings()
        
        if not settings:
            # Crear configuración por defecto
            default_settings = SettingsCreate(
                site_name="Mi Portafolio",
                site_description="Portafolio personal de desarrollo web",
                theme_mode="auto",
                primary_color="#3B82F6",
                social_links=[],
                maintenance_mode=False,
                banner_enabled=False,
                newsletter_enabled=False
            )
            settings = Settings(**default_settings.model_dump())
            self.db.add(settings)
            self.db.commit()
            self.db.refresh(settings)
        
        return settings
    
    def create_settings(self, settings_data: SettingsCreate) -> Settings:
        """
        Crear configuración inicial (solo si no existe)
        """
        existing_settings = self.get_settings()
        
        if existing_settings:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La configuración ya existe. Use el endpoint de actualización."
            )
        
        settings = Settings(**settings_data.model_dump())
        self.db.add(settings)
        self.db.commit()
        self.db.refresh(settings)
        
        return settings
    
    def update_settings(self, settings_data: SettingsUpdate) -> Settings:
        """
        Actualizar configuración global
        """
        settings = self.get_or_create_settings()
        
        # Actualizar solo los campos proporcionados
        update_data = settings_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        
        self.db.commit()
        self.db.refresh(settings)
        
        return settings
    
    def delete_settings(self) -> dict:
        """
        Eliminar configuración (raro que se use, pero por completitud)
        """
        settings = self.get_settings()
        
        if not settings:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No existe configuración para eliminar"
            )
        
        self.db.delete(settings)
        self.db.commit()
        
        return {"message": "Configuración eliminada correctamente"}
    
    def reset_to_defaults(self) -> Settings:
        """
        Resetear configuración a valores por defecto
        """
        settings = self.get_or_create_settings()
        
        # Resetear a valores por defecto
        default_settings = SettingsCreate(
            site_name="Mi Portafolio",
            site_description="Portafolio personal de desarrollo web",
            theme_mode="auto",
            primary_color="#3B82F6",
            social_links=[],
            maintenance_mode=False,
            banner_enabled=False,
            newsletter_enabled=False
        )
        
        for field, value in default_settings.model_dump().items():
            setattr(settings, field, value)
        
        self.db.commit()
        self.db.refresh(settings)
        
        return settings

