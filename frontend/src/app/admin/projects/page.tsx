'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProjectsStore } from '@/store/projects';
import { Eye, Github, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminProjectsPage() {
    const { projects, isLoading, error, fetchProjects, deleteProject } = useProjectsStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchProjects({ include_unpublished: true });
    }, [fetchProjects]);

    const handleDelete = async (projectId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            setDeleteLoading(projectId);
            await deleteProject(projectId);
            setDeleteLoading(null);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Cargando proyectos...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
                    <p className="text-muted-foreground">
                        Administra todos tus proyectos del portafolio
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/projects/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Proyecto
                    </Link>
                </Button>
            </div>

            {/* Buscador */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar proyectos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lista de proyectos */}
            {error ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-destructive">Error: {error}</p>
                        <Button
                            onClick={() => fetchProjects({ include_unpublished: true })}
                            variant="outline"
                            className="mt-4"
                        >
                            Reintentar
                        </Button>
                    </CardContent>
                </Card>
            ) : filteredProjects.length > 0 ? (
                <div className="grid gap-6">
                    {filteredProjects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <CardTitle className="text-xl">
                                                {project.title}
                                            </CardTitle>
                                            <div className="flex space-x-1">
                                                {project.is_published ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                        Publicado
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                                        Borrador
                                                    </span>
                                                )}
                                                {project.is_featured && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                        Destacado
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <CardDescription className="mt-2">
                                            {project.short_description || project.description}
                                        </CardDescription>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center">
                                                <Eye className="w-4 h-4 mr-1" />
                                                {project.view_count} vistas
                                            </span>
                                            <span>
                                                {project.technologies.length} tecnologías
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {project.github_url && (
                                            <Button asChild size="sm" variant="outline">
                                                <a
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/admin/projects/${project.id}`}>
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(project.id)}
                                            disabled={deleteLoading === project.id}
                                        >
                                            {deleteLoading === project.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-1">
                                    {project.technologies.slice(0, 5).map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 5 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                            +{project.technologies.length - 5} más
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            {searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos creados aún'}
                        </p>
                        {!searchTerm && (
                            <Button asChild>
                                <Link href="/admin/projects/new">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear primer proyecto
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
