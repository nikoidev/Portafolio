import { useAuthStore } from '@/store/auth';
import { useMemo } from 'react';

export type Permission =
    // Usuarios
    | 'create_user'
    | 'read_user'
    | 'update_user'
    | 'delete_user'
    | 'manage_roles'
    // Proyectos
    | 'create_project'
    | 'read_project'
    | 'update_project'
    | 'delete_project'
    | 'publish_project'
    // CV
    | 'update_cv'
    | 'generate_cv_pdf'
    // Archivos
    | 'upload_file'
    | 'delete_file'
    // CMS
    | 'create_content'
    | 'read_content'
    | 'update_content'
    | 'delete_content'
    // Sistema
    | 'view_analytics'
    | 'manage_settings';

/**
 * Hook para verificar permisos del usuario actual
 */
export function usePermissions() {
    const { user } = useAuthStore();

    const permissions = useMemo(() => {
        return new Set(user?.permissions || []);
    }, [user?.permissions]);

    /**
     * Verificar si el usuario tiene un permiso específico
     */
    const hasPermission = (permission: Permission): boolean => {
        return permissions.has(permission);
    };

    /**
     * Verificar si el usuario tiene TODOS los permisos especificados
     */
    const hasAllPermissions = (...requiredPermissions: Permission[]): boolean => {
        return requiredPermissions.every(perm => permissions.has(perm));
    };

    /**
     * Verificar si el usuario tiene AL MENOS UNO de los permisos especificados
     */
    const hasAnyPermission = (...requiredPermissions: Permission[]): boolean => {
        return requiredPermissions.some(perm => permissions.has(perm));
    };

    /**
     * Verificar si es un rol específico
     */
    const isRole = (role: string): boolean => {
        return user?.role === role;
    };

    /**
     * Verificar si puede editar (tiene algún permiso de edición)
     */
    const canEdit = (): boolean => {
        return hasAnyPermission(
            'update_project',
            'update_cv',
            'update_content',
            'update_user'
        );
    };

    /**
     * Verificar si puede crear (tiene algún permiso de creación)
     */
    const canCreate = (): boolean => {
        return hasAnyPermission(
            'create_project',
            'create_content',
            'create_user'
        );
    };

    /**
     * Verificar si puede eliminar (tiene algún permiso de eliminación)
     */
    const canDelete = (): boolean => {
        return hasAnyPermission(
            'delete_project',
            'delete_content',
            'delete_user',
            'delete_file'
        );
    };

    /**
     * Verificar si es solo visualizador (solo permisos de lectura)
     */
    const isViewerOnly = (): boolean => {
        return user?.role === 'viewer' || (!canEdit() && !canCreate() && !canDelete());
    };

    return {
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        isRole,
        canEdit,
        canCreate,
        canDelete,
        isViewerOnly,
        permissions: Array.from(permissions),
        user,
    };
}

