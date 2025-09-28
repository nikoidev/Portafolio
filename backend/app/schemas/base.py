"""
Esquemas base para Pydantic
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Esquema base con configuración común"""
    model_config = ConfigDict(from_attributes=True)


class TimestampMixin(BaseModel):
    """Mixin para campos de timestamp"""
    id: int
    created_at: datetime
    updated_at: datetime


class ResponseSchema(BaseModel):
    """Esquema para respuestas de la API"""
    message: str
    success: bool = True
    data: Optional[dict] = None


class PaginationSchema(BaseModel):
    """Esquema para paginación"""
    page: int = 1
    size: int = 10
    total: int
    pages: int
    has_next: bool
    has_prev: bool
