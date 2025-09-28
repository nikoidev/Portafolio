"""
Esquemas Pydantic para CV
"""
from typing import Optional, List, Dict, Any
from datetime import date
from pydantic import BaseModel, Field, EmailStr
from .base import BaseSchema, TimestampMixin


class WorkExperience(BaseModel):
    """Esquema para experiencia laboral"""
    company: str = Field(..., min_length=1, max_length=200)
    position: str = Field(..., min_length=1, max_length=200)
    start_date: str = Field(..., description="Fecha en formato YYYY-MM o YYYY-MM-DD")
    end_date: Optional[str] = Field(None, description="Fecha fin o 'Actualidad'")
    description: Optional[str] = None
    technologies: List[str] = []
    location: Optional[str] = None


class Education(BaseModel):
    """Esquema para educación"""
    institution: str = Field(..., min_length=1, max_length=200)
    degree: str = Field(..., min_length=1, max_length=200)
    field: Optional[str] = Field(None, max_length=200)
    start_date: str = Field(..., description="Fecha en formato YYYY-MM o YYYY-MM-DD")
    end_date: Optional[str] = Field(None, description="Fecha fin o 'Actualidad'")
    description: Optional[str] = None
    gpa: Optional[str] = None


class TechnicalSkill(BaseModel):
    """Esquema para habilidades técnicas"""
    category: str = Field(..., min_length=1, max_length=100)
    skills: List[str] = Field(..., min_items=1)
    level: Optional[str] = Field(None, description="Beginner, Intermediate, Advanced, Expert")


class Language(BaseModel):
    """Esquema para idiomas"""
    language: str = Field(..., min_length=1, max_length=100)
    level: str = Field(..., min_length=1, max_length=100)
    certification: Optional[str] = None


class Certification(BaseModel):
    """Esquema para certificaciones"""
    name: str = Field(..., min_length=1, max_length=200)
    issuer: str = Field(..., min_length=1, max_length=200)
    date: str = Field(..., description="Fecha en formato YYYY-MM")
    expiry_date: Optional[str] = Field(None, description="Fecha de expiración")
    url: Optional[str] = None
    credential_id: Optional[str] = None


class CVBase(BaseSchema):
    """Esquema base para CV"""
    full_name: str = Field(..., min_length=1, max_length=200)
    title: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=200)
    summary: Optional[str] = None
    work_experience: List[WorkExperience] = []
    education: List[Education] = []
    technical_skills: List[TechnicalSkill] = []
    languages: List[Language] = []
    certifications: List[Certification] = []
    featured_projects: List[int] = []  # IDs de proyectos
    pdf_template: str = Field("modern", max_length=50)
    pdf_color_scheme: str = Field("blue", max_length=50)


class CVCreate(CVBase):
    """Esquema para crear CV"""
    pass


class CVUpdate(BaseSchema):
    """Esquema para actualizar CV"""
    full_name: Optional[str] = Field(None, min_length=1, max_length=200)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=200)
    summary: Optional[str] = None
    work_experience: Optional[List[WorkExperience]] = None
    education: Optional[List[Education]] = None
    technical_skills: Optional[List[TechnicalSkill]] = None
    languages: Optional[List[Language]] = None
    certifications: Optional[List[Certification]] = None
    featured_projects: Optional[List[int]] = None
    pdf_template: Optional[str] = Field(None, max_length=50)
    pdf_color_scheme: Optional[str] = Field(None, max_length=50)


class CVResponse(CVBase, TimestampMixin):
    """Esquema para respuesta de CV"""
    user_id: int
    pdf_url: Optional[str] = None
    pdf_generated_at: Optional[date] = None


class CVPublic(BaseSchema):
    """Esquema público de CV (sin datos sensibles)"""
    full_name: str
    title: str
    location: Optional[str]
    summary: Optional[str]
    work_experience: List[WorkExperience]
    education: List[Education]
    technical_skills: List[TechnicalSkill]
    languages: List[Language]
    certifications: List[Certification]
    # No incluir email, phone, ni datos internos


class PDFGenerationRequest(BaseSchema):
    """Esquema para solicitud de generación de PDF"""
    template: str = Field("modern", description="Plantilla del PDF")
    color_scheme: str = Field("blue", description="Esquema de colores")
    include_projects: bool = Field(True, description="Incluir proyectos destacados")


class PDFResponse(BaseSchema):
    """Esquema para respuesta de PDF generado"""
    pdf_url: str
    generated_at: date
    file_size: Optional[int] = None
    message: str = "PDF generado correctamente"
