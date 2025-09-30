import { api } from '@/lib/api';
import type { Metadata } from 'next';
import ProjectDetailClient from '@/components/pages/ProjectDetailClient';

type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const project = await api.getProject(params.slug) as any;

        return {
            title: project.title,
            description: project.description,
            openGraph: {
                title: `${project.title} | Portfolio Personal`,
                description: project.description,
                images: project.image_urls && project.image_urls.length > 0
                    ? [{ url: project.image_urls[0] }]
                    : project.thumbnail_url
                        ? [{ url: project.thumbnail_url }]
                        : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${project.title} | Portfolio Personal`,
                description: project.description,
                images: project.image_urls && project.image_urls.length > 0
                    ? [project.image_urls[0]]
                    : project.thumbnail_url
                        ? [project.thumbnail_url]
                        : [],
            },
        };
    } catch (error) {
        return {
            title: 'Proyecto no encontrado',
            description: 'El proyecto que buscas no existe o no está disponible.',
        };
    }
}

export default function ProjectDetailPage() {
    return <ProjectDetailClient />;
}
