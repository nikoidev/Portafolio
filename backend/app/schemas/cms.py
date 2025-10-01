"""
Esquemas Pydantic para CMS (Content Management System)
"""
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from .base import BaseSchema, TimestampMixin


class PageContentBase(BaseSchema):
    """Esquema base para PageContent"""
    page_key: str = Field(..., min_length=1, max_length=100)
    section_key: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    content: Dict[str, Any] = Field(default_factory=dict)
    styles: Optional[Dict[str, Any]] = Field(default_factory=dict)
    is_active: bool = True
    is_editable: bool = True
    order_index: int = 0


class PageContentCreate(PageContentBase):
    """Esquema para crear contenido de página"""
    pass


class PageContentUpdate(BaseSchema):
    """Esquema para actualizar contenido de página"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    styles: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    is_editable: Optional[bool] = None
    order_index: Optional[int] = None


class PageContentResponse(PageContentBase, TimestampMixin):
    """Esquema para respuesta de contenido de página"""
    version: int
    last_edited_by: Optional[int] = None
    
    class Config:
        from_attributes = True


class PageSectionPublic(BaseSchema):
    """Esquema público de una sección (sin metadatos sensibles)"""
    section_key: str
    title: str
    content: Dict[str, Any]
    styles: Optional[Dict[str, Any]] = {}
    order_index: int


class PagePublic(BaseSchema):
    """Esquema público de una página completa"""
    page_key: str
    sections: List[PageSectionPublic]


class PageInfo(BaseSchema):
    """Información de páginas disponibles"""
    page_key: str
    label: str
    icon: str
    description: str
    sections_count: int


class CMSStats(BaseSchema):
    """Estadísticas del CMS"""
    total_pages: int
    total_sections: int
    active_sections: int
    editable_sections: int


class ReorderSectionRequest(BaseSchema):
    """Esquema para reordenar secciones"""
    direction: str = Field(..., pattern="^(up|down)$")  # 'up' o 'down'

