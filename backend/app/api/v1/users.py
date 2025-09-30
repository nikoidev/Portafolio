"""
Endpoints de gestión de usuarios
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import (
    get_current_active_user, 
    get_current_admin_user,
    get_current_super_admin,
    require_permission
)
from app.models.user import User
from app.models.enums import Permission, UserRole, get_permissions_for_role, ROLE_PERMISSIONS
from app.schemas.user import (
    UserCreate, 
    UserUpdate, 
    UserResponse, 
    RoleInfo,
    PermissionCheck
)
from app.services.auth_service import AuthService

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Obtener información del usuario actual con permisos"""
    permissions = [p.value for p in get_permissions_for_role(current_user.role)]
    
    user_dict = current_user.__dict__.copy()
    user_dict['permissions'] = permissions
    
    return UserResponse.model_validate(user_dict)


@router.get("/", response_model=List[UserResponse])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.READ_USER))
):
    """Listar todos los usuarios (requiere permiso READ_USER)"""
    users = db.query(User).offset(skip).limit(limit).all()
    
    # Agregar permisos a cada usuario
    users_with_permissions = []
    for user in users:
        permissions = [p.value for p in get_permissions_for_role(user.role)]
        user_dict = user.__dict__.copy()
        user_dict['permissions'] = permissions
        users_with_permissions.append(UserResponse.model_validate(user_dict))
    
    return users_with_permissions


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.READ_USER))
):
    """Obtener un usuario por ID"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    permissions = [p.value for p in get_permissions_for_role(user.role)]
    user_dict = user.__dict__.copy()
    user_dict['permissions'] = permissions
    
    return UserResponse.model_validate(user_dict)


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.CREATE_USER))
):
    """Crear nuevo usuario (requiere permiso CREATE_USER)"""
    
    # Solo super admin puede crear super admins
    if user_data.role == UserRole.SUPER_ADMIN and not current_user.is_super_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los super administradores pueden crear otros super administradores"
        )
    
    # Solo admin+ puede crear admins
    if user_data.role == UserRole.ADMIN and not current_user.is_admin_role():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden crear otros administradores"
        )
    
    auth_service = AuthService(db)
    new_user = auth_service.create_user(user_data)
    
    permissions = [p.value for p in get_permissions_for_role(new_user.role)]
    user_dict = new_user.__dict__.copy()
    user_dict['permissions'] = permissions
    
    return UserResponse.model_validate(user_dict)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.UPDATE_USER))
):
    """Actualizar usuario (requiere permiso UPDATE_USER)"""
    
    # Obtener usuario a actualizar
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # No se puede modificar el propio rol (evitar downgrade accidental)
    if target_user.id == current_user.id and user_update.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No puedes modificar tu propio rol"
        )
    
    # Solo super admin puede modificar super admins
    if target_user.role == UserRole.SUPER_ADMIN and not current_user.is_super_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los super administradores pueden modificar otros super administradores"
        )
    
    # Verificar cambio de rol
    if user_update.role:
        # Solo super admin puede asignar rol de super admin
        if user_update.role == UserRole.SUPER_ADMIN and not current_user.is_super_admin():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los super administradores pueden asignar el rol de super administrador"
            )
        
        # Solo admin+ puede asignar rol de admin
        if user_update.role == UserRole.ADMIN and not current_user.is_admin_role():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden asignar el rol de administrador"
            )
    
    auth_service = AuthService(db)
    updated_user = auth_service.update_user(user_id, user_update)
    
    permissions = [p.value for p in get_permissions_for_role(updated_user.role)]
    user_dict = updated_user.__dict__.copy()
    user_dict['permissions'] = permissions
    
    return UserResponse.model_validate(user_dict)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.DELETE_USER))
):
    """Eliminar usuario (requiere permiso DELETE_USER)"""
    
    # No se puede eliminar a sí mismo
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No puedes eliminar tu propia cuenta"
        )
    
    # Obtener usuario a eliminar
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Solo super admin puede eliminar admins
    if target_user.is_admin_role() and not current_user.is_super_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los super administradores pueden eliminar administradores"
        )
    
    auth_service = AuthService(db)
    auth_service.delete_user(user_id)
    
    return None


@router.get("/roles/available", response_model=List[RoleInfo])
async def get_available_roles(
    current_user: User = Depends(get_current_active_user)
):
    """Obtener roles disponibles según el usuario actual"""
    available_roles = []
    
    for role in UserRole:
        # Super admin ve todos los roles
        if current_user.is_super_admin():
            permissions = [p.value for p in ROLE_PERMISSIONS.get(role, [])]
            available_roles.append(RoleInfo(
                name=role.name,
                value=role.value,
                permissions=permissions
            ))
        # Admin ve todos excepto super admin
        elif current_user.is_admin_role() and role != UserRole.SUPER_ADMIN:
            permissions = [p.value for p in ROLE_PERMISSIONS.get(role, [])]
            available_roles.append(RoleInfo(
                name=role.name,
                value=role.value,
                permissions=permissions
            ))
        # Editor/Viewer solo ve editor y viewer
        elif role in [UserRole.EDITOR, UserRole.VIEWER]:
            permissions = [p.value for p in ROLE_PERMISSIONS.get(role, [])]
            available_roles.append(RoleInfo(
                name=role.name,
                value=role.value,
                permissions=permissions
            ))
    
    return available_roles


@router.post("/check-permission", response_model=PermissionCheck)
async def check_user_permission(
    permission: str,
    current_user: User = Depends(get_current_active_user)
):
    """Verificar si el usuario actual tiene un permiso específico"""
    try:
        perm = Permission(permission)
        has_perm = current_user.has_permission(perm)
        return PermissionCheck(permission=permission, has_permission=has_perm)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Permiso inválido: {permission}"
        )
