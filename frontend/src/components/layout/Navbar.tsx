'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Download, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre Mí', href: '/about' },
    { name: 'Proyectos', href: '/projects' },
    { name: 'Contacto', href: '/contact' },
];

const socialLinks = [
    {
        name: 'GitHub',
        href: 'https://github.com/tu-usuario',
        icon: Github,
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/in/tu-perfil',
        icon: Linkedin,
    },
    {
        name: 'Email',
        href: 'mailto:tu@email.com',
        icon: Mail,
    },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // No mostrar navbar en páginas de admin
    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            P
                        </div>
                        <span className="hidden font-bold sm:inline-block">
                            Portfolio
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-primary',
                                    pathname === item.href
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {/* Social Links */}
                        <div className="flex items-center space-x-2">
                            {socialLinks.map((link) => (
                                <Button
                                    key={link.name}
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.name}
                                    >
                                        <link.icon className="h-4 w-4" />
                                    </a>
                                </Button>
                            ))}
                        </div>

                        {/* CV Download */}
                        <Button asChild size="sm">
                            <Link href="/cv/download" target="_blank">
                                <Download className="mr-2 h-4 w-4" />
                                CV
                            </Link>
                        </Button>
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
                                        P
                                    </div>
                                    <span className="font-bold">Portfolio</span>
                                </Link>

                                {/* Navigation Links */}
                                <div className="flex flex-col space-y-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                'text-lg font-medium transition-colors hover:text-primary',
                                                pathname === item.href
                                                    ? 'text-primary'
                                                    : 'text-muted-foreground'
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="border-t" />

                                {/* Actions */}
                                <div className="flex flex-col space-y-4">
                                    <Button asChild className="w-full">
                                        <Link
                                            href="/cv/download"
                                            target="_blank"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Descargar CV
                                        </Link>
                                    </Button>

                                    {/* Social Links */}
                                    <div className="flex justify-center space-x-4">
                                        {socialLinks.map((link) => (
                                            <Button
                                                key={link.name}
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <a
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={link.name}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <link.icon className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
