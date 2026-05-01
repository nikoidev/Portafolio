'use client'

import { useSession } from 'next-auth/react'

export type Permission = string

/**
 * Hook simplificado — con un solo admin todas las verificaciones
 * son equivalentes a "¿está autenticado?".
 */
export function usePermissions() {
    const { status } = useSession()
    const isAdmin = status === 'authenticated'

    const hasPermission = (_permission: Permission): boolean => isAdmin
    const hasAllPermissions = (..._permissions: Permission[]): boolean => isAdmin
    const hasAnyPermission = (..._permissions: Permission[]): boolean => isAdmin
    const isRole = (_role: string): boolean => isAdmin
    const canEdit = (): boolean => isAdmin
    const canCreate = (): boolean => isAdmin
    const canDelete = (): boolean => isAdmin
    const isViewerOnly = (): boolean => !isAdmin

    return {
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        isRole,
        canEdit,
        canCreate,
        canDelete,
        isViewerOnly,
        isSuperAdmin: isAdmin,
        isAdmin,
        isEditor: isAdmin,
        isViewer: !isAdmin,
        permissions: isAdmin ? ['all'] : [],
        user: null,
    }
}
