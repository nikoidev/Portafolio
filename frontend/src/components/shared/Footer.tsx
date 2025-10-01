'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { useCMSContent } from '@/hooks/useCMSContent';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();
    const { content, isLoading, refresh } = useCMSContent('footer', 'main');

    // Contenido por defecto
    const defaultContent = {
        brand_name: 'Portafolio',
        brand_description: 'Desarrollador Full Stack especializado en crear experiencias web modernas y escalables.',
        links_title: 'Enlaces',
        links: [
            { text: 'Proyectos', url: '/projects' },
            { text: 'Sobre mí', url: '/about' },
            { text: 'Contacto', url: '/contact' },
            { text: 'Descargar CV', url: '/cv/download' }
        ],
        social_title: 'Sígueme',
        social_links: [
            { text: 'GitHub', url: 'https://github.com' },
            { text: 'LinkedIn', url: 'https://linkedin.com' },
            { text: 'Twitter', url: 'https://twitter.com' }
        ],
        contact_title: 'Contacto',
        contact_text: '¿Tienes un proyecto en mente?',
        contact_cta: 'Hablemos →',
        contact_url: '/contact',
        copyright_text: 'Portafolio Personal. Todos los derechos reservados.',
        legal_links: [
            { text: 'Privacidad', url: '/privacy' },
            { text: 'Términos', url: '/terms' }
        ]
    };

    const data = content || defaultContent;

    if (isLoading) {
        return (
            <footer className="border-t bg-background">
                <div className="container mx-auto px-4 py-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </div>
            </footer>
        );
    }

    return (
        <EditableSection pageKey="footer" sectionKey="main" onContentUpdate={refresh}>
            <footer className="border-t bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Información principal */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">{data.brand_name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {data.brand_description}
                            </p>
                        </div>

                        {/* Enlaces rápidos */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">{data.links_title}</h4>
                            <nav className="flex flex-col space-y-2">
                                {data.links.map((link: any, index: number) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.text}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Redes sociales */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">{data.social_title}</h4>
                            <div className="flex flex-col space-y-2">
                                {data.social_links.map((link: any, index: number) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.text}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">{data.contact_title}</h4>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {data.contact_text}
                                </p>
                                <Link
                                    href={data.contact_url}
                                    className="text-sm text-primary hover:underline"
                                >
                                    {data.contact_cta}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                © {currentYear} {data.copyright_text}
                            </p>
                            <div className="flex space-x-4 mt-4 md:mt-0">
                                {data.legal_links.map((link: any, index: number) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.text}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </EditableSection>
    );
}
