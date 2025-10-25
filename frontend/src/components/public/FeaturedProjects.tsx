'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Button } from '@/components/ui/button';
import { useCMSContent } from '@/hooks/useCMSContent';
import { useProjectsStore } from '@/store/projects';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProjectCard } from './ProjectCard';

interface FeaturedProjectsProps {
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    onReorder?: () => void;
}

export function FeaturedProjects({ canMoveUp, canMoveDown, onReorder }: FeaturedProjectsProps = {}) {
    const { featuredProjects, isLoading, error, fetchFeaturedProjects } = useProjectsStore();
    const { content, isLoading: cmsLoading, refresh } = useCMSContent('home', 'featured_projects');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 8;

    // Contenido por defecto
    const defaultContent = {
        title: 'Proyectos Destacados',
        description: 'Una selección de mis trabajos más recientes y significativos, donde aplico las últimas tecnologías y mejores prácticas.',
        button_text: 'Ver todos los proyectos',
        button_url: '/projects',
        max_projects: 6
    };

    const data = content || defaultContent;

    useEffect(() => {
        fetchFeaturedProjects(data.max_projects || 6);
    }, [fetchFeaturedProjects, data.max_projects]);

    // Calcular paginación
    const totalPages = Math.ceil(featuredProjects.length / projectsPerPage);
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const currentProjects = featuredProjects.slice(startIndex, endIndex);
    const showPagination = featuredProjects.length > projectsPerPage;

    // Reset a la primera página cuando cambien los proyectos
    useEffect(() => {
        setCurrentPage(1);
    }, [featuredProjects.length]);

    if (isLoading || cmsLoading) {
        return (
            <section className="py-20 bg-accent/5">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                        <p className="mt-4 text-muted-foreground">Cargando proyectos...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-accent/5">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-destructive">Error al cargar proyectos: {error}</p>
                        <Button
                            onClick={() => fetchFeaturedProjects(data.max_projects || 6)}
                            variant="outline"
                            className="mt-4"
                        >
                            Reintentar
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    const handleContentUpdate = () => {
        refresh();
        if (onReorder) {
            onReorder();
        }
    };

    return (
        <EditableSection
            pageKey="home"
            sectionKey="featured_projects"
            onContentUpdate={handleContentUpdate}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
        >
            <section className="py-20 bg-accent/5">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {data.title}
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {data.description}
                        </p>
                    </div>

                    {/* Grid de proyectos */}
                    {featuredProjects.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                                {currentProjects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>

                            {/* Paginación */}
                            {showPagination && (
                                <div className="flex justify-center items-center gap-2 mb-12">
                                    {/* Botón anterior */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="h-10 w-10"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Números de página */}
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            // Mostrar solo algunas páginas (primera, última, actual y adyacentes)
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <Button
                                                        key={page}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="icon"
                                                        onClick={() => setCurrentPage(page)}
                                                        className="h-10 w-10"
                                                    >
                                                        {page}
                                                    </Button>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return (
                                                    <span key={page} className="flex items-center px-2">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    {/* Botón siguiente */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="h-10 w-10"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Botón ver todos */}
                            <div className="text-center">
                                <Button asChild size="lg" variant="outline">
                                    <Link href={data.button_url} className="flex items-center">
                                        {data.button_text}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">
                                No hay proyectos destacados disponibles.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </EditableSection>
    );
}
