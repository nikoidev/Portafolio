"""
Esquemas Pydantic para User
"""
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from .base import BaseSchema, TimestampMixin


class UserBase(BaseSchema):
    """Esquema base para User"""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    website_url: Optional[str] = None


class UserCreate(UserBase):
    """Esquema para crear usuario"""
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseSchema):
    """Esquema para actualizar usuario"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    website_url: Optional[str] = None


class UserResponse(UserBase, TimestampMixin):
    """Esquema para respuesta de usuario"""
    is_active: bool
    is_admin: bool


class UserLogin(BaseSchema):
    """Esquema para login"""
    email: EmailStr
    password: str


class UserProfile(UserResponse):
    """Esquema para perfil completo del usuario"""
    pass  # Hereda todo de UserResponse


class Token(BaseSchema):
    """Esquema para token de autenticación"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseSchema):
    """Esquema para datos del token"""
    email: Optional[str] = None
