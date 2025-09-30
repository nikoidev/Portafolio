'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { Project } from '@/types/api';
import { ArrowLeft, Calendar, ExternalLink, Eye, Github, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const slug = params.slug as string;

    useEffect(() => {
        const loadProject = async () => {
            try {
                setIsLoading(true);
                const data = await api.getProject(slug);
                setProject(data);

                // Incrementar contador de vistas
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${data.id}/view`, {
                        method: 'POST',
                    });
                } catch (error) {
                    // Silenciar error de vista, no es crítico
                }
            } catch (error: any) {
                toast.error('Proyecto no encontrado');
                router.push('/projects');
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            loadProject();
        }
    }, [slug, router]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: project?.title,
                    text: project?.description,
                    url: window.location.href,
                });
            } catch (error) {
                // Usuario canceló o error
            }
        } else {
            // Fallback: copiar al portapapeles
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Enlace copiado al portapapeles');
            } catch (error) {
                toast.error('No se pudo copiar el enlace');
            }
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
                        <Button asChild>
                            <Link href="/projects">
                                Volver a proyectos
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const images = project.image_urls && project.image_urls.length > 0
        ? project.image_urls
        : project.thumbnail_url
            ? [project.thumbnail_url]
            : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                {/* Navegación */}
                <div className="mb-8">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/projects" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Volver a proyectos
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contenido principal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header del proyecto */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                                    <p className="text-xl text-muted-foreground">
                                        {project.description}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleShare}>
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.is_featured && (
                                    <Badge className="bg-primary text-primary-foreground">
                                        Destacado
                                    </Badge>
                                )}
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {project.view_count || 0} vistas
                                </Badge>
                                {project.createdAt && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(project.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long'
                                        })}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Galería de imágenes */}
                        {images.length > 0 && (
                            <Card>
                                <CardContent className="p-0">
                                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                        <Image
                                            src={images[currentImageIndex]}
                                            alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {images.length > 1 && (
                                        <div className="p-4">
                                            <div className="flex gap-2 overflow-x-auto">
                                                {images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${index === currentImageIndex
                                                                ? 'border-primary'
                                                                : 'border-transparent hover:border-muted-foreground/50'
                                                            }`}
                                                    >
                                                        <Image
                                                            src={image}
                                                            alt={`Miniatura ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Descripción detallada */}
                        {project.long_description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Descripción del Proyecto</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                                        {project.long_description.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-4 last:mb-0">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Demo integrado */}
                        {project.demo_type === 'iframe' && project.demo_url && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Demo en Vivo</CardTitle>
                                    <CardDescription>
                                        Prueba el proyecto directamente desde aquí
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative aspect-video rounded-lg overflow-hidden">
                                        <iframe
                                            src={project.demo_url}
                                            className="w-full h-full border-0"
                                            title={`Demo de ${project.title}`}
                                            loading="lazy"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Enlaces del proyecto */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Enlaces</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {project.github_url && (
                                    <Button asChild className="w-full justify-start" variant="outline">
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2"
                                        >
                                            <Github className="w-4 h-4" />
                                            Ver código fuente
                                        </a>
                                    </Button>
                                )}

                                {project.live_demo_url && (
                                    <Button asChild className="w-full justify-start">
                                        <a
                                            href={project.live_demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Ver demo en vivo
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tecnologías */}
                        {project.technologies && project.technologies.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tecnologías Utilizadas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech) => (
                                            <Badge key={tech} variant="secondary">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Información adicional */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Proyecto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {project.createdAt && (
                                    <div>
                                        <h4 className="font-medium mb-1">Fecha de creación</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(project.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}

                                <Separator />

                                <div>
                                    <h4 className="font-medium mb-1">Vistas</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {project.view_count || 0} visualizaciones
                                    </p>
                                </div>

                                {project.is_featured && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="font-medium mb-1">Estado</h4>
                                            <Badge className="bg-primary text-primary-foreground">
                                                Proyecto destacado
                                            </Badge>
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
                                    Si tienes alguna pregunta o quieres colaborar, no dudes en contactarme.
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
