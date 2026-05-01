'use client';

import { DashboardStats } from '@/components/admin/DashboardStats';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectsStore } from '@/store/projects';
import { Eye, FolderPlus, Pencil, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

const QUICK_ACTIONS = [
    {
        title: 'Nuevo Proyecto',
        description: 'Crear un nuevo proyecto para el portafolio',
        icon: FolderPlus,
        href: '/admin/projects/new',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        title: 'Gestión Web',
        description: 'Editar contenido de las páginas del sitio',
        icon: Pencil,
        href: '/admin/cms',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        title: 'Configuración',
        description: 'Ajustes del sitio web',
        icon: Settings,
        href: '/admin/settings',
        gradient: 'from-orange-500 to-red-500',
    },
];

export default function AdminDashboard() {
    const { data: session } = useSession();
    const { featuredProjects, fetchFeaturedProjects } = useProjectsStore();

    useEffect(() => {
        fetchFeaturedProjects(3);
    }, [fetchFeaturedProjects]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-muted-foreground">
                    Bienvenido de vuelta, {session?.user?.email}
                </p>
            </div>

            <DashboardStats />

            {/* Acciones Rápidas */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold">Acciones Rápidas</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {QUICK_ACTIONS.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.title} href={action.href}>
                                <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                    <CardContent className="relative flex flex-col items-center justify-center text-center py-8">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{action.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Proyectos Destacados */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-yellow-500 rounded-full" />
                        <h2 className="text-2xl font-bold">Proyectos Destacados</h2>
                    </div>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/admin/projects">Ver todos →</Link>
                    </Button>
                </div>

                {featuredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProjects.map((project, index) => {
                            const gradients = ['from-violet-500 to-purple-500', 'from-cyan-500 to-blue-500', 'from-amber-500 to-orange-500'];
                            return (
                                <Card key={project.id} className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white border-0 shadow-lg`}>
                                            ⭐ Destacado
                                        </Badge>
                                    </div>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                    <CardHeader className="relative pb-3">
                                        <CardTitle className="text-lg line-clamp-1 pr-20 group-hover:text-primary transition-colors">
                                            {project.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <Eye className="w-4 h-4" />
                                            <span className="font-medium">{project.view_count}</span>
                                            <span>vistas</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button asChild size="sm" variant="outline" className="flex-1">
                                                <Link href={`/projects/${project.slug}`}>
                                                    <Eye className="w-4 h-4 mr-1" />Ver
                                                </Link>
                                            </Button>
                                            <Button asChild size="sm" className="flex-1">
                                                <Link href={`/admin/projects/${project.slug}`}>
                                                    <Pencil className="w-4 h-4 mr-1" />Editar
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-muted-foreground mb-4">No hay proyectos destacados aún</p>
                            <Button asChild>
                                <Link href="/admin/projects/new">
                                    <FolderPlus className="w-4 h-4 mr-2" />Crear primer proyecto
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
