'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Technology {
    name: string;
    icon: string;
    enabled: boolean;
}

interface TechnologyManagerProps {
    technologies: Technology[];
    onChange: (technologies: Technology[]) => void;
}

export function TechnologyManager({ technologies, onChange }: TechnologyManagerProps) {
    const [newTech, setNewTech] = useState<Technology>({ name: '', icon: '', enabled: true });

    const handleAdd = () => {
        if (!newTech.name.trim()) {
            return;
        }

        onChange([...technologies, { ...newTech, enabled: true }]);
        setNewTech({ name: '', icon: '', enabled: true });
    };

    const handleRemove = (index: number) => {
        onChange(technologies.filter((_, i) => i !== index));
    };

    const handleToggleEnabled = (index: number) => {
        const updated = [...technologies];
        updated[index].enabled = !updated[index].enabled;
        onChange(updated);
    };

    const handleUpdateIcon = (index: number, icon: string) => {
        const updated = [...technologies];
        updated[index].icon = icon;
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <Label>Tecnologías del Proyecto *</Label>

                {/* Lista de tecnologías */}
                {technologies.length > 0 && (
                    <div className="space-y-2">
                        {technologies.map((tech, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-2 p-3 border rounded-lg ${tech.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
                                    }`}
                            >
                                {/* Icono preview */}
                                {tech.icon && (
                                    <img
                                        src={tech.icon}
                                        alt={tech.name}
                                        className="w-6 h-6"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}

                                {/* Nombre */}
                                <span className="font-medium flex-1">{tech.name}</span>

                                {/* Input para icono */}
                                <Input
                                    type="text"
                                    placeholder="URL del icono"
                                    value={tech.icon}
                                    onChange={(e) => handleUpdateIcon(index, e.target.value)}
                                    className="w-64"
                                />

                                {/* Botón de habilitar/deshabilitar */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleToggleEnabled(index)}
                                    title={tech.enabled ? 'Deshabilitar' : 'Habilitar'}
                                >
                                    {tech.enabled ? (
                                        <Eye className="h-4 w-4" />
                                    ) : (
                                        <EyeOff className="h-4 w-4" />
                                    )}
                                </Button>

                                {/* Botón eliminar */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(index)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Formulario para agregar nueva tecnología */}
                <div className="flex items-end gap-2 p-4 border-2 border-dashed rounded-lg bg-muted/30">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="new-tech-name">Nombre de la Tecnología</Label>
                        <Input
                            id="new-tech-name"
                            type="text"
                            placeholder="Ej: Python, React, FastAPI"
                            value={newTech.name}
                            onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAdd();
                                }
                            }}
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <Label htmlFor="new-tech-icon">URL del Icono</Label>
                        <Input
                            id="new-tech-icon"
                            type="text"
                            placeholder="https://cdn.simpleicons.org/python"
                            value={newTech.icon}
                            onChange={(e) => setNewTech({ ...newTech, icon: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAdd();
                                }
                            }}
                        />
                    </div>

                    <Button
                        type="button"
                        onClick={handleAdd}
                        size="icon"
                        disabled={!newTech.name.trim()}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Busca iconos en{' '}
                    <a
                        href="https://simpleicons.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Simple Icons
                    </a>
                    {' '}o{' '}
                    <a
                        href="https://icon-sets.iconify.design/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Iconify
                    </a>
                </p>
            </div>
        </div>
    );
}

