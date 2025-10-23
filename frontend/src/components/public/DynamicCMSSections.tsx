'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { FeaturedProjects } from '@/components/public/FeaturedProjects';
import { HeroSection } from '@/components/public/HeroSection';
import { RoadmapSectionTimeline } from '@/components/public/RoadmapSectionTimeline';
import { useEditMode } from '@/contexts/EditModeContext';
import { cmsApi } from '@/lib/cms-api';
import { useEffect, useState } from 'react';

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
    const { isEditMode } = useEditMode();

    useEffect(() => {
        loadSections();
    }, [pageKey, isEditMode]);

    const loadSections = async () => {
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
    };

    const renderSection = (section: CMSSection) => {
        const templateId = section.content?.template_id || section.template_id;

        // Detectar secciones especiales por section_key si no tienen template_id
        if (section.section_key === 'hero' || templateId === 'hero') {
            return <HeroSection />;
        }

        if (section.section_key === 'featured_projects' || templateId === 'featured_projects') {
            return <FeaturedProjects />;
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

            default:
                // Renderizado genérico para otras plantillas
                return (
                    <section className="py-20 px-4">
                        <div className="container mx-auto">
                            <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                            <div className="text-muted-foreground">
                                <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(section.content, null, 2)}
                                </pre>
                            </div>
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
                // Las secciones hero y featured_projects ya tienen sus propios estilos,
                // así que no aplicamos estilos adicionales
                const isSpecialSection = ['hero', 'featured_projects'].includes(section.section_key);

                return (
                    <EditableSection
                        key={section.id}
                        pageKey={pageKey}
                        sectionKey={section.section_key}
                        onContentUpdate={loadSections}
                        onDeleted={loadSections}
                        canMoveUp={index > 0}
                        canMoveDown={index < sections.length - 1}
                        styles={(section as any).styles || {}}
                        applyStyles={!isSpecialSection}
                    >
                        {renderSection(section)}
                    </EditableSection>
                );
            })}
        </>
    );
}

