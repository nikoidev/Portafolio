'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
        <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {title || 'Mi Trayectoria de Aprendizaje'}
                    </h2>
                    {description && (
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}
                </div>

                {/* Grid de categorías */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => {
                        const avgProgress = calculateCategoryProgress(category);

                        return (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {category.icon && (
                                                <span className="text-2xl">{category.icon}</span>
                                            )}
                                            <CardTitle className="text-xl">{category.name}</CardTitle>
                                        </div>
                                        <Badge variant="outline" className="ml-2">
                                            {avgProgress}%
                                        </Badge>
                                    </div>
                                    <Progress value={avgProgress} className="h-2" />
                                    {category.description && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {category.description}
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3">
                                        {category.skills.map((skill, skillIndex) => (
                                            <div
                                                key={skillIndex}
                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    {skill.icon && (
                                                        <img
                                                            src={skill.icon}
                                                            alt={skill.name}
                                                            className="w-5 h-5 object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    <span className="font-medium text-sm">{skill.name}</span>
                                                    {getStatusIcon(skill.status)}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="w-20">
                                                        <Progress value={skill.proficiency} className="h-1.5" />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground w-10 text-right">
                                                        {skill.proficiency}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Leyenda de estados */}
                <div className="flex justify-center gap-6 mt-12 flex-wrap">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-muted-foreground">Dominado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Aprendiendo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Planeado</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

