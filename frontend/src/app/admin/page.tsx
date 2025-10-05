'use client';

import { DashboardStats } from '@/components/admin/DashboardStats';
import { PermissionGuard } from '@/components/shared/PermissionGuard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Permission, usePermissions } from '@/hooks/usePermissions';
import { useAuthStore } from '@/store/auth';
import { useProjectsStore } from '@/store/projects';
import { Eye, FileText, FolderPlus, Pencil, Settings } from 'lucide-react';
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

    const isViewer = useMemo(() => {
        return user?.role === 'viewer';
    }, [user?.role]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-muted-foreground">
                    Bienvenido de vuelta, {user?.email}
                </p>
            </div>

            {/* Banner informativo para Visualizadores */}
            {isViewer && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <Eye className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    Modo Solo Lectura
                                </h3>
                                <p className="text-sm text-blue-800 mb-3">
                                    Tu rol de <strong>Visualizador</strong> te permite ver todo el contenido del portafolio
                                    sin poder modificarlo. Puedes revisar proyectos, analíticas y contenido del sitio.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                                        ✓ Ver proyectos
                                    </Badge>
                                    <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                                        ✓ Ver estadísticas
                                    </Badge>
                                    <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                                        ✓ Ver contenido
                                    </Badge>
                                    <Badge variant="outline" className="bg-white text-red-700 border-red-300">
                                        ✗ Editar contenido
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Estadísticas */}
            <DashboardStats />

            {/* Acciones Rápidas o Enlaces Rápidos según el rol */}
            {quickActions.length > 0 ? (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold">Acciones Rápidas</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            const gradients = [
                                'from-blue-500 to-cyan-500',
                                'from-green-500 to-emerald-500',
                                'from-purple-500 to-pink-500',
                                'from-orange-500 to-red-500',
                            ];
                            return (
                                <Link key={action.title} href={action.href}>
                                    <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
                                        {/* Fondo con gradiente animado */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                        <CardContent className="relative flex flex-col items-center justify-center text-center py-8">
                                            {/* Icono con efecto hover */}
                                            <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ) : isViewer && (
                /* Enlaces Rápidos para Visualizadores */
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-blue-500 rounded-full" />
                        <h2 className="text-2xl font-bold">Enlaces Rápidos</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Eye, title: 'Ver Proyectos', desc: 'Explora todos los proyectos del portafolio', href: '/admin/projects', gradient: 'from-blue-500 to-cyan-500' },
                            { icon: FileText, title: 'Contenido del Sitio', desc: 'Revisa el contenido de las páginas', href: '/admin/cms', gradient: 'from-green-500 to-emerald-500' },
                            { icon: FolderPlus, title: 'Sitio Público', desc: 'Ve cómo se muestra el portafolio', href: '/', gradient: 'from-purple-500 to-pink-500' }
                        ].map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link key={link.title} href={link.href}>
                                    <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                        <CardContent className="relative flex flex-col items-center justify-center text-center py-8">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${link.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {link.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {link.desc}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Proyectos Destacados */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-yellow-500 rounded-full" />
                        <h2 className="text-2xl font-bold">Proyectos Destacados</h2>
                    </div>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/admin/projects">
                            Ver todos
                            <span>→</span>
                        </Link>
                    </Button>
                </div>

                {featuredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProjects.map((project, index) => {
                            const gradients = [
                                'from-violet-500 to-purple-500',
                                'from-cyan-500 to-blue-500',
                                'from-amber-500 to-orange-500',
                            ];
                            return (
                                <Card key={project.id} className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                                    {/* Badge de destacado */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white border-0 shadow-lg`}>
                                            ⭐ Destacado
                                        </Badge>
                                    </div>

                                    {/* Gradiente de fondo */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                    <CardHeader className="relative pb-3">
                                        <CardTitle className="text-lg line-clamp-1 pr-20 group-hover:text-primary transition-colors">
                                            {project.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 mt-2">
                                            {project.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        {/* Contador de vistas */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <Eye className="w-4 h-4" />
                                            <span className="font-medium">{project.view_count}</span>
                                            <span>vistas</span>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex gap-2">
                                            <Button asChild size="sm" variant="outline" className="flex-1 group/btn">
                                                <Link href={`/projects/${project.slug}`}>
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Ver
                                                </Link>
                                            </Button>
                                            <PermissionGuard permission="update_project">
                                                <Button asChild size="sm" className="flex-1">
                                                    <Link href={`/admin/projects/${project.id}`}>
                                                        <Pencil className="w-4 h-4 mr-1" />
                                                        Editar
                                                    </Link>
                                                </Button>
                                            </PermissionGuard>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-2 border-dashed">
                        <CardContent className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                <FolderPlus className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No hay proyectos destacados</h3>
                            <p className="text-muted-foreground mb-6">
                                Crea tu primer proyecto y márcalo como destacado para que aparezca aquí
                            </p>
                            <PermissionGuard permission="create_project">
                                <Button asChild className="gap-2">
                                    <Link href="/admin/projects/new">
                                        <FolderPlus className="w-4 h-4" />
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
