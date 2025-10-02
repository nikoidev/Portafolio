'use client';

import { ProjectDemo } from '@/components/shared/ProjectDemo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { api, getImageUrl } from '@/lib/api';
import { Project } from '@/types/api';
import { ArrowLeft, Calendar, Eye, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProjectDetailClient() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const loadProject = async () => {
            try {
                setIsLoading(true);
                const data = await api.getProject(params.slug as string) as any;
                setProject(data);
            } catch (error: any) {
                toast.error('Proyecto no encontrado');
                router.push('/projects');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.slug) {
            loadProject();
        }
    }, [params.slug, router]);

    const handleShare = async () => {
        if (navigator.share && project) {
            try {
                await navigator.share({
                    title: project.title,
                    text: project.description,
                    url: window.location.href,
                });
            } catch (error) {
                // Fallback: copiar al portapapeles
                navigator.clipboard.writeText(window.location.href);
                toast.success('Enlace copiado al portapapeles');
            }
        } else {
            // Fallback: copiar al portapapeles
            navigator.clipboard.writeText(window.location.href);
            toast.success('Enlace copiado al portapapeles');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Cargando proyecto...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
                        <p className="text-muted-foreground mb-6">El proyecto que buscas no existe o no está disponible.</p>
                        <Button asChild>
                            <Link href="/projects">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver a proyectos
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const images = project.image_urls || (project as any).imageUrls || [];
    const hasImages = images && images.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Button asChild variant="ghost">
                        <Link href="/projects">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a proyectos
                        </Link>
                    </Button>
                    <Button onClick={handleShare} variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contenido principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header del proyecto */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                            <p className="text-xl text-muted-foreground mb-6">{project.description}</p>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(project.created_at || (project as any).createdAt || '').toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                    {project.view_count || (project as any).viewCount || 0} vistas
                                </div>
                            </div>

                            {/* Tecnologías */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.technologies?.filter(t => t.enabled).map((tech, index) => (
                                    <div key={index} className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-background">
                                        {tech.icon && (
                                            <img
                                                src={tech.icon}
                                                alt={tech.name}
                                                className="w-4 h-4"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <span className="text-sm font-medium">{tech.name}</span>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Demo del Proyecto */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Demo del Proyecto</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProjectDemo project={project} />
                            </CardContent>
                        </Card>

                        {/* Galería de imágenes */}
                        {hasImages && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Galería del proyecto</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Imagen principal */}
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={getImageUrl(images[currentImageIndex])}
                                                alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Miniaturas */}
                                        {images.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {images.map((image: any, index: number) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${index === currentImageIndex
                                                            ? 'border-primary'
                                                            : 'border-transparent hover:border-muted-foreground/50'
                                                            }`}
                                                    >
                                                        <img
                                                            src={getImageUrl(image)}
                                                            alt={`${project.title} - Miniatura ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Descripción detallada */}
                        {((project as any).longDescription || (project as any).long_description) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Descripción detallada</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                            {(project as any).longDescription || (project as any).long_description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Información del proyecto */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del proyecto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Estado</h4>
                                    <Badge variant={(project as any).isPublished || (project as any).is_published ? "default" : "secondary"}>
                                        {(project as any).isPublished || (project as any).is_published ? "Publicado" : "En desarrollo"}
                                    </Badge>
                                </div>

                                {((project as any).isFeatured || (project as any).is_featured) && (
                                    <div>
                                        <h4 className="font-medium mb-2">Destacado</h4>
                                        <Badge variant="outline">Proyecto destacado</Badge>
                                    </div>
                                )}

                                <Separator />

                                <div>
                                    <h4 className="font-medium mb-3">Tecnologías utilizadas</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.filter(t => t.enabled).map((tech, index) => (
                                            <div key={index} className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                                                {tech.icon && (
                                                    <img
                                                        src={tech.icon}
                                                        alt={tech.name}
                                                        className="w-5 h-5"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                <span className="font-medium">{tech.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {((project as any).githubUrl || (project as any).github_url || (project as any).demoUrl || (project as any).demo_url) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="font-medium mb-2">Enlaces</h4>
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Ver sección de Demo arriba</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Call to action */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Te gusta este proyecto?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Si tienes un proyecto similar en mente o quieres colaborar, no dudes en contactarme.
                                </p>
                                <div className="space-y-2">
                                    <Button asChild className="w-full">
                                        <Link href="/contact">
                                            Contactar
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/projects">
                                            Ver más proyectos
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
