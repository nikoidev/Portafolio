'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Button } from '@/components/ui/button';
import { useCMSContent } from '@/hooks/useCMSContent';
import { ArrowDown, Download, Github, Linkedin, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
    const { content, isLoading, refresh } = useCMSContent('home', 'hero');

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
        github_url: 'https://github.com',
        linkedin_url: 'https://linkedin.com',
        email: 'contact@example.com',
    };

    const data = content || defaultContent;

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

                            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                                <Link href={data.secondary_cta_link} className="flex items-center">
                                    <Download className="w-5 h-5 mr-2" />
                                    {data.secondary_cta_text}
                                </Link>
                            </Button>
                        </div>

                        {/* Redes sociales */}
                        <div className="flex justify-center space-x-6 mb-12">
                            <a
                                href={data.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-background border hover:bg-accent transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-6 h-6" />
                            </a>
                            <a
                                href={data.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-background border hover:bg-accent transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-6 h-6" />
                            </a>
                            <a
                                href={`mailto:${data.email}`}
                                className="p-3 rounded-full bg-background border hover:bg-accent transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-6 h-6" />
                            </a>
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
        </EditableSection>
    );
}
