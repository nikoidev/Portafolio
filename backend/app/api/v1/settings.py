"""
Endpoints para gestión de configuración global
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin_user, require_permission
from app.models.enums import Permission
from app.schemas.settings import (
    SettingsCreate, SettingsUpdate, SettingsResponse, SettingsPublic
)
from app.services.settings_service import SettingsService

router = APIRouter()


@router.get("/public", response_model=SettingsPublic)
async def get_public_settings(db: Session = Depends(get_db)):
    """Obtener configuración pública (sin datos sensibles)"""
    settings_service = SettingsService(db)
    settings = settings_service.get_or_create_settings()
    
    return SettingsPublic.model_validate(settings)


@router.get("/", response_model=SettingsResponse)
async def get_settings(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener configuración completa (solo admin)"""
    settings_service = SettingsService(db)
    settings = settings_service.get_or_create_settings()
    
    return SettingsResponse.model_validate(settings)


@router.post("/", response_model=SettingsResponse, status_code=status.HTTP_201_CREATED)
async def create_settings(
    settings_data: SettingsCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission(Permission.MANAGE_SETTINGS))
):
    """Crear configuración inicial (solo si no existe)"""
    settings_service = SettingsService(db)
    settings = settings_service.create_settings(settings_data)
    
    return SettingsResponse.model_validate(settings)


@router.put("/", response_model=SettingsResponse)
async def update_settings(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission(Permission.MANAGE_SETTINGS))
):
    """Actualizar configuración global"""
    settings_service = SettingsService(db)
    settings = settings_service.update_settings(settings_data)
    
    return SettingsResponse.model_validate(settings)


@router.post("/reset", response_model=SettingsResponse)
async def reset_settings(
    db: Session = Depends(get_db),
    current_user = Depends(require_permission(Permission.MANAGE_SETTINGS))
):
    """Resetear configuración a valores por defecto"""
    settings_service = SettingsService(db)
    settings = settings_service.reset_to_defaults()
    
    return SettingsResponse.model_validate(settings)


@router.delete("/")
async def delete_settings(
    db: Session = Depends(get_db),
    current_user = Depends(require_permission(Permission.MANAGE_SETTINGS))
):
    """Eliminar configuración (usar con precaución)"""
    settings_service = SettingsService(db)
    result = settings_service.delete_settings()
    
    return result

