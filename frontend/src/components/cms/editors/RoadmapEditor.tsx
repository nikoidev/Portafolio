'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, Plus, Trash2, X } from 'lucide-react';
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

interface RoadmapContent {
    title?: string;
    description?: string;
    categories?: Category[];
}

interface RoadmapEditorProps {
    content: RoadmapContent;
    onChange: (content: RoadmapContent) => void;
}

export function RoadmapEditor({ content, onChange }: RoadmapEditorProps) {
    const [localContent, setLocalContent] = useState<RoadmapContent>(content || {
        title: 'Mi Trayectoria de Aprendizaje',
        description: 'Un vistazo a las tecnologías que domino, las que estoy aprendiendo y mis próximos objetivos',
        categories: []
    });

    const updateContent = (newContent: RoadmapContent) => {
        setLocalContent(newContent);
        onChange(newContent);
    };

    const handleTitleChange = (title: string) => {
        updateContent({ ...localContent, title });
    };

    const handleDescriptionChange = (description: string) => {
        updateContent({ ...localContent, description });
    };

    const addCategory = () => {
        const categories = [...(localContent.categories || [])];
        categories.push({
            name: 'Nueva Categoría',
            icon: '💻',
            description: '',
            skills: []
        });
        updateContent({ ...localContent, categories });
    };

    const updateCategory = (index: number, category: Category) => {
        const categories = [...(localContent.categories || [])];
        categories[index] = category;
        updateContent({ ...localContent, categories });
    };

    const deleteCategory = (index: number) => {
        const categories = [...(localContent.categories || [])];
        categories.splice(index, 1);
        updateContent({ ...localContent, categories });
    };

    const moveCategoryUp = (index: number) => {
        if (index === 0) return;
        const categories = [...(localContent.categories || [])];
        [categories[index - 1], categories[index]] = [categories[index], categories[index - 1]];
        updateContent({ ...localContent, categories });
    };

    const moveCategoryDown = (index: number) => {
        const categories = localContent.categories || [];
        if (index === categories.length - 1) return;
        const newCategories = [...categories];
        [newCategories[index + 1], newCategories[index]] = [newCategories[index], newCategories[index + 1]];
        updateContent({ ...localContent, categories: newCategories });
    };

    const addSkill = (categoryIndex: number) => {
        const categories = [...(localContent.categories || [])];
        categories[categoryIndex].skills.push({
            name: 'Nueva Skill',
            icon: '',
            proficiency: 50,
            status: 'learning'
        });
        updateContent({ ...localContent, categories });
    };

    const updateSkill = (categoryIndex: number, skillIndex: number, skill: Skill) => {
        const categories = [...(localContent.categories || [])];
        categories[categoryIndex].skills[skillIndex] = skill;
        updateContent({ ...localContent, categories });
    };

    const deleteSkill = (categoryIndex: number, skillIndex: number) => {
        const categories = [...(localContent.categories || [])];
        categories[categoryIndex].skills.splice(skillIndex, 1);
        updateContent({ ...localContent, categories });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500">✅ Dominado</Badge>;
            case 'learning':
                return <Badge className="bg-orange-500">🔥 Aprendiendo</Badge>;
            case 'planned':
                return <Badge className="bg-blue-500">🎯 Planeado</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Header Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Título</Label>
                        <Input
                            value={localContent.title || ''}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Mi Trayectoria de Aprendizaje"
                        />
                    </div>
                    <div>
                        <Label>Descripción</Label>
                        <Textarea
                            value={localContent.description || ''}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Un vistazo a las tecnologías..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Categories */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Categorías ({localContent.categories?.length || 0})</h3>
                    <Button onClick={addCategory} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Categoría
                    </Button>
                </div>

                {localContent.categories?.map((category, catIndex) => (
                    <Card key={catIndex} className="border-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 flex-1">
                                    <div className="flex flex-col gap-1 mt-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => moveCategoryUp(catIndex)}
                                            disabled={catIndex === 0}
                                            className="h-6 w-6 p-0"
                                        >
                                            <ChevronUp className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => moveCategoryDown(catIndex)}
                                            disabled={catIndex === (localContent.categories?.length || 0) - 1}
                                            className="h-6 w-6 p-0"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs">Nombre</Label>
                                                <Input
                                                    value={category.name}
                                                    onChange={(e) => updateCategory(catIndex, { ...category, name: e.target.value })}
                                                    placeholder="Frontend, Backend..."
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Ícono (emoji)</Label>
                                                <Input
                                                    value={category.icon || ''}
                                                    onChange={(e) => updateCategory(catIndex, { ...category, icon: e.target.value })}
                                                    placeholder="💻 🚀 ⚙️"
                                                    maxLength={2}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs">Descripción</Label>
                                            <Input
                                                value={category.description || ''}
                                                onChange={(e) => updateCategory(catIndex, { ...category, description: e.target.value })}
                                                placeholder="Breve descripción..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteCategory(catIndex)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">Skills ({category.skills.length})</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addSkill(catIndex)}
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Agregar Skill
                                </Button>
                            </div>

                            {category.skills.map((skill, skillIndex) => (
                                <Card key={skillIndex} className="bg-muted/30">
                                    <CardContent className="pt-4 pb-3">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label className="text-xs">Nombre</Label>
                                                        <Input
                                                            value={skill.name}
                                                            onChange={(e) => updateSkill(catIndex, skillIndex, { ...skill, name: e.target.value })}
                                                            placeholder="React, Python..."
                                                            className="h-8"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">URL del Ícono</Label>
                                                        <Input
                                                            value={skill.icon || ''}
                                                            onChange={(e) => updateSkill(catIndex, skillIndex, { ...skill, icon: e.target.value })}
                                                            placeholder="https://..."
                                                            className="h-8"
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteSkill(catIndex, skillIndex)}
                                                    className="h-8 w-8 p-0 mt-5"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs flex items-center justify-between mb-2">
                                                        <span>Dominio</span>
                                                        <span className="font-bold">{skill.proficiency}%</span>
                                                    </Label>
                                                    <Slider
                                                        value={[skill.proficiency]}
                                                        onValueChange={(value) => updateSkill(catIndex, skillIndex, { ...skill, proficiency: value[0] })}
                                                        min={0}
                                                        max={100}
                                                        step={5}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs mb-2 block">Estado</Label>
                                                    <Select
                                                        value={skill.status}
                                                        onValueChange={(value: any) => updateSkill(catIndex, skillIndex, { ...skill, status: value })}
                                                    >
                                                        <SelectTrigger className="h-8">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="completed">✅ Dominado</SelectItem>
                                                            <SelectItem value="learning">🔥 Aprendiendo</SelectItem>
                                                            <SelectItem value="planned">🎯 Planeado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {category.skills.length === 0 && (
                                <div className="text-center py-4 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                                    No hay skills. Click en "Agregar Skill" para comenzar.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {(localContent.categories?.length || 0) === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground mb-4">No hay categorías aún</p>
                            <Button onClick={addCategory}>
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Primera Categoría
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

