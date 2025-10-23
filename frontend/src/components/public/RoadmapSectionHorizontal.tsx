'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Flame, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

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

export function RoadmapSectionHorizontal({ content }: RoadmapSectionProps) {
    const { title, description, categories = [] } = content;
    const [selectedCategory, setSelectedCategory] = useState<number>(0);

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
                return 'border-green-500 bg-green-500/10';
            case 'learning':
                return 'border-orange-500 bg-orange-500/10';
            case 'planned':
                return 'border-blue-500 bg-blue-500/10';
            default:
                return 'border-muted bg-muted/10';
        }
    };

    const calculateCategoryStats = (category: Category) => {
        if (category.skills.length === 0) return { completed: 0, learning: 0, planned: 0 };

        const stats = category.skills.reduce((acc, skill) => {
            acc[skill.status]++;
            return acc;
        }, { completed: 0, learning: 0, planned: 0 } as Record<string, number>);

        return stats;
    };

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
            {/* Background decorativo */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10" />

            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full border border-primary/20">
                        <TrendingUp className="w-4 h-4 text-primary" />
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

                {/* Timeline Horizontal - Categorías */}
                <div className="relative mb-12">
                    {/* Línea de conexión */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 -translate-y-1/2 hidden md:block" />

                    {/* Categorías como timeline */}
                    <div className="relative grid grid-cols-2 md:flex md:justify-between gap-4 md:gap-2">
                        {categories.map((category, index) => {
                            const stats = calculateCategoryStats(category);
                            const isActive = selectedCategory === index;
                            const totalSkills = category.skills.length;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedCategory(index)}
                                    className={`relative group transition-all duration-300 ${isActive ? 'scale-110 z-10' : 'hover:scale-105'
                                        }`}
                                >
                                    {/* Círculo del timeline */}
                                    <div className={`
                                        mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-4xl
                                        transition-all duration-300 border-4
                                        ${isActive
                                            ? 'bg-gradient-to-br from-primary to-purple-500 border-primary shadow-2xl shadow-primary/50'
                                            : 'bg-card border-muted-foreground/30 hover:border-primary/50'
                                        }
                                    `}>
                                        <span className={isActive ? 'scale-110' : ''}>
                                            {category.icon || '📚'}
                                        </span>
                                    </div>

                                    {/* Nombre de categoría */}
                                    <div className={`
                                        mt-3 text-center transition-colors duration-300
                                        ${isActive ? 'text-primary font-bold' : 'text-muted-foreground font-medium'}
                                    `}>
                                        <p className="text-sm md:text-base">{category.name}</p>
                                        <p className="text-xs opacity-70">{totalSkills} skills</p>
                                    </div>

                                    {/* Indicador de progreso mini */}
                                    <div className="mt-2 flex justify-center gap-1">
                                        {stats.completed > 0 && (
                                            <div className="w-2 h-2 rounded-full bg-green-500" title={`${stats.completed} completadas`} />
                                        )}
                                        {stats.learning > 0 && (
                                            <div className="w-2 h-2 rounded-full bg-orange-500" title={`${stats.learning} aprendiendo`} />
                                        )}
                                        {stats.planned > 0 && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500" title={`${stats.planned} planeadas`} />
                                        )}
                                    </div>

                                    {/* Efecto de pulso para categoría activa */}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Contenido de la categoría seleccionada */}
                <div className="animate-fade-in">
                    {categories[selectedCategory] && (
                        <>
                            {/* Descripción de la categoría */}
                            {categories[selectedCategory].description && (
                                <div className="text-center mb-8">
                                    <p className="text-muted-foreground max-w-2xl mx-auto">
                                        {categories[selectedCategory].description}
                                    </p>
                                </div>
                            )}

                            {/* Skills organizadas por estado */}
                            <div className="space-y-8">
                                {/* Dominadas */}
                                {categories[selectedCategory].skills.filter(s => s.status === 'completed').length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <h3 className="text-xl font-bold text-green-500">
                                                Dominadas
                                            </h3>
                                            <Badge variant="outline" className="border-green-500 text-green-500">
                                                {categories[selectedCategory].skills.filter(s => s.status === 'completed').length}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                            {categories[selectedCategory].skills
                                                .filter(skill => skill.status === 'completed')
                                                .map((skill, idx) => (
                                                    <SkillCard key={idx} skill={skill} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}

                                {/* Aprendiendo */}
                                {categories[selectedCategory].skills.filter(s => s.status === 'learning').length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Flame className="w-5 h-5 text-orange-500" />
                                            <h3 className="text-xl font-bold text-orange-500">
                                                Aprendiendo Activamente
                                            </h3>
                                            <Badge variant="outline" className="border-orange-500 text-orange-500">
                                                {categories[selectedCategory].skills.filter(s => s.status === 'learning').length}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                            {categories[selectedCategory].skills
                                                .filter(skill => skill.status === 'learning')
                                                .map((skill, idx) => (
                                                    <SkillCard key={idx} skill={skill} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}

                                {/* Planeadas */}
                                {categories[selectedCategory].skills.filter(s => s.status === 'planned').length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Target className="w-5 h-5 text-blue-500" />
                                            <h3 className="text-xl font-bold text-blue-500">
                                                En el Roadmap
                                            </h3>
                                            <Badge variant="outline" className="border-blue-500 text-blue-500">
                                                {categories[selectedCategory].skills.filter(s => s.status === 'planned').length}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                            {categories[selectedCategory].skills
                                                .filter(skill => skill.status === 'planned')
                                                .map((skill, idx) => (
                                                    <SkillCard key={idx} skill={skill} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Estadísticas globales */}
                <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <Card className="bg-green-500/10 border-green-500/20">
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
                    <Card className="bg-orange-500/10 border-orange-500/20">
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
                    <Card className="bg-blue-500/10 border-blue-500/20">
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
        </section>
    );
}

// Componente para cada skill card
function SkillCard({ skill }: { skill: Skill }) {
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

    return (
        <Card className={`group hover:scale-105 transition-all duration-300 border-2 ${getStatusColor(skill.status)}`}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    {skill.icon && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <img
                                src={skill.icon}
                                alt={skill.name}
                                className="w-7 h-7 object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                            {skill.name}
                        </h4>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Dominio</span>
                        <span className="font-bold">{skill.proficiency}%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-700 ${getProgressColor(skill.status)}`}
                            style={{ width: `${skill.proficiency}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

