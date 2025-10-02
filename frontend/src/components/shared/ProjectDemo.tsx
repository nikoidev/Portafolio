'use client';

import { Github } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ImageGallery } from './ImageGallery';
import { VideoPlayer } from './VideoPlayer';

interface ProjectDemoProps {
    project: {
        demo_video_type?: string;
        demo_video_url?: string;
        demo_video_thumbnail?: string;
        demo_images?: Array<{ url: string; title?: string; order?: number }>;
        github_url?: string;
    };
    className?: string;
}

export function ProjectDemo({ project, className = '' }: ProjectDemoProps) {
    const hasVideo = project.demo_video_url && project.demo_video_type;
    const hasGallery = project.demo_images && project.demo_images.length > 0;
    const hasGithub = project.github_url;

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Video Section */}
            {hasVideo && (
                <div>
                    <h3 className="text-lg font-semibold mb-3">📹 Video Demostración</h3>
                    <VideoPlayer
                        type={project.demo_video_type as 'youtube' | 'local'}
                        url={project.demo_video_url!}
                        thumbnail={project.demo_video_thumbnail}
                        autoPlay={false}
                        muted={true}
                        loop={true}
                    />
                </div>
            )}

            {/* Gallery Section */}
            {hasGallery && (
                <div>
                    {hasVideo && <Separator className="my-6" />}
                    <h3 className="text-lg font-semibold mb-3">📸 Capturas de Pantalla</h3>
                    <ImageGallery images={project.demo_images!} />
                </div>
            )}

            {/* GitHub Link */}
            {hasGithub && (
                <div>
                    {(hasVideo || hasGallery) && <Separator className="my-6" />}
                    <Button asChild variant="outline" size="lg" className="w-full">
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            Ver Código en GitHub
                        </a>
                    </Button>
                </div>
            )}

            {/* No Demo Available */}
            {!hasVideo && !hasGallery && (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-2">
                        No hay demo disponible para este proyecto
                    </p>
                    {hasGithub && (
                        <Button asChild variant="link" className="mt-2">
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="w-4 h-4 mr-2" />
                                Ver código en GitHub
                            </a>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

