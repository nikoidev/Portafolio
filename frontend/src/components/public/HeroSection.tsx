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
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { ArrowDown, Construction, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function HeroSection() {
    const { content, isLoading, refresh } = useCMSContent('home', 'hero');
    const { socialLinks: globalSocialLinks } = useGlobalSettings();
    const [showDevModal, setShowDevModal] = useState(false);

    // Contenido por defecto mientras carga o si no existe en DB
    const defaultContent = {
        greeting: '👋 ¡Hola! Soy desarrollador Full Stack',
        title_line1: 'Creando experiencias web',
        title_line2: 'excepcionales',
        description: 'Especializado en React, Next.js, Node.js y Python. Transformo ideas en aplicaciones web modernas, escalables y centradas en el usuario.',
        primary_cta_text: 'Ver mis proyectos',
        primary_cta_link: '/projects',
        secondary_cta_text: 'Descargar CV',
        secondary_cta_link: '/cv/download',
        social_links: [
            {
                text: 'GitHub',
                url: 'https://github.com',
                icon: 'https://cdn.simpleicons.org/github',
                enabled: true
            },
            {
                text: 'LinkedIn',
                url: 'https://linkedin.com',
                icon: 'https://cdn.simpleicons.org/linkedin',
                enabled: true
            },
            {
                text: 'Email',
                url: 'mailto:contact@example.com',
                icon: 'https://cdn.simpleicons.org/gmail',
                enabled: true
            }
        ]
    };

    const data = content || defaultContent;

    // Usar social links globales si están disponibles
    const useGlobalSocial = (data as any).use_global_social_links ?? true;
    const socialLinksToUse = useGlobalSocial && globalSocialLinks.length > 0
        ? globalSocialLinks.map((link: any) => ({
            text: link.name,
            url: link.url,
            icon: link.icon,
            enabled: link.enabled
        }))
        : (data.social_links || []);

    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
                <div className="container mx-auto px-4 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">Cargando...</p>
                </div>
            </section>
        );
    }

    return (
        <EditableSection pageKey="home" sectionKey="hero" onContentUpdate={refresh}>
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Saludo */}
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                {data.greeting}
                            </span>
                        </div>

                        {/* Título principal */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {data.title_line1}
                            <span className="block text-primary">{data.title_line2}</span>
                        </h1>

                        {/* Descripción */}
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                            {data.description}
                        </p>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button asChild size="lg" className="text-lg px-8 py-6">
                                <Link href={data.primary_cta_link}>
                                    {data.primary_cta_text}
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-8 py-6"
                                onClick={() => setShowDevModal(true)}
                            >
                                <Download className="w-5 h-5 mr-2" />
                                {data.secondary_cta_text}
                            </Button>
                        </div>

                        {/* Redes sociales dinámicas */}
                        <div className="flex justify-center flex-wrap gap-4 mb-12">
                            {socialLinksToUse
                                .filter((link: any) => link.enabled !== false)
                                .map((link: any, index: number) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target={link.url.startsWith('http') ? '_blank' : undefined}
                                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="p-3 rounded-full bg-background border hover:bg-accent transition-colors group"
                                        aria-label={link.text}
                                        title={link.text}
                                    >
                                        {link.icon ? (
                                            <img
                                                src={link.icon}
                                                alt={link.text}
                                                className="w-6 h-6 group-hover:scale-110 transition-transform"
                                            />
                                        ) : (
                                            <span className="w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                {link.text.substring(0, 2).toUpperCase()}
                                            </span>
                                        )}
                                    </a>
                                ))}
                        </div>

                        {/* Indicador de scroll */}
                        <div className="animate-bounce">
                            <ArrowDown className="w-6 h-6 mx-auto text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Elementos decorativos */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
                </div>
            </section>

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
