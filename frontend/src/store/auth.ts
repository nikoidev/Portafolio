/**
 * Thin wrapper around NextAuth v5 useSession so that existing call-sites
 * continue to work without change.  Components that were previously calling
 * useAuthStore() now use the NextAuth session under the hood.
 */
'use client'

import { signOut, useSession } from 'next-auth/react'

export function useAuthStore() {
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        role: 'super_admin' as const,
        permissions: [] as string[],
        is_active: true,
        created_at: '',
        updated_at: '',
      }
    : null

  const logout = () => signOut({ callbackUrl: '/admin/login' })

  const isSuperAdmin = () => isAuthenticated

  return {
    session,
    user,
    isAuthenticated,
    isLoading,
    error: null,
    isValidating: isLoading,
    logout,
    clearError: () => {},
    setLoading: () => {},
    isSuperAdmin,
  }
}
