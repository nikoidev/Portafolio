"""
Esquemas Pydantic para Project
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, field_serializer, ConfigDict
from .base import BaseSchema, TimestampMixin


class ProjectBase(BaseSchema):
    """Esquema base para Project"""
    title: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    short_description: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = None
    github_url: Optional[str] = None
    
    # DEMO CONFIGURATION
    # VIDEO DEMO
    demo_video_type: Optional[str] = None  # 'youtube' o 'local'
    demo_video_url: Optional[str] = None
    demo_video_thumbnail: Optional[str] = None
    
    # GALLERY DEMO (screenshots)
    demo_images: Optional[List[dict]] = []  # [{"url": "...", "title": "...", "order": 1}]
    
    # Archivos y medios
    thumbnail_url: Optional[str] = None
    images: Optional[List[str]] = []  # Legacy
    demo_files: Optional[List[dict]] = []  # Legacy
    
    technologies: List[dict] = []  # [{"name": "Python", "icon": "https://...", "enabled": true}]
    tags: Optional[List[str]] = []
    is_featured: bool = False
    is_published: bool = True
    order_index: int = 0


class ProjectCreate(ProjectBase):
    """Esquema para crear proyecto"""
    pass


class ProjectUpdate(BaseSchema):
    """Esquema para actualizar proyecto"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    slug: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    short_description: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = None
    github_url: Optional[str] = None
    
    # DEMO CONFIGURATION
    # VIDEO DEMO
    demo_video_type: Optional[str] = None
    demo_video_url: Optional[str] = None
    demo_video_thumbnail: Optional[str] = None
    
    # GALLERY DEMO
    demo_images: Optional[List[dict]] = []
    
    # Archivos y medios
    thumbnail_url: Optional[str] = None
    images: Optional[List[str]] = None
    demo_files: Optional[List[dict]] = None
    
    technologies: Optional[List[dict]] = None  # [{"name": "Python", "icon": "https://...", "enabled": true}]
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    order_index: Optional[int] = None


class ProjectResponse(ProjectBase, TimestampMixin):
    """Esquema para respuesta de proyecto"""
    view_count: int
    owner_id: int


class ProjectPublic(BaseSchema):
    """Esquema público de proyecto (sin datos sensibles)"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    slug: str
    description: str
    short_description: Optional[str] = None
    content: Optional[str] = None
    github_url: Optional[str] = None
    
    # DEMO CONFIGURATION
    # VIDEO DEMO
    demo_video_type: Optional[str] = None
    demo_video_url: Optional[str] = None
    demo_video_thumbnail: Optional[str] = None
    
    # GALLERY DEMO
    demo_images: Optional[List[dict]] = []
    
    # Archivos y medios
    thumbnail_url: Optional[str] = None
    images: Optional[List[str]] = None
    
    technologies: List[dict]  # [{"name": "Python", "icon": "https://...", "enabled": true}]
    tags: Optional[List[str]] = None
    is_featured: bool
    is_published: bool
    view_count: int
    created_at: datetime
    
    @field_serializer('created_at')
    def serialize_created_at(self, value: datetime) -> str:
        """Convertir datetime a string ISO para el frontend"""
        return value.isoformat() if value else None


class ProjectList(BaseSchema):
    """Esquema para lista de proyectos"""
    projects: List[ProjectPublic]
    total: int
    page: int
    size: int
    pages: int


class ProjectStats(BaseSchema):
    """Esquema para estadísticas de proyectos"""
    total_projects: int
    published_projects: int
    featured_projects: int
    total_views: int
    most_viewed: Optional[ProjectPublic] = None
