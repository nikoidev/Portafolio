'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { ProjectCard } from '@/components/public/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCMSContent } from '@/hooks/useCMSContent';
import { api } from '@/lib/api';
import { Project } from '@/types/api';
import { ArrowUpDown, Filter, Grid, List, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProjectsClient() {
    // CMS Content
    const { content: headerContent, isLoading: headerLoading, refresh: refreshHeader } = useCMSContent('projects', 'header');
    const { content: filtersContent, isLoading: filtersLoading, refresh: refreshFilters } = useCMSContent('projects', 'filters');
    const { content: ctaContent, isLoading: ctaLoading, refresh: refreshCta } = useCMSContent('projects', 'cta');

    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const defaultHeader = {
        title: 'Mis Proyectos',
        description: 'Explora mi colección de proyectos de desarrollo web, aplicaciones móviles y más. Cada proyecto representa un desafío único y una oportunidad de aprendizaje.'
    };

    const defaultFilters = {
        title: 'Filtros y Búsqueda',
        description: 'Encuentra proyectos específicos usando los filtros y la búsqueda',
        search_placeholder: 'Buscar proyectos por nombre, descripción o tecnología...'
    };

    const defaultCta = {
        title: '¿Te interesa mi trabajo?',
        description: 'Si tienes algún proyecto en mente o quieres colaborar, no dudes en contactarme.',
        button_primary_text: 'Contactar',
        button_primary_url: '/contact',
        button_secondary_text: 'Descargar CV',
        button_secondary_url: '#' // Se manejará con onClick
    };

    const header = headerContent || defaultHeader;
    const filters = filtersContent || defaultFilters;
    const cta = ctaContent || defaultCta;

    // Obtener todas las tecnologías únicas
    const allTechnologies = Array.from(
        new Set(
            projects.flatMap(project =>
                (project.technologies || [])
                    .filter(t => t.enabled)
                    .map(t => t.name)
            )
        )
    ).sort();

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setIsLoading(true);
                const data = await api.getProjects({ limit: 100 }) as any;
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
                    tech.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Filtrar por tecnología
        if (selectedTechnology) {
            filtered = filtered.filter(project =>
                project.technologies?.some(tech => tech.name === selectedTechnology)
            );
        }

        // Ordenar
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'date':
                    comparison = new Date((a as any).createdAt || (a as any).created_at || '').getTime() - new Date((b as any).createdAt || (b as any).created_at || '').getTime();
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

    const isLoadingData = isLoading || headerLoading || filtersLoading || ctaLoading;

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
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
                <EditableSection pageKey="projects" sectionKey="header" onContentUpdate={refreshHeader}>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {header.title}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {header.description}
                        </p>
                    </div>
                </EditableSection>

                {/* Filtros y controles */}
                <EditableSection pageKey="projects" sectionKey="filters" onContentUpdate={refreshFilters}>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                {filters.title}
                            </CardTitle>
                            <CardDescription>
                                {filters.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Barra de búsqueda */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder={filters.search_placeholder}
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
                </EditableSection>

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
                    <EditableSection pageKey="projects" sectionKey="cta" onContentUpdate={refreshCta}>
                        <div className="text-center mt-16">
                            <Card className="max-w-2xl mx-auto border-primary/20">
                                <CardContent className="pt-8 pb-8">
                                    <h3 className="text-2xl font-bold mb-4">{cta.title}</h3>
                                    <p className="text-muted-foreground mb-6">
                                        {cta.description}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button asChild size="lg">
                                            <a href={cta.button_primary_url || cta.button_url}>
                                                {cta.button_primary_text || cta.button_text}
                                            </a>
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            onClick={() => window.open(api.getCVDownloadURL(), '_blank')}
                                        >
                                            {cta.button_secondary_text || 'Descargar CV'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </EditableSection>
                )}
            </div>
        </div>
    );
}
