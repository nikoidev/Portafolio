'use client';

import { ProjectForm } from '@/components/admin/ProjectForm';
import { useProjectsStore } from '@/store/projects';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function EditProjectPage() {
    const params = useParams();
    const projectId = parseInt(params.id as string);

    const {
        projects,
        currentProject,
        isLoading,
        fetchProject,
        updateProject
    } = useProjectsStore();

    useEffect(() => {
        // Intentar encontrar el proyecto en la lista actual primero
        const existingProject = projects.find(p => p.id === projectId);
        if (existingProject) {
            // Si ya tenemos el proyecto, no necesitamos hacer otra petición
            return;
        }

        // Si no lo tenemos, hacer fetch del proyecto específico
        fetchProject(projectId.toString());
    }, [projectId, projects, fetchProject]);

    const project = projects.find(p => p.id === projectId) || currentProject;

    const handleSubmit = async (data: any) => {
        return await updateProject(projectId, data);
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
                <p className="text-muted-foreground">
                    Modificar "{project.title}"
                </p>
            </div>

            <ProjectForm
                project={project}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
}
