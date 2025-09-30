'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types/api';
import { ExternalLink, Eye, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
    project: Project;
    showViewCount?: boolean;
}

export function ProjectCard({ project, showViewCount = true }: ProjectCardProps) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Imagen del proyecto */}
            <div className="relative aspect-video overflow-hidden">
                {(project.thumbnail_url || (project.image_urls && project.image_urls.length > 0)) ? (
                    <Image
                        src={project.thumbnail_url || project.image_urls?.[0] || ''}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-muted-foreground">
                            {project.title.charAt(0)}
                        </span>
                    </div>
                )}

                {/* Badge de destacado */}
                {project.is_featured && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                            Destacado
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
                <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                        </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 4}
                        </Badge>
                    )}
                </div>

                {/* Contador de vistas */}
                {showViewCount && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="w-4 h-4 mr-1" />
                        {project.view_count} vistas
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

                    {project.live_demo_url && (
                        <Button asChild size="sm" variant="outline">
                            <a
                                href={project.live_demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Demo
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
