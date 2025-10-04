'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCMSContent } from '@/hooks/useCMSContent';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { Construction } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
    variant?: 'public' | 'admin';
}

export function Header({ variant = 'public' }: HeaderProps) {
    const { isAuthenticated, user, logout } = useAuthStore();
    const pathname = usePathname();
    const { hasPermission, isViewerOnly } = usePermissions();
    const [showDevModal, setShowDevModal] = useState(false);

    // Cargar contenido desde CMS para header admin
    const { content, isLoading, refresh } = useCMSContent('admin_header', 'main');

    // Contenido por defecto si no hay en CMS
    const defaultContent = {
        brand_name: 'Panel Admin',
        navigation_links: [
            { text: 'Dashboard', url: '/admin', enabled: true },
            { text: 'Proyectos', url: '/admin/projects', enabled: true },
            { text: 'CV', url: '/admin/cv', enabled: true },
            { text: 'Usuarios', url: '/admin/users', enabled: true },
            { text: 'Gestión Web', url: '/admin/cms', enabled: true },
            { text: 'Archivos', url: '/admin/uploads', enabled: true },
        ],
    };

    const adminData = content || defaultContent;

    if (variant === 'admin') {
        // Filtrar enlaces habilitados y según permisos del usuario
        const enabledNavLinks = (adminData.navigation_links?.filter((link: any) => {
            if (!link.enabled) return false;

            // Super Admin y Admin: pueden ver todos los links sin restricción
            if (hasPermission('manage_roles') || hasPermission('manage_settings')) return true;

            // Dashboard: todos pueden verlo
            if (link.url === '/admin') return true;

            // Proyectos: necesita read_project
            if (link.url === '/admin/projects') return hasPermission('read_project');

            // CV: necesita update_cv o read_content
            if (link.url === '/admin/cv') return hasPermission('update_cv') || hasPermission('read_content');

            // Usuarios: necesita read_user
            if (link.url === '/admin/users') return hasPermission('read_user');

            // Gestión Web (CMS): necesita read_content
            if (link.url === '/admin/cms') return hasPermission('read_content');

            // Archivos: necesita upload_file
            if (link.url === '/admin/uploads') return hasPermission('upload_file');

            // Links personalizados: por defecto no mostrar a usuarios con roles restringidos
            // (Solo Editor y Viewer llegarán aquí)
            return false;
        }) || []);

        if (isLoading) {
            return (
                <header className="border-b bg-background">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-center">
                            <div className="animate-pulse">Cargando...</div>
                        </div>
                    </div>
                </header>
            );
        }

        return (
            <EditableSection pageKey="admin_header" sectionKey="main" onContentUpdate={refresh}>
                <header className="border-b bg-background">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link href="/admin" className="text-xl font-bold">
                                    {adminData.brand_name}
                                </Link>
                                <nav className="flex items-center space-x-4 ml-8">
                                    {enabledNavLinks.map((link: any) => (
                                        <Link
                                            key={link.text}
                                            href={link.url}
                                            className={cn(
                                                'text-sm font-medium transition-colors',
                                                pathname === link.url
                                                    ? 'text-primary'
                                                    : 'hover:text-primary'
                                            )}
                                        >
                                            {link.text}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            <div className="flex items-center space-x-4">
                                {isAuthenticated && user && (
                                    <>
                                        <span className="text-sm text-muted-foreground">
                                            Hola, {user.name}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={logout}
                                        >
                                            Cerrar Sesión
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
            </EditableSection>
        );
    }

    return (
        <>
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold">
                            Portafolio
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/projects"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Proyectos
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Sobre mí
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Contacto
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDevModal(true)}
                            >
                                Descargar CV
                            </Button>

                            {isAuthenticated ? (
                                <Button asChild variant="default" size="sm">
                                    <Link href="/admin">
                                        Admin
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal de desarrollo */}
            <Dialog open={showDevModal} onOpenChange={setShowDevModal}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                                <Construction className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-2xl">EN DESARROLLO</DialogTitle>
                        <DialogDescription className="text-center text-base pt-2">
                            La función de descarga de CV está temporalmente deshabilitada.
                            <br />
                            Por favor, contacta directamente para solicitar el CV.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center mt-4">
                        <Button onClick={() => setShowDevModal(false)}>
                            Entendido
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
