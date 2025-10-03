'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { useCMSContent } from '@/hooks/useCMSContent';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();
    const { content, isLoading, refresh } = useCMSContent('footer', 'main');

    // Cargar configuración global
    const { socialLinks: globalSocialLinks, siteName } = useGlobalSettings();

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
            { text: 'GitHub', url: 'https://github.com', icon: 'https://cdn.simpleicons.org/github' },
            { text: 'LinkedIn', url: 'https://linkedin.com', icon: 'https://cdn.simpleicons.org/linkedin' },
            { text: 'Twitter', url: 'https://twitter.com', icon: 'https://cdn.simpleicons.org/twitter' }
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

    // Usar social links globales si están habilitados, sino usar los del CMS
    const useGlobalSocial = (data as any).use_global_social_links ?? true;
    const socialLinksToUse = useGlobalSocial && globalSocialLinks.length > 0
        ? globalSocialLinks.map((link: any) => ({
            text: link.name,
            url: link.url,
            icon: link.icon
        }))
        : (data.social_links || []);

    // Usar nombre del sitio global si está configurado
    const brandName = (data as any).use_global_brand_name && siteName ? siteName : data.brand_name;

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
                            <h3 className="text-lg font-semibold">{brandName}</h3>
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
                                {socialLinksToUse.map((link: any, index: number) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        {link.icon && (
                                            <img
                                                src={link.icon}
                                                alt={link.text}
                                                className="w-4 h-4"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
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
