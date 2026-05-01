'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Reveal } from '@/components/motion/Reveal';
import { FeaturedProjects } from '@/components/public/FeaturedProjects';
import { HeroSection } from '@/components/public/HeroSection';
import { RoadmapSectionTimeline } from '@/components/public/RoadmapSectionTimeline';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useEditMode } from '@/contexts/EditModeContext';
import { cmsApi } from '@/lib/cms-api';
import { AnimatePresence, motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface CMSSection {
    id: string;
    page_key: string;
    section_key: string;
    title: string;
    content: any;
    template_id?: string;
    order_index: number;
    is_active: boolean;
}

interface DynamicCMSSectionsProps {
    pageKey: string;
}

// ──────────────────────────────────────────────
// StatNumber — single animated counter
// ──────────────────────────────────────────────
function StatNumber({ value, label, icon }: { value: string; label: string; icon?: string }) {
    const numeric = parseInt(value.replace(/\D/g, ''), 10) || 0;
    const suffix = value.replace(/[\d,]/g, '').trim();
    const { ref, display } = useCountUp(numeric);

    return (
        <div className="text-center">
            {icon && <div className="text-4xl mb-2">{icon}</div>}
            <div className="text-4xl md:text-5xl font-display font-bold mb-2">
                <span ref={ref}>{display}</span>
                {suffix && <span>{suffix}</span>}
            </div>
            <div className="text-sm md:text-base opacity-90">{label || ''}</div>
        </div>
    );
}

// ──────────────────────────────────────────────
// TestimonialsCarousel
// ──────────────────────────────────────────────
function TestimonialsCarousel({ testimonials, title }: { testimonials: any[]; title?: string }) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const total = testimonials.length;

    useEffect(() => {
        if (total <= 1) return;
        const id = setInterval(() => {
            setDirection(1);
            setIndex((i) => (i + 1) % total);
        }, 4000);
        return () => clearInterval(id);
    }, [total]);

    const go = (delta: number) => {
        setDirection(delta);
        setIndex((i) => (i + delta + total) % total);
    };

    const variants = {
        enter: (d: number) => ({ x: d * 60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d * -60, opacity: 0 }),
    };

    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="container mx-auto max-w-4xl">
                {title && (
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
                        {title}
                    </h2>
                )}
                <div className="relative">
                    <div className="overflow-hidden min-h-[220px] flex items-center">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={index}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="w-full"
                            >
                                <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/60 mx-auto max-w-2xl text-center">
                                    <p className="text-lg text-muted-foreground mb-6 italic leading-relaxed">
                                        "{testimonials[index]?.message || ''}"
                                    </p>
                                    <div className="flex items-center justify-center gap-3">
                                        {testimonials[index]?.avatar && (
                                            <img
                                                src={testimonials[index].avatar}
                                                alt={testimonials[index].name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        )}
                                        <div className="text-left">
                                            <p className="font-semibold">{testimonials[index]?.name || ''}</p>
                                            {testimonials[index]?.role && (
                                                <p className="text-sm text-muted-foreground">
                                                    {testimonials[index].role}
                                                    {testimonials[index].company ? ` at ${testimonials[index].company}` : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    {total > 1 && (
                        <>
                            <button
                                onClick={() => go(-1)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-9 h-9 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-brand/5 hover:border-brand/40 transition-colors"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => go(1)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-9 h-9 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-brand/5 hover:border-brand/40 transition-colors"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="flex justify-center gap-1.5 mt-6">
                                {Array.from({ length: total }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                                        className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-brand w-5' : 'bg-muted-foreground/30'}`}
                                        aria-label={`Slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

// ──────────────────────────────────────────────
// ImageGallery with lightbox
// ──────────────────────────────────────────────
function ImageGallery({ images, title }: { images: any[]; title?: string }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    return (
        <section className="py-20 px-4">
            <div className="container mx-auto">
                {title && (
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">{title}</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image: any, idx: number) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-elevated cursor-pointer border border-border/60 hover:border-brand/30 transition-colors"
                            onClick={() => { setSelected(idx); setOpen(true); }}
                        >
                            {image.url ? (
                                <img
                                    src={image.url}
                                    alt={image.alt || image.title || `Image ${idx + 1}`}
                                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground">Sin imagen</span>
                                </div>
                            )}
                            {(image.title || image.description) && (
                                <div className="p-4 bg-card">
                                    {image.title && <h3 className="font-semibold mb-1">{image.title}</h3>}
                                    {image.description && <p className="text-sm text-muted-foreground">{image.description}</p>}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur">
                    <DialogTitle className="sr-only">{images[selected]?.title || 'Image'}</DialogTitle>
                    <div className="relative">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setSelected((s) => (s - 1 + images.length) % images.length)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-brand/5 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setSelected((s) => (s + 1) % images.length)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-brand/5 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selected}
                                src={images[selected]?.url}
                                alt={images[selected]?.alt || images[selected]?.title || ''}
                                className="w-full max-h-[80vh] object-contain"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.2 }}
                            />
                        </AnimatePresence>
                        {(images[selected]?.title || images[selected]?.description) && (
                            <div className="p-4 border-t border-border">
                                {images[selected]?.title && <h3 className="font-semibold">{images[selected].title}</h3>}
                                {images[selected]?.description && <p className="text-sm text-muted-foreground">{images[selected].description}</p>}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────
export function DynamicCMSSections({ pageKey }: DynamicCMSSectionsProps) {
    const [sections, setSections] = useState<CMSSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const { isEditMode } = useEditMode();

    const loadSections = useCallback(async () => {
        setIsLoading(true);
        try {
            if (isEditMode) {
                const allSections = await cmsApi.getPageSections(pageKey, true);
                allSections.sort((a: CMSSection, b: CMSSection) => a.order_index - b.order_index);
                setSections(allSections);
            } else {
                const pageData = await cmsApi.getPagePublic(pageKey);
                setSections(pageData.sections as any);
            }
        } catch (error) {
            console.error('Error loading dynamic sections:', error);
            if (isEditMode) {
                try {
                    const pageData = await cmsApi.getPagePublic(pageKey);
                    setSections(pageData.sections as any);
                } catch (fallbackError) {
                    console.error('Fallback also failed:', fallbackError);
                    setSections([]);
                }
            } else {
                setSections([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [pageKey, isEditMode, refreshKey]);

    useEffect(() => {
        loadSections();
    }, [loadSections]);

    const handleReorder = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    const renderSection = (section: CMSSection, index: number, totalSections: number) => {
        const templateId = section.content?.template_id || section.template_id;

        if (section.section_key === 'hero' || templateId === 'hero') {
            return (
                <HeroSection
                    canMoveUp={index > 0}
                    canMoveDown={index < totalSections - 1}
                    onReorder={handleReorder}
                />
            );
        }

        if (section.section_key === 'featured_projects' || templateId === 'featured_projects') {
            return (
                <FeaturedProjects
                    canMoveUp={index > 0}
                    canMoveDown={index < totalSections - 1}
                    onReorder={handleReorder}
                />
            );
        }

        switch (templateId) {

            case 'roadmap':
                return (
                    <RoadmapSectionTimeline
                        content={{
                            title: section.content?.title,
                            description: section.content?.description,
                            categories: section.content?.categories || []
                        }}
                    />
                );

            case 'text-simple':
                return (
                    <section className="py-20 px-4">
                        <div className="container mx-auto max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                                {section.content?.title}
                            </h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {section.content?.content}
                                </p>
                            </div>
                        </div>
                    </section>
                );

            case 'cta-section':
                return (
                    <section className="py-20 px-4 bg-gradient-to-br from-brand to-brand/70 text-brand-foreground relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-dot-pattern" />
                        <div className="container mx-auto max-w-4xl text-center relative">
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                                {section.content?.title}
                            </h2>
                            <p className="text-xl mb-8 opacity-90">
                                {section.content?.description}
                            </p>
                            <div className="flex gap-4 justify-center flex-wrap">
                                {section.content?.primary_button_text && (
                                    <a
                                        href={section.content?.primary_button_url || '#'}
                                        className="px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-elevated"
                                    >
                                        {section.content?.primary_button_text}
                                    </a>
                                )}
                                {section.content?.secondary_button_text && (
                                    <a
                                        href={section.content?.secondary_button_url || '#'}
                                        className="px-8 py-3 border-2 border-brand-foreground/50 text-brand-foreground rounded-lg font-semibold hover:bg-brand-foreground/10 hover:border-brand-foreground transition-all"
                                    >
                                        {section.content?.secondary_button_text}
                                    </a>
                                )}
                            </div>
                        </div>
                    </section>
                );

            case 'image-gallery':
                return (
                    <ImageGallery
                        images={Array.isArray(section.content?.images) ? section.content.images : []}
                        title={section.content?.title}
                    />
                );

            case 'hero-simple':
                return (
                    <motion.section
                        className="py-32 px-4 bg-gradient-to-br from-brand/20 via-background to-primary/10 relative overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="absolute inset-0 opacity-10 bg-dot-pattern" />
                        <div className="container mx-auto max-w-4xl text-center relative">
                            {section.content?.title && (
                                <motion.h1
                                    className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                >
                                    {section.content.title}
                                </motion.h1>
                            )}
                            {section.content?.subtitle && (
                                <motion.h2
                                    className="text-xl md:text-2xl text-brand font-semibold mb-6"
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    {section.content.subtitle}
                                </motion.h2>
                            )}
                            {section.content?.description && (
                                <motion.p
                                    className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    {section.content.description}
                                </motion.p>
                            )}
                            {section.content?.button_text && (
                                <motion.a
                                    href={section.content?.button_url || '#'}
                                    className="inline-block px-8 py-3 bg-brand text-brand-foreground rounded-lg font-semibold hover:bg-brand/90 hover:scale-[1.02] transition-all shadow-glow"
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    {section.content.button_text}
                                </motion.a>
                            )}
                        </div>
                    </motion.section>
                );

            case 'list-with-icons':
                return (
                    <section className="py-20 px-4">
                        <div className="container mx-auto max-w-4xl">
                            {section.content?.title && (
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
                                    {section.content.title}
                                </h2>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {section.content?.items && Array.isArray(section.content.items) && section.content.items.map((item: any, idx: number) => (
                                    <motion.a
                                        key={idx}
                                        href={item.url || '#'}
                                        whileHover={{ y: -3 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-start gap-4 p-6 rounded-xl border border-border/60 hover:border-brand/40 hover:bg-brand/5 hover:shadow-elevated transition-all group"
                                    >
                                        {item.icon && (
                                            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-2xl shrink-0 group-hover:bg-brand/20 transition-colors">
                                                {item.icon}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold group-hover:text-brand transition-colors">
                                                {item.text || `Item ${idx + 1}`}
                                            </h3>
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                            )}
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'testimonials':
                return (
                    <TestimonialsCarousel
                        testimonials={Array.isArray(section.content?.testimonials) ? section.content.testimonials : []}
                        title={section.content?.title}
                    />
                );

            case 'stats-section':
                return (
                    <section className="py-20 px-4 bg-gradient-to-br from-brand to-brand/70 text-brand-foreground relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-dot-pattern" />
                        <div className="container mx-auto max-w-6xl relative">
                            {section.content?.title && (
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
                                    {section.content.title}
                                </h2>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {section.content?.stats && Array.isArray(section.content.stats) && section.content.stats.map((stat: any, idx: number) => (
                                    <StatNumber
                                        key={idx}
                                        value={stat.value || '0'}
                                        label={stat.label || ''}
                                        icon={stat.icon}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                );

            default:
                return (
                    <section className="py-20 px-4">
                        <div className="container mx-auto max-w-4xl">
                            {section.content?.title && (
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                                    {section.content.title}
                                </h2>
                            )}
                            {section.content?.subtitle && (
                                <h3 className="text-xl md:text-2xl text-muted-foreground mb-8">
                                    {section.content.subtitle}
                                </h3>
                            )}
                            {section.content?.description && (
                                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {section.content.description}
                                    </p>
                                </div>
                            )}
                            {section.content?.content && (
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap">
                                        {section.content.content}
                                    </p>
                                </div>
                            )}
                            {(section.content?.button_text || section.content?.primary_button_text) && (
                                <div className="flex flex-wrap gap-4 mt-8">
                                    {section.content?.button_text && (
                                        <a
                                            href={section.content?.button_url || '#'}
                                            className="px-6 py-3 bg-brand text-brand-foreground rounded-lg font-semibold hover:bg-brand/90 hover:scale-[1.02] transition-all shadow-glow"
                                        >
                                            {section.content.button_text}
                                        </a>
                                    )}
                                    {section.content?.primary_button_text && (
                                        <a
                                            href={section.content?.primary_button_url || '#'}
                                            className="px-6 py-3 bg-brand text-brand-foreground rounded-lg font-semibold hover:bg-brand/90 transition-colors"
                                        >
                                            {section.content.primary_button_text}
                                        </a>
                                    )}
                                    {section.content?.secondary_button_text && (
                                        <a
                                            href={section.content?.secondary_button_url || '#'}
                                            className="px-6 py-3 border-2 border-brand text-brand rounded-lg font-semibold hover:bg-brand hover:text-brand-foreground transition-colors"
                                        >
                                            {section.content.secondary_button_text}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                );
        }
    };

    if (isLoading) {
        return null;
    }

    return (
        <>
            {sections.map((section, index) => {
                const hasOwnWrapper = ['hero', 'featured_projects'].includes(section.section_key);

                if (hasOwnWrapper) {
                    return (
                        <div key={section.id || section.section_key}>
                            {renderSection(section, index, sections.length)}
                        </div>
                    );
                }

                return (
                    <EditableSection
                        key={section.id || section.section_key}
                        pageKey={pageKey}
                        sectionKey={section.section_key}
                        onContentUpdate={handleReorder}
                        onDeleted={handleReorder}
                        canMoveUp={index > 0}
                        canMoveDown={index < sections.length - 1}
                        styles={(section as any).styles || {}}
                        applyStyles={true}
                    >
                        <Reveal variant="fade-up">
                            {renderSection(section, index, sections.length)}
                        </Reveal>
                    </EditableSection>
                );
            })}
        </>
    );
}
