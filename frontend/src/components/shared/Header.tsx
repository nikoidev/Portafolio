'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

interface HeaderProps {
    variant?: 'public' | 'admin';
}

export function Header({ variant = 'public' }: HeaderProps) {
    const { isAuthenticated, user, logout } = useAuthStore();

    if (variant === 'admin') {
        return (
            <header className="border-b bg-background">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin" className="text-xl font-bold">
                                Panel Admin
                            </Link>
                            <nav className="flex items-center space-x-4 ml-8">
                                <Link
                                    href="/admin"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/projects"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    Proyectos
                                </Link>
                                <Link
                                    href="/admin/cv"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    CV
                                </Link>
                                <Link
                                    href="/admin/uploads"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    Archivos
                                </Link>
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
        );
    }

    return (
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
                        <Button asChild variant="outline" size="sm">
                            <Link href="/cv/download">
                                Descargar CV
                            </Link>
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
    );
}
