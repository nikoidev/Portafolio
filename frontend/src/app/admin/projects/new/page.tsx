'use client';

import { ProjectForm } from '@/components/admin/ProjectForm';
import { useProjectsStore } from '@/store/projects';

export default function NewProjectPage() {
    const { createProject, isLoading } = useProjectsStore();

    const handleSubmit = async (data: any) => {
        return await createProject(data);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Nuevo Proyecto</h1>
                <p className="text-muted-foreground">
                    Crea un nuevo proyecto para tu portafolio
                </p>
            </div>

            <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
}
