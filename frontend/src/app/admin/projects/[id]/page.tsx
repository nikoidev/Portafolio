'use client';

import { ProjectForm } from '@/components/admin/ProjectForm';
import { useProjectsStore } from '@/store/projects';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function EditProjectPage() {
    const params = useParams();
    // The [id] segment now holds the project slug (cuid or slug string)
    const projectSlug = params.id as string;

    const { projects, currentProject, isLoading, fetchProject, updateProject } = useProjectsStore();

    useEffect(() => {
        const existing = projects.find(p => p.id === projectSlug || p.slug === projectSlug);
        if (!existing) {
            fetchProject(projectSlug);
        }
    }, [projectSlug, projects, fetchProject]);

    const project = projects.find(p => p.id === projectSlug || p.slug === projectSlug) || currentProject;

    const handleSubmit = async (data: any) => {
        const slug = project?.slug ?? projectSlug;
        return await updateProject(slug, data);
    };

    if (isLoading || !project) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Cargando proyecto...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Editar Proyecto</h1>
                <p className="text-muted-foreground">Modificar "{project.title}"</p>
            </div>
            <ProjectForm project={project} onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
}
