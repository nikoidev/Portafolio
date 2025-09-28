'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectsStore } from '@/store/projects';
import { BarChart3, Eye, FolderOpen, Star } from 'lucide-react';
import { useEffect } from 'react';

export function DashboardStats() {
    const { stats, isLoading, fetchProjectStats } = useProjectsStore();

    useEffect(() => {
        fetchProjectStats();
    }, [fetchProjectStats]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No se pudieron cargar las estadísticas</p>
            </div>
        );
    }

    const statsCards = [
        {
            title: 'Total Proyectos',
            value: stats.total_projects,
            icon: FolderOpen,
            description: 'Proyectos creados',
        },
        {
            title: 'Publicados',
            value: stats.published_projects,
            icon: BarChart3,
            description: 'Proyectos públicos',
        },
        {
            title: 'Destacados',
            value: stats.featured_projects,
            icon: Star,
            description: 'Proyectos destacados',
        },
        {
            title: 'Total Vistas',
            value: stats.total_views,
            icon: Eye,
            description: 'Vistas acumuladas',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
