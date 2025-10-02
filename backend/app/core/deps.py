"""
Dependencias de FastAPI
"""
from typing import Generator, Optional, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.models.enums import Permission, UserRole

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> User:
    """Obtener usuario actual desde el token JWT"""
    
    # Verificar token
    token_data = verify_token(token)
    
    # Buscar usuario en la base de datos
    user = db.query(User).filter(User.email == token_data["email"]).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Obtener usuario activo actual"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )
    return current_user


def get_current_admin_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Obtener usuario admin actual (usando el nuevo sistema de roles)"""
    if not current_user.is_admin_role():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador"
        )
    return current_user


def get_current_super_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Obtener usuario super admin actual"""
    if not current_user.is_super_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los super administradores pueden realizar esta acción"
        )
    return current_user


class PermissionChecker:
    """Dependency para verificar permisos específicos"""
    
    def __init__(self, required_permission: Permission):
        self.required_permission = required_permission
    
    def __call__(self, current_user: User = Depends(get_current_active_user)) -> User:
        if not current_user.has_permission(self.required_permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No tienes el permiso requerido: {self.required_permission.value}"
            )
        return current_user


# Helpers para crear checkers de permisos comunes
def require_permission(permission: Permission) -> Callable:
    """Helper para requerir un permiso específico"""
    return PermissionChecker(permission)


def get_optional_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme_optional)
) -> Optional[User]:
    """Obtener usuario opcional (para endpoints públicos que pueden usar auth)"""
    if not token:
        return None
    
    try:
        token_data = verify_token(token)
        user = db.query(User).filter(User.email == token_data["email"]).first()
        return user if user and user.is_active else None
    except:
        return None
