"""
Endpoints para gestión de proyectos
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_admin_user, get_optional_user
from app.schemas.project import (
    ProjectCreate, 
    ProjectUpdate, 
    ProjectResponse, 
    ProjectPublic,
    ProjectStats
)
from app.services.project_service import ProjectService

router = APIRouter()


@router.get("/", response_model=List[ProjectPublic])
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    featured_only: bool = Query(False),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_optional_user)
):
    """Obtener proyectos públicos"""
    project_service = ProjectService(db)
    
    # Solo admin puede ver proyectos no publicados
    include_unpublished = current_user and current_user.is_admin
    
    projects = project_service.get_projects(
        skip=skip,
        limit=limit,
        include_unpublished=include_unpublished,
        featured_only=featured_only,
        search=search
    )
    
    return [ProjectPublic.model_validate(project) for project in projects]


@router.get("/featured", response_model=List[ProjectPublic])
async def get_featured_projects(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Obtener proyectos destacados"""
    project_service = ProjectService(db)
    projects = project_service.get_featured_projects(limit=limit)
    
    return [ProjectPublic.model_validate(project) for project in projects]


@router.get("/stats", response_model=ProjectStats)
async def get_project_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Obtener estadísticas de proyectos (solo admin)"""
    project_service = ProjectService(db)
    stats = project_service.get_project_stats()
    
    return ProjectStats(
        total_projects=stats["total_projects"],
        published_projects=stats["published_projects"],
        featured_projects=stats["featured_projects"],
        total_views=stats["total_views"],
        most_viewed=ProjectPublic.model_validate(stats["most_viewed"]) if stats["most_viewed"] else None
    )


@router.get("/{project_identifier}")
async def get_project(
    project_identifier: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_optional_user)
):
    """Obtener proyecto por ID o slug"""
    project_service = ProjectService(db)
    
    # Intentar obtener por ID primero, luego por slug
    project = None
    if project_identifier.isdigit():
        project = project_service.get_project_by_id(
            int(project_identifier),
            include_unpublished=current_user and current_user.is_admin
        )
    
    if not project:
        project = project_service.get_project_by_slug(
            project_identifier,
            include_unpublished=current_user and current_user.is_admin
        )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    # Incrementar contador de vistas (solo para visitantes públicos)
    if not current_user or not current_user.is_admin:
        project_service.increment_view_count(project.id)
    
    return ProjectPublic.model_validate(project)


@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Crear nuevo proyecto (solo admin)"""
    project_service = ProjectService(db)
    project = project_service.create_project(project_data, current_user)
    
    return ProjectResponse.model_validate(project)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Actualizar proyecto (solo admin)"""
    project_service = ProjectService(db)
    project = project_service.update_project(project_id, project_data, current_user)
    
    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Eliminar proyecto (solo admin)"""
    project_service = ProjectService(db)
    success = project_service.delete_project(project_id, current_user)
    
    return {"message": "Proyecto eliminado correctamente", "success": success}


@router.post("/{project_id}/view")
async def increment_project_views(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Incrementar vistas de un proyecto"""
    project_service = ProjectService(db)
    success = project_service.increment_view_count(project_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    return {"message": "Vista registrada", "success": success}
