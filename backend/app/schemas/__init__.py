# Pydantic schemas
from .base import BaseSchema, TimestampMixin, ResponseSchema, PaginationSchema
from .user import (
    UserBase, UserCreate, UserUpdate, UserResponse, 
    UserLogin, UserProfile, Token, TokenData
)
from .project import (
    ProjectBase, ProjectCreate, ProjectUpdate, ProjectResponse,
    ProjectPublic, ProjectList, ProjectStats
)
from .cv import (
    CVBase, CVCreate, CVUpdate, CVResponse, CVPublic,
    WorkExperience, Education, TechnicalSkill, Language, Certification,
    PDFGenerationRequest, PDFResponse
)

# Exportar todos los esquemas
__all__ = [
    # Base
    "BaseSchema", "TimestampMixin", "ResponseSchema", "PaginationSchema",
    
    # User
    "UserBase", "UserCreate", "UserUpdate", "UserResponse", 
    "UserLogin", "UserProfile", "Token", "TokenData",
    
    # Project
    "ProjectBase", "ProjectCreate", "ProjectUpdate", "ProjectResponse",
    "ProjectPublic", "ProjectList", "ProjectStats",
    
    # CV
    "CVBase", "CVCreate", "CVUpdate", "CVResponse", "CVPublic",
    "WorkExperience", "Education", "TechnicalSkill", "Language", "Certification",
    "PDFGenerationRequest", "PDFResponse"
]
