'use client';

import { Header } from '@/components/shared/Header';
import { useAuthStore } from '@/store/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    // Páginas que no requieren autenticación
    const publicAdminPages = ['/admin/login'];
    const isPublicPage = publicAdminPages.includes(pathname);

    useEffect(() => {
        // Solo verificar autenticación si no estamos en página pública
        if (!isPublicPage) {
            getCurrentUser();
        }
    }, [getCurrentUser, isPublicPage]);

    useEffect(() => {
        // Solo redirigir si no está autenticado Y no está en página pública
        if (!isLoading && !isAuthenticated && !isPublicPage) {
            router.push('/admin/login');
        }
    }, [isAuthenticated, isLoading, router, isPublicPage]);

    // Si es página pública, renderizar directamente sin verificaciones
    if (isPublicPage) {
        return <>{children}</>;
    }

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // No mostrar nada si no está autenticado (se redirigirá)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header variant="admin" />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
