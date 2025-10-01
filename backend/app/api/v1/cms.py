"""
Endpoints para el CMS (Content Management System)
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_active_user, require_permission
from app.models.enums import Permission
from app.models.user import User
from app.schemas.cms import (
    PageContentCreate,
    PageContentUpdate,
    PageContentResponse,
    PageSectionPublic,
    PagePublic,
    PageInfo,
    CMSStats,
    ReorderSectionRequest
)
from app.services.cms_service import CMSService

router = APIRouter()


# ========== Endpoints Públicos ==========

@router.get("/pages/{page_key}/public", response_model=PagePublic)
async def get_page_public(
    page_key: str,
    db: Session = Depends(get_db)
):
    """Obtener contenido público de una página (para mostrar en el sitio)"""
    cms_service = CMSService(db)
    sections = cms_service.get_page_sections(page_key, active_only=True)
    
    if not sections:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Página '{page_key}' no encontrada o sin contenido"
        )
    
    sections_public = [
        PageSectionPublic(
            section_key=s.section_key,
            title=s.title,
            content=s.content,
            styles=s.styles or {},
            order_index=s.order_index
        )
        for s in sections
    ]
    
    return PagePublic(page_key=page_key, sections=sections_public)


@router.get("/sections/{page_key}/{section_key}/public", response_model=PageSectionPublic)
async def get_section_public(
    page_key: str,
    section_key: str,
    db: Session = Depends(get_db)
):
    """Obtener contenido público de una sección específica"""
    cms_service = CMSService(db)
    section = cms_service.get_section(page_key, section_key)
    
    if not section or not section.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sección no encontrada"
        )
    
    return PageSectionPublic(
        section_key=section.section_key,
        title=section.title,
        content=section.content,
        styles=section.styles or {},
        order_index=section.order_index
    )


# ========== Endpoints Admin ==========

@router.get("/pages", response_model=List[PageInfo])
async def get_available_pages(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.READ_CONTENT))
):
    """Obtener lista de páginas disponibles (requiere permisos)"""
    cms_service = CMSService(db)
    return cms_service.get_available_pages()


@router.get("/pages/{page_key}/sections", response_model=List[PageContentResponse])
async def get_page_sections_admin(
    page_key: str,
    active_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.READ_CONTENT))
):
    """Obtener todas las secciones de una página (admin)"""
    cms_service = CMSService(db)
    sections = cms_service.get_page_sections(page_key, active_only)
    
    return [PageContentResponse.model_validate(s) for s in sections]


@router.get("/sections/{page_key}/{section_key}", response_model=PageContentResponse)
async def get_section_admin(
    page_key: str,
    section_key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.READ_CONTENT))
):
    """Obtener detalles de una sección específica (admin)"""
    cms_service = CMSService(db)
    section = cms_service.get_section(page_key, section_key)
    
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sección no encontrada"
        )
    
    return PageContentResponse.model_validate(section)


@router.post("/sections", response_model=PageContentResponse, status_code=status.HTTP_201_CREATED)
async def create_section(
    section_data: PageContentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.CREATE_CONTENT))
):
    """Crear una nueva sección (requiere permisos de creación)"""
    cms_service = CMSService(db)
    section = cms_service.create_section(section_data, current_user)
    
    return PageContentResponse.model_validate(section)


@router.put("/sections/{page_key}/{section_key}", response_model=PageContentResponse)
async def update_section(
    page_key: str,
    section_key: str,
    section_data: PageContentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.UPDATE_CONTENT))
):
    """Actualizar una sección existente (requiere permisos de edición)"""
    cms_service = CMSService(db)
    section = cms_service.update_section(page_key, section_key, section_data, current_user)
    
    return PageContentResponse.model_validate(section)


@router.delete("/sections/{page_key}/{section_key}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_section(
    page_key: str,
    section_key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.DELETE_CONTENT))
):
    """Eliminar una sección (requiere permisos de eliminación)"""
    cms_service = CMSService(db)
    cms_service.delete_section(page_key, section_key)
    
    return None


@router.get("/stats", response_model=CMSStats)
async def get_cms_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.READ_CONTENT))
):
    """Obtener estadísticas del CMS"""
    cms_service = CMSService(db)
    stats = cms_service.get_stats()
    
    return CMSStats(**stats)


@router.post("/seed", response_model=List[PageContentResponse])
async def seed_default_content(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.CREATE_CONTENT))
):
    """Crear contenido inicial por defecto (solo una vez)"""
    cms_service = CMSService(db)
    sections = cms_service.seed_default_content()
    
    return [PageContentResponse.model_validate(s) for s in sections]


@router.patch("/sections/{page_key}/{section_key}/reorder", response_model=PageContentResponse)
async def reorder_section(
    page_key: str,
    section_key: str,
    reorder_data: ReorderSectionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.UPDATE_CONTENT))
):
    """Reordenar una sección (mover arriba o abajo)"""
    cms_service = CMSService(db)
    section = cms_service.reorder_section(page_key, section_key, reorder_data.direction)
    
    return PageContentResponse.model_validate(section)

