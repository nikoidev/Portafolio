'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { FeaturedProjects } from '@/components/public/FeaturedProjects';
import { HeroSection } from '@/components/public/HeroSection';
import { RoadmapSectionTimeline } from '@/components/public/RoadmapSectionTimeline';
import { useEditMode } from '@/contexts/EditModeContext';
import { cmsApi } from '@/lib/cms-api';
import { useCallback, useEffect, useState } from 'react';

interface CMSSection {
    id: number;
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

export function DynamicCMSSections({ pageKey }: DynamicCMSSectionsProps) {
    const [sections, setSections] = useState<CMSSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const { isEditMode } = useEditMode();

    const loadSections = useCallback(async () => {
        setIsLoading(true);
        try {
            // Si está en modo edición, usar endpoint admin para obtener todos los datos (incluido id)
            // Si no, usar endpoint público
            if (isEditMode) {
                const allSections = await cmsApi.getPageSections(pageKey, true); // true = only active
                allSections.sort((a: CMSSection, b: CMSSection) => a.order_index - b.order_index);
                setSections(allSections);
            } else {
                const pageData = await cmsApi.getPagePublic(pageKey);
                setSections(pageData.sections as any);
            }
        } catch (error) {
            console.error('Error loading dynamic sections:', error);
            // Si falla el endpoint admin, intentar con el público
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

    // Función para forzar recarga después de reordenar
    const handleReorder = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    const renderSection = (section: CMSSection, index: number, totalSections: number) => {
        const templateId = section.content?.template_id || section.template_id;

        // Detectar secciones especiales por section_key si no tienen template_id
        // Estas secciones ya tienen su propio EditableSection wrapper
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
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
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
                    <section className="py-20 px-4 bg-primary text-primary-foreground">
                        <div className="container mx-auto max-w-4xl text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                {section.content?.title}
                            </h2>
                            <p className="text-xl mb-8 opacity-90">
                                {section.content?.description}
                            </p>
                            <div className="flex gap-4 justify-center flex-wrap">
                                {section.content?.primary_button_text && (
                                    <a
                                        href={section.content?.primary_button_url || '#'}
                                        className="px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        {section.content?.primary_button_text}
                                    </a>
                                )}
                                {section.content?.secondary_button_text && (
                                    <a
                                        href={section.content?.secondary_button_url || '#'}
                                        className="px-8 py-3 border-2 border-background text-background rounded-lg font-semibold hover:bg-background hover:text-foreground transition-colors"
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
                    <section className="py-20 px-4">
                        <div className="container mx-auto">
                            {section.content?.title && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                                    {section.content.title}
                                </h2>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.content?.images && Array.isArray(section.content.images) && section.content.images.map((image: any, idx: number) => (
                                    <div key={idx} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                        {image.url ? (
                                            <img
                                                src={image.url}
                                                alt={image.alt || image.title || `Image ${idx + 1}`}
                                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-muted flex items-center justify-center">
                                                <span className="text-muted-foreground">No image</span>
                                            </div>
                                        )}
                                        {(image.title || image.description) && (
                                            <div className="p-4 bg-card">
                                                {image.title && (
                                                    <h3 className="font-semibold mb-1">{image.title}</h3>
                                                )}
                                                {image.description && (
                                                    <p className="text-sm text-muted-foreground">{image.description}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'hero-simple':
                return (
                    <section className="py-32 px-4 bg-gradient-to-br from-primary/10 to-primary/5">
                        <div className="container mx-auto max-w-4xl text-center">
                            {section.content?.title && (
                                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                    {section.content.title}
                                </h1>
                            )}
                            {section.content?.subtitle && (
                                <h2 className="text-xl md:text-2xl text-muted-foreground mb-8">
                                    {section.content.subtitle}
                                </h2>
                            )}
                            {section.content?.description && (
                                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                    {section.content.description}
                                </p>
                            )}
                            {section.content?.button_text && (
                                <a
                                    href={section.content?.button_url || '#'}
                                    className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    {section.content.button_text}
                                </a>
                            )}
                        </div>
                    </section>
                );

            case 'list-with-icons':
                return (
                    <section className="py-20 px-4">
                        <div className="container mx-auto max-w-4xl">
                            {section.content?.title && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                                    {section.content.title}
                                </h2>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {section.content?.items && Array.isArray(section.content.items) && section.content.items.map((item: any, idx: number) => (
                                    <a
                                        key={idx}
                                        href={item.url || '#'}
                                        className="flex items-start gap-4 p-6 rounded-lg border border-border hover:border-primary transition-colors group"
                                    >
                                        {item.icon && (
                                            <div className="text-4xl">{item.icon}</div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                {item.text || `Item ${idx + 1}`}
                                            </h3>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'testimonials':
                return (
                    <section className="py-20 px-4 bg-muted/50">
                        <div className="container mx-auto max-w-6xl">
                            {section.content?.title && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                                    {section.content.title}
                                </h2>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.content?.testimonials && Array.isArray(section.content.testimonials) && section.content.testimonials.map((testimonial: any, idx: number) => (
                                    <div key={idx} className="bg-card p-6 rounded-lg shadow-lg">
                                        <p className="text-muted-foreground mb-4 italic">
                                            "{testimonial.message || 'No message'}"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            {testimonial.avatar && (
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-semibold">{testimonial.name || 'Anonymous'}</p>
                                                {testimonial.role && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {testimonial.role}{testimonial.company ? ` at ${testimonial.company}` : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'stats-section':
                return (
                    <section className="py-20 px-4 bg-primary text-primary-foreground">
                        <div className="container mx-auto max-w-6xl">
                            {section.content?.title && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                                    {section.content.title}
                                </h2>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {section.content?.stats && Array.isArray(section.content.stats) && section.content.stats.map((stat: any, idx: number) => (
                                    <div key={idx} className="text-center">
                                        {stat.icon && (
                                            <div className="text-4xl mb-2">{stat.icon}</div>
                                        )}
                                        <div className="text-4xl md:text-5xl font-bold mb-2">
                                            {stat.value || '0'}
                                        </div>
                                        <div className="text-sm md:text-base opacity-90">
                                            {stat.label || `Stat ${idx + 1}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            default:
                // Renderizado genérico para otras plantillas
                return (
                    <section className="py-20 px-4">
                        <div className="container mx-auto max-w-4xl">
                            {section.content?.title && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">
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
                            {/* Botones genéricos */}
                            {(section.content?.button_text || section.content?.primary_button_text) && (
                                <div className="flex flex-wrap gap-4 mt-8">
                                    {section.content?.button_text && (
                                        <a
                                            href={section.content?.button_url || '#'}
                                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                        >
                                            {section.content.button_text}
                                        </a>
                                    )}
                                    {section.content?.primary_button_text && (
                                        <a
                                            href={section.content?.primary_button_url || '#'}
                                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                        >
                                            {section.content.primary_button_text}
                                        </a>
                                    )}
                                    {section.content?.secondary_button_text && (
                                        <a
                                            href={section.content?.secondary_button_url || '#'}
                                            className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
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
                // Las secciones hero y featured_projects ya tienen su propio EditableSection wrapper interno
                // así que las renderizamos directamente sin wrapper adicional
                const hasOwnWrapper = ['hero', 'featured_projects'].includes(section.section_key);

                if (hasOwnWrapper) {
                    // Renderizar directamente sin wrapper adicional, pasando props de movimiento
                    return (
                        <div key={section.id || section.section_key}>
                            {renderSection(section, index, sections.length)}
                        </div>
                    );
                }

                // Para otras secciones, usar el wrapper EditableSection normal
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
                        {renderSection(section, index, sections.length)}
                    </EditableSection>
                );
            })}
        </>
    );
}

