'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export function RoadmapSection({ content }: RoadmapSectionProps) {
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

    const calculateCategoryProgress = (category: Category) => {
        if (category.skills.length === 0) return 0;
        const totalProficiency = category.skills.reduce((sum, skill) => sum + skill.proficiency, 0);
        return Math.round(totalProficiency / category.skills.length);
    };

    if (categories.length === 0) {
        return null; // No mostrar la sección si no hay categorías
    }

    return (
        <section className="relative py-20 px-4 overflow-hidden">
            {/* Background decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
            <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10" />

            <div className="container mx-auto">
                {/* Header con animación */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            Trayectoria Profesional
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {title || 'Mi Trayectoria de Aprendizaje'}
                    </h2>
                    {description && (
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* Grid de categorías con stagger animation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {categories.map((category, index) => {
                        const avgProgress = calculateCategoryProgress(category);
                        const progressColor = avgProgress >= 80 ? 'bg-green-500' : avgProgress >= 50 ? 'bg-orange-500' : 'bg-blue-500';

                        return (
                            <Card
                                key={index}
                                className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader className="space-y-3">
                                    {/* Header de categoría */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {category.icon && (
                                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-2xl group-hover:scale-110 transition-transform">
                                                    {category.icon}
                                                </div>
                                            )}
                                            <div>
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                    {category.name}
                                                </CardTitle>
                                                {category.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`ml-2 font-bold ${avgProgress >= 80 ? 'border-green-500 text-green-500' : avgProgress >= 50 ? 'border-orange-500 text-orange-500' : 'border-blue-500 text-blue-500'}`}
                                        >
                                            {avgProgress}%
                                        </Badge>
                                    </div>

                                    {/* Barra de progreso general */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Progreso general</span>
                                            <span className="font-semibold">{category.skills.length} skills</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${progressColor} transition-all duration-1000 rounded-full`}
                                                style={{ width: `${avgProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-2">
                                        {category.skills.map((skill, skillIndex) => (
                                            <div
                                                key={skillIndex}
                                                className="group/skill flex items-center justify-between p-3 rounded-lg hover:bg-muted/70 transition-all duration-200 border border-transparent hover:border-primary/20"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {skill.icon && (
                                                        <div className="flex-shrink-0 w-6 h-6 rounded-md overflow-hidden bg-muted flex items-center justify-center group-hover/skill:scale-110 transition-transform">
                                                            <img
                                                                src={skill.icon}
                                                                alt={skill.name}
                                                                className="w-5 h-5 object-contain"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-sm truncate">
                                                                {skill.name}
                                                            </span>
                                                            <div className="flex-shrink-0">
                                                                {getStatusIcon(skill.status)}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-700 rounded-full ${skill.status === 'completed' ? 'bg-green-500' :
                                                                            skill.status === 'learning' ? 'bg-orange-500' :
                                                                                'bg-blue-500'
                                                                        }`}
                                                                    style={{ width: `${skill.proficiency}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-semibold text-muted-foreground w-8 text-right flex-shrink-0">
                                                                {skill.proficiency}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Leyenda de estados mejorada */}
                <div className="flex justify-center gap-8 flex-wrap animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">Dominado</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium">Aprendiendo</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium">Planeado</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

