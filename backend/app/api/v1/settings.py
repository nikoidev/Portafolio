"""
Endpoints para gestión de configuración global
"""
import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin_user, require_permission
from app.core.config import settings as app_settings
from app.models.enums import Permission
from app.schemas.settings import (
    SettingsCreate, SettingsUpdate, SettingsResponse, SettingsPublic
)
from app.services.settings_service import SettingsService
from app.services.upload_service import UploadService

router = APIRouter()


@router.get("/public", response_model=SettingsPublic)
async def get_public_settings(db: Session = Depends(get_db)):
    """Obtener configuración pública (sin datos sensibles)"""
    settings_service = SettingsService(db)
    settings = settings_service.get_or_create_settings()
    
    return SettingsPublic.model_validate(settings)


@router.get("/admin", response_model=SettingsResponse)
async def get_admin_settings(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener configuración completa (solo admin)"""
    settings_service = SettingsService(db)
    settings = settings_service.get_or_create_settings()
    
    return SettingsResponse.model_validate(settings)


@router.get("/", response_model=SettingsResponse)
async def get_settings(
    db: Session = Depends(get_db),
    current_user = Depends(require_permission(Permission.MANAGE_SETTINGS))
):
    """Obtener configuración completa (admin con permiso manage_settings)"""
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


@router.post("/upload-social-icon")
async def upload_social_icon(
    file: UploadFile = File(...),
    current_user = Depends(require_permission(Permission.MANAGE_SETTINGS))
):
    """
    Upload a social media icon
    
    Args:
        file: Icon file (SVG, PNG, JPG, GIF, WEBP)
        
    Returns:
        Dict with the relative path to the uploaded icon
    """
    # Validate file type
    allowed_extensions = {'.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Validate file size (max 2MB)
    max_size = 2 * 1024 * 1024  # 2MB
    file.file.seek(0, 2)  # Move to end
    file_size = file.file.tell()
    file.file.seek(0)  # Move back to start
    
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 2MB limit"
        )
    
    # Generate unique filename
    upload_service = UploadService()
    icons_folder = upload_service.ensure_icons_folder()
    
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = icons_folder / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Return relative path
    relative_path = f"icons/{unique_filename}"
    
    return {
        "success": True,
        "icon_path": relative_path,
        "filename": unique_filename
    }


@router.delete("/delete-social-icon")
async def delete_social_icon(
    icon_path: str,
    current_user = Depends(require_permission(Permission.MANAGE_SETTINGS))
):
    """
    Delete a social media icon
    
    Args:
        icon_path: Relative path to the icon (e.g., 'icons/filename.svg')
        
    Returns:
        Success message
    """
    upload_service = UploadService()
    success = upload_service.delete_icon(icon_path)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Icon file not found"
        )
    
    return {
        "success": True,
        "message": "Icon deleted successfully"
    }

