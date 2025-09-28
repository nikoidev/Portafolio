'use client';

import { Button } from '@/components/ui/button';
import { useProjectsStore } from '@/store/projects';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { ProjectCard } from './ProjectCard';

export function FeaturedProjects() {
    const { featuredProjects, isLoading, error, fetchFeaturedProjects } = useProjectsStore();

    useEffect(() => {
        fetchFeaturedProjects(6);
    }, [fetchFeaturedProjects]);

    if (isLoading) {
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
                            onClick={() => fetchFeaturedProjects(6)}
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

    return (
        <section className="py-20 bg-accent/5">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Proyectos Destacados
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Una selección de mis trabajos más recientes y significativos,
                        donde aplico las últimas tecnologías y mejores prácticas.
                    </p>
                </div>

                {/* Grid de proyectos */}
                {featuredProjects.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {featuredProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>

                        {/* Botón ver todos */}
                        <div className="text-center">
                            <Button asChild size="lg" variant="outline">
                                <Link href="/projects" className="flex items-center">
                                    Ver todos los proyectos
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
    );
}
