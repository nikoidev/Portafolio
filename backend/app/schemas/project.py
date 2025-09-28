"""
Esquemas Pydantic para Project
"""
from typing import Optional, List
from pydantic import BaseModel, Field, HttpUrl
from .base import BaseSchema, TimestampMixin


class ProjectBase(BaseSchema):
    """Esquema base para Project"""
    title: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    short_description: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    demo_type: Optional[str] = Field(None, pattern="^(iframe|link|video|images)$")
    thumbnail_url: Optional[str] = None
    images: Optional[List[str]] = []
    demo_files: Optional[List[dict]] = []
    technologies: List[str] = []
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
    live_demo_url: Optional[str] = None
    demo_type: Optional[str] = Field(None, pattern="^(iframe|link|video|images)$")
    thumbnail_url: Optional[str] = None
    images: Optional[List[str]] = None
    demo_files: Optional[List[dict]] = None
    technologies: Optional[List[str]] = None
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
    id: int
    title: str
    slug: str
    description: str
    short_description: Optional[str]
    content: Optional[str]
    github_url: Optional[str]
    live_demo_url: Optional[str]
    demo_type: Optional[str]
    thumbnail_url: Optional[str]
    images: Optional[List[str]]
    technologies: List[str]
    tags: Optional[List[str]]
    is_featured: bool
    view_count: int
    created_at: str  # Como string para el frontend


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
