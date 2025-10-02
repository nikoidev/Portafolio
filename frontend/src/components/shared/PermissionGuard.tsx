'use client';

import { Permission, usePermissions } from '@/hooks/usePermissions';
import { ReactNode } from 'react';

interface PermissionGuardProps {
    children: ReactNode;
    permission?: Permission;
    permissions?: Permission[];
    requireAll?: boolean; // Si true, requiere TODOS los permisos. Si false, requiere AL MENOS UNO
    fallback?: ReactNode; // Qué mostrar si no tiene permiso (por defecto: nada)
    role?: string; // Verificar rol específico
}

/**
 * Componente que solo muestra su contenido si el usuario tiene los permisos requeridos
 * 
 * Ejemplos de uso:
 * <PermissionGuard permission="create_project">
 *   <Button>Crear Proyecto</Button>
 * </PermissionGuard>
 * 
 * <PermissionGuard permissions={['update_project', 'delete_project']} requireAll>
 *   <Button>Editar Proyecto</Button>
 * </PermissionGuard>
 * 
 * <PermissionGuard role="super_admin">
 *   <Button>Solo Super Admin</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
    children,
    permission,
    permissions,
    requireAll = false,
    fallback = null,
    role,
}: PermissionGuardProps) {
    const { hasPermission, hasAllPermissions, hasAnyPermission, isRole } = usePermissions();

    // Si se especifica un rol, verificar eso primero
    if (role && !isRole(role)) {
        return <>{fallback}</>;
    }

    // Verificar un solo permiso
    if (permission && !hasPermission(permission)) {
        return <>{fallback}</>;
    }

    // Verificar múltiples permisos
    if (permissions && permissions.length > 0) {
        if (requireAll && !hasAllPermissions(...permissions)) {
            return <>{fallback}</>;
        }
        if (!requireAll && !hasAnyPermission(...permissions)) {
            return <>{fallback}</>;
        }
    }

    // Si pasa todas las validaciones, mostrar el contenido
    return <>{children}</>;
}

/**
 * Componente inverso: solo muestra su contenido si el usuario NO tiene permiso
 * Útil para mostrar mensajes de "no tienes acceso"
 */
export function PermissionDenied({
    children,
    permission,
    permissions,
    requireAll = false,
}: Omit<PermissionGuardProps, 'fallback'>) {
    return (
        <PermissionGuard
            permission={permission}
            permissions={permissions}
            requireAll={requireAll}
            fallback={children}
        >
            {null}
        </PermissionGuard>
    );
}

