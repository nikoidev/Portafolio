"""
Modelo de Usuario para el sistema de administración
"""
from sqlalchemy import Column, String, Boolean, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from .base import BaseModel
from .enums import UserRole, Permission, has_permission


class User(BaseModel):
    """Modelo de Usuario con sistema de roles y permisos"""
    __tablename__ = "users"
    
    # Información básica
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Rol y permisos
    role = Column(
        SQLEnum(UserRole, name='user_role', values_callable=lambda x: [e.value for e in x]),
        default=UserRole.EDITOR.value,
        nullable=False,
        index=True
    )
    
    # Estado del usuario
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Mantener is_admin por compatibilidad (deprecated)
    is_admin = Column(Boolean, default=False, nullable=False)
    
    # Información del perfil
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Redes sociales
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    twitter_url = Column(String(255), nullable=True)
    website_url = Column(String(255), nullable=True)
    
    # Relaciones
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    
    @property
    def permissions(self):
        """Obtener lista de permisos del usuario basado en su rol"""
        from .enums import ROLE_PERMISSIONS
        return [perm.value for perm in ROLE_PERMISSIONS.get(self.role, [])]
    
    def has_permission(self, permission: Permission) -> bool:
        """Verificar si el usuario tiene un permiso específico"""
        return has_permission(self.role, permission)
    
    def is_super_admin(self) -> bool:
        """Verificar si el usuario es super admin"""
        return self.role == UserRole.SUPER_ADMIN
    
    def is_admin_role(self) -> bool:
        """Verificar si el usuario tiene rol de admin o superior"""
        return self.role in [UserRole.SUPER_ADMIN, UserRole.ADMIN]
    
    def __repr__(self):
        return f"<User(email={self.email}, name={self.name}, role={self.role})>"
