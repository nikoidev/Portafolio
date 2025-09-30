"""
Enums para el sistema de roles y permisos
"""
from enum import Enum


class UserRole(str, Enum):
    """Roles de usuario en el sistema"""
    SUPER_ADMIN = "super_admin"  # Control total del sistema
    ADMIN = "admin"              # Gestión completa (proyectos, CV, usuarios)
    EDITOR = "editor"            # Solo edición de contenido (proyectos, CV)
    VIEWER = "viewer"            # Solo lectura
    

class Permission(str, Enum):
    """Permisos específicos en el sistema"""
    # Usuarios
    CREATE_USER = "create_user"
    READ_USER = "read_user"
    UPDATE_USER = "update_user"
    DELETE_USER = "delete_user"
    MANAGE_ROLES = "manage_roles"
    
    # Proyectos
    CREATE_PROJECT = "create_project"
    READ_PROJECT = "read_project"
    UPDATE_PROJECT = "update_project"
    DELETE_PROJECT = "delete_project"
    PUBLISH_PROJECT = "publish_project"
    
    # CV
    UPDATE_CV = "update_cv"
    GENERATE_CV_PDF = "generate_cv_pdf"
    
    # Archivos
    UPLOAD_FILE = "upload_file"
    DELETE_FILE = "delete_file"
    
    # Sistema
    VIEW_ANALYTICS = "view_analytics"
    MANAGE_SETTINGS = "manage_settings"


# Mapeo de roles a permisos
ROLE_PERMISSIONS = {
    UserRole.SUPER_ADMIN: [
        # Tiene todos los permisos
        Permission.CREATE_USER,
        Permission.READ_USER,
        Permission.UPDATE_USER,
        Permission.DELETE_USER,
        Permission.MANAGE_ROLES,
        Permission.CREATE_PROJECT,
        Permission.READ_PROJECT,
        Permission.UPDATE_PROJECT,
        Permission.DELETE_PROJECT,
        Permission.PUBLISH_PROJECT,
        Permission.UPDATE_CV,
        Permission.GENERATE_CV_PDF,
        Permission.UPLOAD_FILE,
        Permission.DELETE_FILE,
        Permission.VIEW_ANALYTICS,
        Permission.MANAGE_SETTINGS,
    ],
    
    UserRole.ADMIN: [
        # Gestión completa excepto super admin stuff
        Permission.CREATE_USER,
        Permission.READ_USER,
        Permission.UPDATE_USER,
        Permission.CREATE_PROJECT,
        Permission.READ_PROJECT,
        Permission.UPDATE_PROJECT,
        Permission.DELETE_PROJECT,
        Permission.PUBLISH_PROJECT,
        Permission.UPDATE_CV,
        Permission.GENERATE_CV_PDF,
        Permission.UPLOAD_FILE,
        Permission.DELETE_FILE,
        Permission.VIEW_ANALYTICS,
    ],
    
    UserRole.EDITOR: [
        # Solo edición de contenido
        Permission.READ_USER,
        Permission.CREATE_PROJECT,
        Permission.READ_PROJECT,
        Permission.UPDATE_PROJECT,
        Permission.UPDATE_CV,
        Permission.GENERATE_CV_PDF,
        Permission.UPLOAD_FILE,
    ],
    
    UserRole.VIEWER: [
        # Solo lectura
        Permission.READ_USER,
        Permission.READ_PROJECT,
        Permission.VIEW_ANALYTICS,
    ],
}


def get_permissions_for_role(role: UserRole) -> list[Permission]:
    """Obtener permisos para un rol específico"""
    return ROLE_PERMISSIONS.get(role, [])


def has_permission(role: UserRole, permission: Permission) -> bool:
    """Verificar si un rol tiene un permiso específico"""
    return permission in ROLE_PERMISSIONS.get(role, [])
