"""
Endpoints para gestión del CV
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.deps import get_current_admin_user, get_optional_user
from app.schemas.cv import (
    CVCreate, 
    CVUpdate, 
    CVResponse, 
    CVPublic,
    PDFGenerationRequest,
    PDFResponse
)
from app.services.cv_service import CVService

router = APIRouter()


@router.get("/", response_model=CVResponse)
async def get_cv_data(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener datos del CV (solo admin)"""
    cv_service = CVService(db)
    cv = cv_service.get_cv_by_user(current_user)
    
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV no encontrado"
        )
    
    return CVResponse.model_validate(cv)


@router.get("/public", response_model=CVPublic)
async def get_public_cv(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Obtener CV público (sin datos sensibles)"""
    cv_service = CVService(db)
    cv = cv_service.get_public_cv(user_id)
    
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV no encontrado"
        )
    
    return CVPublic.model_validate(cv)


@router.post("/", response_model=CVResponse)
async def create_or_update_cv(
    cv_data: CVCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Crear o actualizar CV (solo admin)"""
    cv_service = CVService(db)
    cv = cv_service.create_or_update_cv(cv_data, current_user)
    
    return CVResponse.model_validate(cv)


@router.put("/", response_model=CVResponse)
async def update_cv_data(
    cv_data: CVUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Actualizar datos del CV (solo admin)"""
    cv_service = CVService(db)
    existing_cv = cv_service.get_cv_by_user(current_user)
    
    if not existing_cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV no encontrado"
        )
    
    cv = cv_service.update_cv(existing_cv.id, cv_data, current_user)
    return CVResponse.model_validate(cv)


@router.post("/generate-pdf", response_model=PDFResponse)
async def generate_cv_pdf(
    pdf_request: PDFGenerationRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Generar PDF del CV (solo admin)"""
    cv_service = CVService(db)
    
    result = cv_service.generate_pdf(
        current_user,
        template=pdf_request.template,
        color_scheme=pdf_request.color_scheme
    )
    
    return PDFResponse(
        pdf_url=result["pdf_url"],
        generated_at=result["generated_at"],
        message="PDF generado correctamente"
    )


@router.get("/download")
async def download_cv(
    db: Session = Depends(get_db)
):
    """Descargar CV en formato PDF (público)"""
    cv_service = CVService(db)
    
    # Obtener el primer usuario activo (admin principal)
    from app.models.user import User
    admin_user = db.query(User).filter(User.is_active == True).first()
    
    if not admin_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Obtener URL del CV según la fuente configurada
    cv_download_url = cv_service.get_cv_download_url(admin_user)
    
    if not cv_download_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV no disponible para descarga"
        )
    
    # Retornar la URL del CV
    return {
        "download_url": cv_download_url,
        "message": "CV disponible para descarga"
    }


@router.get("/templates")
async def get_cv_templates(db: Session = Depends(get_db)):
    """Obtener plantillas disponibles para CV"""
    cv_service = CVService(db)
    return {"templates": cv_service.get_cv_templates()}


@router.get("/color-schemes")
async def get_color_schemes(db: Session = Depends(get_db)):
    """Obtener esquemas de colores disponibles"""
    cv_service = CVService(db)
    return {"color_schemes": cv_service.get_color_schemes()}


@router.delete("/")
async def delete_cv(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Eliminar CV (solo admin)"""
    cv_service = CVService(db)
    success = cv_service.delete_cv(current_user)
    
    return {"message": "CV eliminado correctamente", "success": success}
