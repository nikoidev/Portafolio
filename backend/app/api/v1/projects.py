"""
Endpoints para gestión de proyectos
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db

router = APIRouter()


@router.get("/")
async def get_projects(db: Session = Depends(get_db)):
    """Obtener todos los proyectos públicos"""
    # TODO: Implementar obtención de proyectos
    return {"projects": []}


@router.get("/{project_id}")
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Obtener un proyecto específico"""
    # TODO: Implementar obtención de proyecto por ID
    return {"project": f"project_{project_id}"}


@router.post("/")
async def create_project(db: Session = Depends(get_db)):
    """Crear nuevo proyecto (requiere autenticación)"""
    # TODO: Implementar creación de proyecto
    return {"message": "Project created successfully"}


@router.put("/{project_id}")
async def update_project(project_id: int, db: Session = Depends(get_db)):
    """Actualizar proyecto existente"""
    # TODO: Implementar actualización de proyecto
    return {"message": f"Project {project_id} updated successfully"}


@router.delete("/{project_id}")
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Eliminar proyecto"""
    # TODO: Implementar eliminación de proyecto
    return {"message": f"Project {project_id} deleted successfully"}


@router.post("/{project_id}/demo")
async def upload_demo(
    project_id: int, 
    demo_file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    """Subir demo para un proyecto"""
    # TODO: Implementar subida de demo
    return {"message": f"Demo uploaded for project {project_id}"}
