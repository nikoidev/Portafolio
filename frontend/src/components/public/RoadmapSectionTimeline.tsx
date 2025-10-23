'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Flame, Target } from 'lucide-react';

interface Skill {
    name: string;
    icon?: string;
    proficiency: number;
    status: 'completed' | 'learning' | 'planned';
}

interface Category {
    name: string;
    icon?: string;
    description?: string;
    skills: Skill[];
}

interface RoadmapSectionProps {
    content: {
        title?: string;
        description?: string;
        categories?: Category[];
    };
}

export function RoadmapSectionTimeline({ content }: RoadmapSectionProps) {
    const { title, description, categories = [] } = content;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'learning':
                return <Flame className="w-4 h-4 text-orange-500" />;
            case 'planned':
                return <Target className="w-4 h-4 text-blue-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'border-green-500/30 bg-green-500/5 hover:border-green-500/50';
            case 'learning':
                return 'border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50';
            case 'planned':
                return 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50';
            default:
                return 'border-muted bg-muted/10';
        }
    };

    const getProgressColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'learning':
                return 'bg-orange-500';
            case 'planned':
                return 'bg-blue-500';
            default:
                return 'bg-muted';
        }
    };

    const calculateCategoryStats = (category: Category): { completed: number; learning: number; planned: number; total: number } => {
        if (category.skills.length === 0) {
            return { completed: 0, learning: 0, planned: 0, total: 0 };
        }

        const stats = category.skills.reduce((acc, skill) => {
            if (skill.status === 'completed') acc.completed++;
            else if (skill.status === 'learning') acc.learning++;
            else if (skill.status === 'planned') acc.planned++;
            return acc;
        }, { completed: 0, learning: 0, planned: 0 });

        return { ...stats, total: category.skills.length };
    };

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
            {/* Background decorativo */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10" />

            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full border border-primary/20">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            Trayectoria de Desarrollo
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                        {title || 'Mi Roadmap Tecnológico'}
                    </h2>
                    {description && (
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}
                </div>

                {/* Timeline Vertical con todas las categorías */}
                <div className="relative space-y-12">
                    {/* Línea de conexión vertical animada */}
                    <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-purple-500/40 to-primary/20">
                        {/* Efecto de pulso que se mueve */}
                        <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse-slow opacity-50" />
                        <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse-slower opacity-30" />
                    </div>

                    {categories.map((category, catIndex) => {
                        const stats = calculateCategoryStats(category);
                        const avgProgress = category.skills.length > 0
                            ? Math.round(category.skills.reduce((sum, s) => sum + s.proficiency, 0) / category.skills.length)
                            : 0;

                        return (
                            <div
                                key={catIndex}
                                className="relative animate-fade-in-up"
                                style={{ animationDelay: `${catIndex * 150}ms` }}
                            >
                                {/* Nodo del timeline */}
                                <div className="absolute left-4 md:left-8 top-0 z-10">
                                    <div className="relative">
                                        {/* Círculo principal */}
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-3xl shadow-xl border-4 border-background">
                                            {category.icon || '📚'}
                                        </div>
                                        {/* Efecto de pulso */}
                                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                                    </div>
                                </div>

                                {/* Contenido de la categoría */}
                                <div className="ml-24 md:ml-32">
                                    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            {/* Header de categoría */}
                                            <div className="mb-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                            {category.name}
                                                        </h3>
                                                        {category.description && (
                                                            <p className="text-muted-foreground text-sm">
                                                                {category.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-4 font-bold text-base px-3 py-1"
                                                    >
                                                        {avgProgress}%
                                                    </Badge>
                                                </div>

                                                {/* Estadísticas mini */}
                                                <div className="flex items-center gap-4 text-xs">
                                                    {stats.completed > 0 && (
                                                        <div className="flex items-center gap-1 text-green-500">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            <span className="font-semibold">{stats.completed} dominadas</span>
                                                        </div>
                                                    )}
                                                    {stats.learning > 0 && (
                                                        <div className="flex items-center gap-1 text-orange-500">
                                                            <Flame className="w-3 h-3" />
                                                            <span className="font-semibold">{stats.learning} aprendiendo</span>
                                                        </div>
                                                    )}
                                                    {stats.planned > 0 && (
                                                        <div className="flex items-center gap-1 text-blue-500">
                                                            <Target className="w-3 h-3" />
                                                            <span className="font-semibold">{stats.planned} planeadas</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Barra de progreso general */}
                                                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 rounded-full"
                                                        style={{ width: `${avgProgress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Grid de habilidades */}
                                            {category.skills && category.skills.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                    {category.skills.map((skill, skillIndex) => (
                                                        <Card
                                                            key={skillIndex}
                                                            className={`group/skill hover:scale-105 transition-all duration-300 border-2 ${getStatusColor(skill.status)}`}
                                                        >
                                                            <CardContent className="p-3">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    {skill.icon && (
                                                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-background/80 flex items-center justify-center group-hover/skill:scale-110 transition-transform shadow-sm">
                                                                            <img
                                                                                src={skill.icon}
                                                                                alt={skill.name}
                                                                                className="w-6 h-6 object-contain"
                                                                                onError={(e) => {
                                                                                    e.currentTarget.style.display = 'none';
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-1">
                                                                            <h4 className="font-semibold text-sm truncate">
                                                                                {skill.name}
                                                                            </h4>
                                                                            <div className="flex-shrink-0">
                                                                                {getStatusIcon(skill.status)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Barra de progreso */}
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center justify-between text-xs">
                                                                        <span className="text-muted-foreground">Dominio</span>
                                                                        <span className="font-bold">{skill.proficiency}%</span>
                                                                    </div>
                                                                    <div className="h-1.5 bg-background rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full transition-all duration-700 ${getProgressColor(skill.status)}`}
                                                                            style={{ width: `${skill.proficiency}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-muted-foreground text-sm">
                                                    No hay habilidades en esta categoría aún.
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Estadísticas globales */}
                <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <Card className="bg-green-500/10 border-green-500/20 hover:scale-105 transition-transform">
                        <CardContent className="pt-6 text-center">
                            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-green-500">
                                {categories.reduce((acc, cat) =>
                                    acc + cat.skills.filter(s => s.status === 'completed').length, 0
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">Dominadas</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-orange-500/10 border-orange-500/20 hover:scale-105 transition-transform">
                        <CardContent className="pt-6 text-center">
                            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-orange-500">
                                {categories.reduce((acc, cat) =>
                                    acc + cat.skills.filter(s => s.status === 'learning').length, 0
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">Aprendiendo</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-500/10 border-blue-500/20 hover:scale-105 transition-transform">
                        <CardContent className="pt-6 text-center">
                            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-blue-500">
                                {categories.reduce((acc, cat) =>
                                    acc + cat.skills.filter(s => s.status === 'planned').length, 0
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">Planeadas</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Estilos para las animaciones personalizadas */}
            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: translateY(0); opacity: 0; }
                    50% { transform: translateY(100%); opacity: 1; }
                }
                @keyframes pulse-slower {
                    0%, 100% { transform: translateY(100%); opacity: 0; }
                    50% { transform: translateY(0); opacity: 0.5; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                .animate-pulse-slower {
                    animation: pulse-slower 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}

