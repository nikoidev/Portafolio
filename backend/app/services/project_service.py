"""
Servicio para gestión de proyectos
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from fastapi import HTTPException, status
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectPublic
from app.services.upload_service import UploadService
from slugify import slugify


class ProjectService:
    """Servicio para manejo de proyectos"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_project(self, project_data: ProjectCreate, owner: User) -> Project:
        """Crear nuevo proyecto"""
        # Generar slug único si no se proporciona
        if not project_data.slug:
            base_slug = slugify(project_data.title)
            project_data.slug = self._generate_unique_slug(base_slug)
        else:
            # Verificar que el slug sea único
            existing = self.db.query(Project).filter(Project.slug == project_data.slug).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El slug ya existe"
                )
        
        db_project = Project(
            **project_data.model_dump(),
            owner_id=owner.id
        )
        
        self.db.add(db_project)
        self.db.commit()
        self.db.refresh(db_project)
        
        return db_project
    
    def get_project_by_id(self, project_id: int, include_unpublished: bool = False) -> Optional[Project]:
        """Obtener proyecto por ID"""
        query = self.db.query(Project).filter(Project.id == project_id)
        
        if not include_unpublished:
            query = query.filter(Project.is_published == True)
        
        return query.first()
    
    def get_project_by_slug(self, slug: str, include_unpublished: bool = False) -> Optional[Project]:
        """Obtener proyecto por slug"""
        query = self.db.query(Project).filter(Project.slug == slug)
        
        if not include_unpublished:
            query = query.filter(Project.is_published == True)
        
        return query.first()
    
    def get_projects(
        self, 
        skip: int = 0, 
        limit: int = 10,
        include_unpublished: bool = False,
        featured_only: bool = False,
        search: Optional[str] = None
    ) -> List[Project]:
        """Obtener lista de proyectos"""
        query = self.db.query(Project)
        
        # Filtros
        if not include_unpublished:
            query = query.filter(Project.is_published == True)
        
        if featured_only:
            query = query.filter(Project.is_featured == True)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                Project.title.ilike(search_term) |
                Project.description.ilike(search_term) |
                Project.technologies.astext.ilike(search_term)
            )
        
        # Ordenar por order_index y fecha
        query = query.order_by(desc(Project.order_index), desc(Project.created_at))
        
        return query.offset(skip).limit(limit).all()
    
    def update_project(self, project_id: int, project_data: ProjectUpdate, owner: User) -> Project:
        """Actualizar proyecto"""
        project = self.db.query(Project).filter(
            Project.id == project_id,
            Project.owner_id == owner.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        # Actualizar campos
        update_data = project_data.model_dump(exclude_unset=True)
        
        # Verificar slug único si se actualiza
        if "slug" in update_data and update_data["slug"] != project.slug:
            existing = self.db.query(Project).filter(
                Project.slug == update_data["slug"],
                Project.id != project_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El slug ya existe"
                )
        
        for field, value in update_data.items():
            setattr(project, field, value)
        
        self.db.commit()
        self.db.refresh(project)
        
        return project
    
    def delete_project(self, project_id: int, owner: User) -> bool:
        """Eliminar proyecto y toda su carpeta de archivos"""
        project = self.db.query(Project).filter(
            Project.id == project_id,
            Project.owner_id == owner.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        # Eliminar toda la carpeta del proyecto (usando ID)
        upload_service = UploadService()
        deleted = upload_service.delete_project_folder(project.id)
        
        if deleted:
            print(f"Carpeta completa del proyecto ID {project.id} eliminada")
        else:
            print(f"No se encontró carpeta para el proyecto ID {project.id}")
        
        # Eliminar proyecto de la base de datos
        self.db.delete(project)
        self.db.commit()
        
        return True
    
    def increment_view_count(self, project_id: int) -> bool:
        """Incrementar contador de vistas"""
        project = self.db.query(Project).filter(Project.id == project_id).first()
        if project:
            project.view_count += 1
            self.db.commit()
            return True
        return False
    
    def get_featured_projects(self, limit: int = 6) -> List[Project]:
        """Obtener proyectos destacados"""
        return self.db.query(Project).filter(
            Project.is_published == True,
            Project.is_featured == True
        ).order_by(desc(Project.order_index), desc(Project.created_at)).limit(limit).all()
    
    def get_project_stats(self) -> dict:
        """Obtener estadísticas de proyectos"""
        total_projects = self.db.query(Project).count()
        published_projects = self.db.query(Project).filter(Project.is_published == True).count()
        featured_projects = self.db.query(Project).filter(Project.is_featured == True).count()
        
        # Proyecto más visto
        most_viewed = self.db.query(Project).filter(
            Project.is_published == True
        ).order_by(desc(Project.view_count)).first()
        
        # Total de vistas
        total_views = self.db.query(Project).with_entities(
            Project.view_count
        ).filter(Project.is_published == True).all()
        total_views = sum([v[0] for v in total_views])
        
        return {
            "total_projects": total_projects,
            "published_projects": published_projects,
            "featured_projects": featured_projects,
            "total_views": total_views,
            "most_viewed": most_viewed
        }
    
    def _generate_unique_slug(self, base_slug: str) -> str:
        """Generar slug único"""
        slug = base_slug
        counter = 1
        
        while self.db.query(Project).filter(Project.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        return slug
