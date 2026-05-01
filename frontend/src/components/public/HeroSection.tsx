'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Button } from '@/components/ui/button';
import { useCMSContent } from '@/hooks/useCMSContent';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    onReorder?: () => void;
}

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export function HeroSection({ canMoveUp, canMoveDown, onReorder }: HeroSectionProps = {}) {
    const { content, isLoading, refresh } = useCMSContent('home', 'hero');
    const { socialLinks: globalSocialLinks } = useGlobalSettings();
    const [roleIndex, setRoleIndex] = useState(0);

    const defaultContent = {
        greeting: '¡Hola! Soy desarrollador Full Stack',
        title_line1: 'Creando experiencias web',
        title_line2: 'excepcionales',
        description: 'Especializado en React, Next.js, Node.js y Python. Transformo ideas en aplicaciones web modernas, escalables y centradas en el usuario.',
        primary_cta_text: 'Ver mis proyectos',
        primary_cta_link: '/projects',
        secondary_cta_text: 'Contactar',
        secondary_cta_link: '/contact',
        rotating_roles: ['React', 'Next.js', 'Node.js', 'Python', 'TypeScript'],
        social_links: [
            { text: 'GitHub', url: 'https://github.com', icon: 'https://cdn.simpleicons.org/github', enabled: true },
            { text: 'LinkedIn', url: 'https://linkedin.com', icon: 'https://cdn.simpleicons.org/linkedin', enabled: true },
            { text: 'Email', url: 'mailto:contact@example.com', icon: 'https://cdn.simpleicons.org/gmail', enabled: true }
        ]
    };

    const data = content || defaultContent;
    const roles: string[] = (data as any).rotating_roles || defaultContent.rotating_roles;

    const useGlobalSocial = (data as any).use_global_social_links ?? true;
    const socialLinksToUse = useGlobalSocial && globalSocialLinks.length > 0
        ? globalSocialLinks.map((link: any) => ({ text: link.name, url: link.url, icon: link.icon, enabled: link.enabled }))
        : (data.social_links || []);

    // Rotate tech roles
    useEffect(() => {
        if (roles.length <= 1) return;
        const timer = setInterval(() => {
            setRoleIndex(i => (i + 1) % roles.length);
        }, 2200);
        return () => clearInterval(timer);
    }, [roles.length]);

    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            </section>
        );
    }

    const handleContentUpdate = () => {
        refresh();
        onReorder?.();
    };

    return (
        <EditableSection
            pageKey="home"
            sectionKey="hero"
            onContentUpdate={handleContentUpdate}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
        >
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background grid pattern with radial mask */}
                <div
                    className="absolute inset-0 -z-20 bg-dot-pattern opacity-40"
                    style={{ maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)' }}
                />

                {/* Gradient base */}
                <div className="absolute inset-0 -z-20 bg-gradient-to-br from-background via-background to-brand/5" />

                {/* Animated decorative blobs */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-1/4 left-[15%] w-80 h-80 bg-brand/10 rounded-full blur-3xl animate-float"
                        style={{ animationDelay: '0s' }}
                    />
                    <div
                        className="absolute bottom-1/3 right-[10%] w-96 h-96 bg-brand/8 rounded-full blur-3xl animate-float"
                        style={{ animationDelay: '-2s' }}
                    />
                    <div
                        className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"
                        style={{ animationDelay: '-4s' }}
                    />
                </div>

                <div className="container mx-auto px-4 py-24">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Eyebrow badge */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium border border-brand/20">
                                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                                {data.greeting}
                            </span>
                        </motion.div>

                        {/* Main headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4 leading-tight"
                        >
                            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                                {data.title_line1}
                            </span>
                            <span className="block bg-gradient-to-r from-brand via-brand to-brand/70 bg-clip-text text-transparent">
                                {data.title_line2}
                            </span>
                        </motion.h1>

                        {/* Rotating tech roles */}
                        <motion.div variants={itemVariants} className="h-10 flex items-center justify-center mb-4">
                            <span className="text-lg md:text-xl text-muted-foreground mr-2">con</span>
                            <div className="relative overflow-hidden h-8 w-36">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={roleIndex}
                                        className="absolute inset-0 flex items-center justify-start text-lg md:text-xl font-semibold text-brand"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                    >
                                        {roles[roleIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            variants={itemVariants}
                            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            {data.description}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="text-base px-8 py-6 bg-brand hover:bg-brand/90 text-brand-foreground shadow-glow hover:scale-[1.02] transition-transform"
                            >
                                <Link href={data.primary_cta_link}>{data.primary_cta_text}</Link>
                            </Button>

                            {data.secondary_cta_link && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-base px-8 py-6 border-brand/30 hover:border-brand hover:bg-brand/5 hover:scale-[1.02] transition-transform"
                                    asChild
                                >
                                    <a href={data.secondary_cta_link}>{data.secondary_cta_text}</a>
                                </Button>
                            )}
                        </motion.div>

                        {/* Social links */}
                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center flex-wrap gap-3 mb-16"
                        >
                            {socialLinksToUse
                                .filter((link: any) => link.enabled !== false)
                                .map((link: any, index: number) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target={link.url.startsWith('http') ? '_blank' : undefined}
                                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-brand/50 hover:bg-brand/5 transition-all hover:scale-110 group"
                                        aria-label={link.text}
                                        title={link.text}
                                    >
                                        {link.icon ? (
                                            <img
                                                src={link.icon}
                                                alt={link.text}
                                                className="w-5 h-5 group-hover:scale-110 transition-transform"
                                            />
                                        ) : (
                                            <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                {link.text.substring(0, 2).toUpperCase()}
                                            </span>
                                        )}
                                    </a>
                                ))}
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            variants={itemVariants}
                            className="animate-bounce opacity-50"
                        >
                            <ArrowDown className="w-5 h-5 mx-auto text-muted-foreground" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </EditableSection>
    );
}
