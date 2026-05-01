'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useCMSContent } from '@/hooks/useCMSContent';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    variant?: 'public' | 'admin';
}

export function Header({ variant = 'public' }: HeaderProps) {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const user = session?.user ?? null;
    const logout = () => signOut({ callbackUrl: '/admin/login' });
    const pathname = usePathname();
    const { hasPermission, isViewerOnly } = usePermissions();

    // Cargar contenido desde CMS para header admin
    const { content, isLoading, refresh } = useCMSContent('admin_header', 'main');

    // Contenido por defecto si no hay en CMS
    const defaultContent = {
        brand_name: 'Panel Admin',
        navigation_links: [
            { text: 'Dashboard', url: '/admin', enabled: true },
            { text: 'Proyectos', url: '/admin/projects', enabled: true },
            { text: 'Gestión Web', url: '/admin/cms', enabled: true },
            { text: 'Settings', url: '/admin/settings', enabled: true },
        ],
    };

    const adminData = content || defaultContent;

    if (variant === 'admin') {
        const enabledNavLinks = (adminData.navigation_links?.filter((link: any) => link.enabled) || []);

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
                                {/* Theme Toggle */}
                                <ThemeToggle />

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

        </>
    );
}
