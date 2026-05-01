'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Skeleton } from '@/components/ui/skeleton';
import { useCMSContent } from '@/hooks/useCMSContent';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Footer() {
    const currentYear = new Date().getFullYear();
    const { content, isLoading, refresh } = useCMSContent('footer', 'main');
    const { socialLinks: globalSocialLinks, siteName } = useGlobalSettings();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const defaultContent = {
        brand_name: 'Portafolio',
        brand_description: 'Desarrollador Full Stack especializado en crear experiencias web modernas y escalables.',
        links_title: 'Enlaces',
        links: [
            { text: 'Proyectos', url: '/projects' },
            { text: 'Sobre mí', url: '/about' },
            { text: 'Contacto', url: '/contact' },
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

    const useGlobalSocial = (data as any).use_global_social_links ?? true;
    const socialLinksToUse = useGlobalSocial && globalSocialLinks.length > 0
        ? globalSocialLinks.map((link: any) => ({ text: link.name, url: link.url, icon: link.icon }))
        : (data.social_links || []);

    const brandName = (data as any).use_global_brand_name && siteName ? siteName : data.brand_name;

    if (isLoading) {
        return (
            <footer className="border-t bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <>
            <EditableSection pageKey="footer" sectionKey="main" onContentUpdate={refresh}>
                <footer className="relative bg-background">
                    {/* Gradient divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

                    <div className="container mx-auto px-4 py-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Información principal */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-display font-semibold">{brandName}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {data.brand_description}
                                </p>
                            </div>

                            {/* Enlaces rápidos */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">{data.links_title}</h4>
                                <nav className="flex flex-col space-y-2">
                                    {data.links.map((link: any, index: number) => (
                                        link.isCV ? null : (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className="text-sm text-muted-foreground hover:text-brand transition-colors w-fit"
                                            >
                                                {link.text}
                                            </Link>
                                        )
                                    ))}
                                </nav>
                            </div>

                            {/* Redes sociales */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">{data.social_title}</h4>
                                <div className="flex flex-col space-y-2">
                                    {socialLinksToUse.map((link: any, index: number) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-muted-foreground hover:text-brand transition-colors flex items-center gap-2 w-fit group"
                                        >
                                            {link.icon && (
                                                <img
                                                    src={link.icon}
                                                    alt={link.text}
                                                    className="w-4 h-4 group-hover:scale-110 transition-transform"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                            )}
                                            {link.text}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Contacto */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">{data.contact_title}</h4>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {data.contact_text}
                                    </p>
                                    <Link
                                        href={data.contact_url}
                                        className="text-sm text-brand hover:text-brand/80 font-medium transition-colors"
                                    >
                                        {data.contact_cta}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="mt-10 pt-6 border-t border-border/50">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-xs text-muted-foreground">
                                    © {currentYear} {data.copyright_text}
                                </p>
                                <div className="flex space-x-4">
                                    {data.legal_links.map((link: any, index: number) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className="text-xs text-muted-foreground hover:text-brand transition-colors"
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

            {/* Back to top */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.25 }}
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-brand text-brand-foreground shadow-glow flex items-center justify-center hover:bg-brand/90 hover:scale-110 transition-transform"
                        aria-label="Volver al inicio"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
