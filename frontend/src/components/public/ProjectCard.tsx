'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/lib/api';
import { Project } from '@/types/api';
import { Eye, Github, Play } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
    project: Project;
    showViewCount?: boolean;
    variant?: 'vertical' | 'horizontal';
}

export function ProjectCard({ project, showViewCount = true, variant = 'vertical' }: ProjectCardProps) {

    if (variant === 'horizontal') {
        return (
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Imagen o Video del proyecto */}
                    <div className="relative md:w-80 aspect-video md:aspect-square overflow-hidden bg-black">
                        {/* Si hay video, mostrarlo */}
                        {project.demo_video_url && project.demo_video_type ? (
                            project.demo_video_type === 'youtube' ? (
                                // Video de YouTube como thumbnail
                                <div className="relative w-full h-full">
                                    <img
                                        src={project.demo_video_thumbnail || `https://img.youtube.com/vi/${project.demo_video_url.split('/').pop()}/maxresdefault.jpg`}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                                            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Video local
                                <video
                                    src={getImageUrl(project.demo_video_url)}
                                    poster={project.demo_video_thumbnail ? getImageUrl(project.demo_video_thumbnail) : undefined}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                    onMouseEnter={(e) => e.currentTarget.play()}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            )
                        ) : (
                            // Si no hay video, mostrar imagen o placeholder
                            (project.thumbnail_url || (project.image_urls && project.image_urls.length > 0)) ? (
                                <img
                                    src={getImageUrl(project.thumbnail_url || project.image_urls?.[0] || '')}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-muted-foreground">
                                        {project.title.charAt(0)}
                                    </span>
                                </div>
                            )
                        )}

                        {/* Badge de destacado */}
                        {project.is_featured && (
                            <div className="absolute top-2 right-2 z-10">
                                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                    Destacado
                                </Badge>
                            </div>
                        )}

                        {/* Indicador de video */}
                        {project.demo_video_url && (
                            <div className="absolute top-2 left-2 z-10">
                                <Badge variant="secondary" className="bg-background/80 text-foreground">
                                    <Play className="w-3 h-3 mr-1" />
                                    Video
                                </Badge>
                            </div>
                        )}

                        {/* Contador de vistas */}
                        {showViewCount && (
                            <div className="absolute bottom-2 left-2 z-10">
                                <Badge variant="secondary" className="bg-background/80 text-foreground">
                                    <Eye className="w-3 h-3 mr-1" />
                                    {project.view_count || 0}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-2xl">{project.title}</CardTitle>
                            <CardDescription className="line-clamp-3">
                                {project.short_description || project.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1">
                            {/* Tecnologías */}
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.filter(t => t.enabled).slice(0, 6).map((tech, index) => (
                                    <div key={index} className="flex items-center gap-1.5 px-2.5 py-1.5 border rounded-md bg-background text-sm">
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
                                        <span>{tech.name}</span>
                                    </div>
                                ))}
                                {(project.technologies?.filter(t => t.enabled).length || 0) > 6 && (
                                    <Badge variant="outline">
                                        +{(project.technologies?.filter(t => t.enabled).length || 0) - 6} más
                                    </Badge>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between">
                            <div className="flex space-x-2">
                                {project.github_url && (
                                    <Button asChild size="sm" variant="outline">
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center"
                                        >
                                            <Github className="w-4 h-4 mr-1" />
                                            Código
                                        </a>
                                    </Button>
                                )}
                            </div>

                            <Button asChild size="sm">
                                <Link href={`/projects/${project.slug}`}>
                                    Ver detalles
                                </Link>
                            </Button>
                        </CardFooter>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Imagen o Video del proyecto */}
            <div className="relative aspect-video overflow-hidden bg-black">
                {/* Si hay video, mostrarlo */}
                {project.demo_video_url && project.demo_video_type ? (
                    project.demo_video_type === 'youtube' ? (
                        // Video de YouTube como thumbnail
                        <div className="relative w-full h-full">
                            <img
                                src={project.demo_video_thumbnail || `https://img.youtube.com/vi/${project.demo_video_url.split('/').pop()}/maxresdefault.jpg`}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Video local
                        <video
                            src={getImageUrl(project.demo_video_url)}
                            poster={project.demo_video_thumbnail ? getImageUrl(project.demo_video_thumbnail) : undefined}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                            }}
                        />
                    )
                ) : (
                    // Si no hay video, mostrar imagen o placeholder
                    (project.thumbnail_url || (project.image_urls && project.image_urls.length > 0)) ? (
                        <img
                            src={getImageUrl(project.thumbnail_url || project.image_urls?.[0] || '')}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="text-4xl font-bold text-muted-foreground">
                                {project.title.charAt(0)}
                            </span>
                        </div>
                    )
                )}

                {/* Badge de destacado */}
                {project.is_featured && (
                    <div className="absolute top-2 right-2 z-10">
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                            Destacado
                        </Badge>
                    </div>
                )}

                {/* Indicador de video */}
                {project.demo_video_url && (
                    <div className="absolute bottom-2 right-2 z-10">
                        <Badge variant="secondary" className="bg-background/80 text-foreground">
                            <Play className="w-3 h-3 mr-1" />
                            Video
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader>
                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {project.short_description || project.description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Tecnologías */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.filter(t => t.enabled).slice(0, 4).map((tech, index) => (
                        <div key={index} className="flex items-center gap-1.5 px-2.5 py-1 border rounded-md bg-background text-xs">
                            {tech.icon && (
                                <img
                                    src={tech.icon}
                                    alt={tech.name}
                                    className="w-3.5 h-3.5"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                            <span>{tech.name}</span>
                        </div>
                    ))}
                    {(project.technologies?.filter(t => t.enabled).length || 0) > 4 && (
                        <Badge variant="outline" className="text-xs">
                            +{(project.technologies?.filter(t => t.enabled).length || 0) - 4}
                        </Badge>
                    )}
                </div>

                {/* Contador de vistas */}
                {showViewCount && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="w-4 h-4 mr-1" />
                        {project.view_count || 0} vistas
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                    {project.github_url && (
                        <Button asChild size="sm" variant="outline">
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <Github className="w-4 h-4 mr-1" />
                                Código
                            </a>
                        </Button>
                    )}
                </div>

                <Button asChild size="sm">
                    <Link href={`/projects/${project.slug}`}>
                        Ver más
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
