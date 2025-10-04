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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCMSContent } from '@/hooks/useCMSContent';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { cn } from '@/lib/utils';
import { Construction, Download, LogIn, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [showDevModal, setShowDevModal] = useState(false);

    // Cargar contenido desde CMS
    const { content, isLoading, refresh } = useCMSContent('navbar', 'main');

    // Cargar configuración global
    const { socialLinks: globalSocialLinks } = useGlobalSettings();

    // Contenido por defecto si no hay en CMS
    const defaultContent = {
        brand_name: 'Portfolio',
        brand_letter: 'P',
        navigation_links: [
            { text: 'Inicio', url: '/', enabled: true },
            { text: 'Sobre Mí', url: '/about', enabled: true },
            { text: 'Proyectos', url: '/projects', enabled: true },
            { text: 'Contacto', url: '/contact', enabled: true },
        ],
        social_links: [
            { text: 'GitHub', url: 'https://github.com', icon: 'https://cdn.simpleicons.org/github/181717', enabled: true },
            { text: 'LinkedIn', url: 'https://linkedin.com', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2', enabled: true },
            { text: 'Email', url: 'mailto:contact@example.com', icon: 'https://cdn.simpleicons.org/gmail/EA4335', enabled: true },
        ],
        cv_button: {
            text: 'CV',
            url: '/cv/download',
            enabled: true,
        },
        login_button: {
            text: 'Iniciar Sesión',
            url: '/admin/login',
            enabled: true,
        },
    };

    const navData = content || defaultContent;

    // Páginas de admin donde SÍ se muestra el navbar
    const publicAdminPages = ['/admin/login'];
    const isPublicAdminPage = publicAdminPages.includes(pathname);

    // No mostrar navbar en páginas de admin protegidas (pero sí en login/setup)
    if (pathname.startsWith('/admin') && !isPublicAdminPage) {
        return null;
    }

    // Filtrar enlaces habilitados
    const enabledNavLinks = navData.navigation_links?.filter((link: any) => link.enabled) || [];

    // Usar social links globales si están habilitados en CMS, sino usar los del CMS
    const useGlobalSocial = (navData as any).use_global_social_links ?? true; // Por defecto usar globales
    const socialLinksToUse = useGlobalSocial && globalSocialLinks.length > 0
        ? globalSocialLinks.map((link: any) => ({
            text: link.name,
            url: link.url,
            icon: link.icon,
            enabled: link.enabled
        }))
        : (navData.social_links || []);

    const enabledSocialLinks = socialLinksToUse.filter((link: any) => link.enabled);

    if (isLoading) {
        return (
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-center">
                        <div className="animate-pulse">Cargando...</div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <EditableSection pageKey="navbar" sectionKey="main" onContentUpdate={refresh}>
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                {navData.brand_letter}
                            </div>
                            <span className="hidden font-bold sm:inline-block">
                                {navData.brand_name}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {enabledNavLinks.map((item: any) => (
                                <Link
                                    key={item.text}
                                    href={item.url}
                                    className={cn(
                                        'text-sm font-medium transition-colors hover:text-primary',
                                        pathname === item.url
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                    )}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {/* Social Links */}
                            {enabledSocialLinks.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    {enabledSocialLinks.map((link: any) => (
                                        <Button
                                            key={link.text}
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={link.text}
                                            >
                                                {link.icon ? (
                                                    <img
                                                        src={link.icon}
                                                        alt={link.text}
                                                        className="h-4 w-4"
                                                    />
                                                ) : (
                                                    <span>{link.text.charAt(0)}</span>
                                                )}
                                            </a>
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {/* CV Download */}
                            {navData.cv_button?.enabled && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowDevModal(true)}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {navData.cv_button.text}
                                </Button>
                            )}

                            {/* Login Button */}
                            {navData.login_button?.enabled && (
                                <Button asChild size="sm">
                                    <Link href={navData.login_button.url}>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        {navData.login_button.text}
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="md:hidden"
                                    size="sm"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Abrir menú</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col space-y-6">
                                    {/* Logo */}
                                    <Link
                                        href="/"
                                        className="flex items-center space-x-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                            {navData.brand_letter}
                                        </div>
                                        <span className="font-bold">{navData.brand_name}</span>
                                    </Link>

                                    {/* Navigation Links */}
                                    <div className="flex flex-col space-y-4">
                                        {enabledNavLinks.map((item: any) => (
                                            <Link
                                                key={item.text}
                                                href={item.url}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    'text-lg font-medium transition-colors hover:text-primary',
                                                    pathname === item.url
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground'
                                                )}
                                            >
                                                {item.text}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t" />

                                    {/* Actions */}
                                    <div className="flex flex-col space-y-4">
                                        {/* Login Button */}
                                        {navData.login_button?.enabled && (
                                            <Button asChild className="w-full">
                                                <Link
                                                    href={navData.login_button.url}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <LogIn className="mr-2 h-4 w-4" />
                                                    {navData.login_button.text}
                                                </Link>
                                            </Button>
                                        )}

                                        {/* CV Download */}
                                        {navData.cv_button?.enabled && (
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setShowDevModal(true);
                                                }}
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                {navData.cv_button.text}
                                            </Button>
                                        )}

                                        {/* Social Links */}
                                        {enabledSocialLinks.length > 0 && (
                                            <div className="flex justify-center space-x-4">
                                                {enabledSocialLinks.map((link: any) => (
                                                    <Button
                                                        key={link.text}
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={link.text}
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            {link.icon ? (
                                                                <img
                                                                    src={link.icon}
                                                                    alt={link.text}
                                                                    className="h-4 w-4"
                                                                />
                                                            ) : (
                                                                <span>{link.text.charAt(0)}</span>
                                                            )}
                                                        </a>
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

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
        </EditableSection>
    );
}
