'use client';

import { ProjectCard } from '@/components/public/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Project } from '@/types/api';
import { ArrowUpDown, Filter, Grid, List, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Obtener todas las tecnologías únicas
    const allTechnologies = Array.from(
        new Set(projects.flatMap(project => project.technologies || []))
    ).sort();

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setIsLoading(true);
                const data = await api.getProjects({ limit: 100 });
                setProjects(data);
                setFilteredProjects(data);
            } catch (error: any) {
                toast.error('Error al cargar los proyectos');
                console.error('Error loading projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProjects();
    }, []);

    // Filtrar y ordenar proyectos
    useEffect(() => {
        let filtered = [...projects];

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.technologies?.some(tech =>
                    tech.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Filtrar por tecnología
        if (selectedTechnology) {
            filtered = filtered.filter(project =>
                project.technologies?.includes(selectedTechnology)
            );
        }

        // Ordenar
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
                    break;
                case 'views':
                    comparison = (a.view_count || 0) - (b.view_count || 0);
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        setFilteredProjects(filtered);
    }, [projects, searchTerm, selectedTechnology, sortBy, sortOrder]);

    const toggleSort = (newSortBy: 'date' | 'views' | 'title') => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Cargando proyectos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Mis Proyectos
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explora mi colección de proyectos de desarrollo web, aplicaciones móviles y más.
                        Cada proyecto representa un desafío único y una oportunidad de aprendizaje.
                    </p>
                </div>

                {/* Filtros y controles */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filtros y Búsqueda
                        </CardTitle>
                        <CardDescription>
                            Encuentra proyectos específicos usando los filtros y la búsqueda
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Barra de búsqueda */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Buscar proyectos por nombre, descripción o tecnología..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filtros de tecnología */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Tecnologías</label>
                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    variant={selectedTechnology === null ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedTechnology(null)}
                                >
                                    Todas
                                </Badge>
                                {allTechnologies.map((tech) => (
                                    <Badge
                                        key={tech}
                                        variant={selectedTechnology === tech ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => setSelectedTechnology(tech)}
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Controles de vista y ordenación */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Vista:</span>
                                <div className="flex border rounded-lg">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="rounded-r-none"
                                    >
                                        <Grid className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="rounded-l-none"
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Ordenar por:</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleSort('date')}
                                    className="gap-1"
                                >
                                    Fecha
                                    {sortBy === 'date' && <ArrowUpDown className="w-3 h-3" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleSort('views')}
                                    className="gap-1"
                                >
                                    Vistas
                                    {sortBy === 'views' && <ArrowUpDown className="w-3 h-3" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleSort('title')}
                                    className="gap-1"
                                >
                                    Nombre
                                    {sortBy === 'title' && <ArrowUpDown className="w-3 h-3" />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resultados */}
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        Mostrando {filteredProjects.length} de {projects.length} proyectos
                        {selectedTechnology && (
                            <span> filtrados por <Badge variant="secondary" className="ml-1">{selectedTechnology}</Badge></span>
                        )}
                    </p>
                </div>

                {/* Lista de proyectos */}
                {filteredProjects.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="text-muted-foreground">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No se encontraron proyectos</h3>
                                <p>
                                    {searchTerm || selectedTechnology
                                        ? 'Intenta ajustar los filtros de búsqueda'
                                        : 'Aún no hay proyectos disponibles'
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-6'
                    }>
                        {filteredProjects.map((project) => (
                            <div key={project.id} className={viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}>
                                <ProjectCard
                                    project={project}
                                    showViewCount={true}
                                    variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Call to action */}
                {filteredProjects.length > 0 && (
                    <div className="text-center mt-16">
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="pt-6">
                                <h3 className="text-2xl font-bold mb-4">¿Te interesa mi trabajo?</h3>
                                <p className="text-muted-foreground mb-6">
                                    Si tienes algún proyecto en mente o quieres colaborar, no dudes en contactarme.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild size="lg">
                                        <a href="/contact">
                                            Contactar
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline" size="lg">
                                        <a href="/cv/download" target="_blank">
                                            Descargar CV
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
