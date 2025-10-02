'use client';

import { DashboardStats } from '@/components/admin/DashboardStats';
import { PermissionGuard } from '@/components/shared/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Permission, usePermissions } from '@/hooks/usePermissions';
import { useAuthStore } from '@/store/auth';
import { useProjectsStore } from '@/store/projects';
import { Eye, FileText, FolderPlus, Pencil, Settings, Upload } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const { featuredProjects, fetchFeaturedProjects } = useProjectsStore();
    const { hasPermission } = usePermissions();

    useEffect(() => {
        fetchFeaturedProjects(3);
    }, [fetchFeaturedProjects]);

    const allQuickActions = [
        {
            title: 'Nuevo Proyecto',
            description: 'Crear un nuevo proyecto para el portafolio',
            icon: FolderPlus,
            href: '/admin/projects/new',
            color: 'bg-blue-500',
            permission: 'create_project' as Permission,
        },
        {
            title: 'Gestionar CV',
            description: 'Actualizar información del currículum',
            icon: FileText,
            href: '/admin/cv',
            color: 'bg-green-500',
            permission: 'update_cv' as Permission,
        },
        {
            title: 'Subir Archivos',
            description: 'Gestionar imágenes y demos',
            icon: Upload,
            href: '/admin/uploads',
            color: 'bg-purple-500',
            permission: 'upload_file' as Permission,
        },
        {
            title: 'Configuración',
            description: 'Ajustes del sitio web',
            icon: Settings,
            href: '/admin/settings',
            color: 'bg-orange-500',
            permission: 'manage_settings' as Permission,
        },
    ];

    // Filtrar acciones rápidas según permisos del usuario
    const quickActions = useMemo(() => {
        return allQuickActions.filter(action => hasPermission(action.permission));
    }, [hasPermission]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-muted-foreground">
                    Bienvenido de vuelta, {user?.email}
                </p>
            </div>

            {/* Estadísticas */}
            <DashboardStats />

            {/* Acciones Rápidas */}
            {quickActions.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Card key={action.title} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-lg">{action.title}</CardTitle>
                                        <CardDescription>{action.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href={action.href}>
                                                Ir a {action.title}
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Proyectos Recientes */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Proyectos Destacados</h2>
                    <Button asChild variant="outline">
                        <Link href="/admin/projects">
                            Ver todos
                        </Link>
                    </Button>
                </div>

                {featuredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProjects.map((project) => (
                            <Card key={project.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-1">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            {project.view_count} vistas
                                        </span>
                                        <div className="flex gap-2">
                                            {/* Botón Ver - Todos pueden ver */}
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/projects/${project.slug}`}>
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Ver
                                                </Link>
                                            </Button>
                                            {/* Botón Editar - Solo con permiso */}
                                            <PermissionGuard permission="update_project">
                                                <Button asChild size="sm" variant="default">
                                                    <Link href={`/admin/projects/${project.id}`}>
                                                        <Pencil className="w-4 h-4 mr-1" />
                                                        Editar
                                                    </Link>
                                                </Button>
                                            </PermissionGuard>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">
                                No hay proyectos destacados aún.
                            </p>
                            <PermissionGuard permission="create_project">
                                <Button asChild className="mt-4">
                                    <Link href="/admin/projects/new">
                                        Crear primer proyecto
                                    </Link>
                                </Button>
                            </PermissionGuard>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
