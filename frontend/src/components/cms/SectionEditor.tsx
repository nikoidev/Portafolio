'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cmsApi } from '@/lib/cms-api';
import { PageContent } from '@/types/cms';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SectionEditorProps {
    pageKey: string;
    sectionKey: string;
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export function SectionEditor({
    pageKey,
    sectionKey,
    isOpen,
    onClose,
    onSaved,
}: SectionEditorProps) {
    const [section, setSection] = useState<PageContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (isOpen && pageKey && sectionKey) {
            loadSection();
        }
    }, [isOpen, pageKey, sectionKey]);

    const loadSection = async () => {
        try {
            setIsLoading(true);
            const data = await cmsApi.getSection(pageKey, sectionKey);
            setSection(data);
            setFormData(data.content);
        } catch (error: any) {
            toast.error('Error al cargar la sección');
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await cmsApi.updateSection(pageKey, sectionKey, {
                content: formData,
            });
            toast.success('Sección actualizada correctamente');
            onSaved();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFieldChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleArrayItemChange = (arrayKey: string, index: number, field: string, value: any) => {
        setFormData((prev) => {
            const newArray = [...prev[arrayKey]];
            newArray[index] = {
                ...newArray[index],
                [field]: value,
            };
            return {
                ...prev,
                [arrayKey]: newArray,
            };
        });
    };

    const handleArrayItemAdd = (arrayKey: string) => {
        setFormData((prev) => {
            const currentArray = prev[arrayKey] || [];

            // Crear plantilla basada en el primer elemento
            let template: Record<string, any> = { text: '', url: '' };

            if (currentArray.length > 0) {
                const firstItem = currentArray[0];
                template = Object.keys(firstItem).reduce((acc, key) => {
                    // Preservar el tipo de dato
                    if (typeof firstItem[key] === 'boolean') {
                        return { ...acc, [key]: true }; // Por defecto enabled = true
                    }
                    return { ...acc, [key]: '' };
                }, {});
            }

            return {
                ...prev,
                [arrayKey]: [...currentArray, template],
            };
        });
    };

    const handleArrayItemDelete = (arrayKey: string, index: number) => {
        setFormData((prev) => ({
            ...prev,
            [arrayKey]: prev[arrayKey].filter((_: any, i: number) => i !== index),
        }));
    };

    const renderArrayField = (key: string, arrayValue: any[]) => {
        const fieldLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

        // Verificar si es un array de objetos simples (como links)
        const isObjectArray = arrayValue.length > 0 && typeof arrayValue[0] === 'object';

        if (!isObjectArray) {
            // Array simple de strings
            return (
                <div key={key} className="space-y-2">
                    <Label>{fieldLabel}</Label>
                    <Textarea
                        value={JSON.stringify(arrayValue, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleFieldChange(key, parsed);
                            } catch {
                                // Ignorar
                            }
                        }}
                        className="font-mono text-sm"
                        rows={4}
                    />
                </div>
            );
        }

        return (
            <Card key={key} className="border-2">
                <CardHeader>
                    <CardTitle className="text-base">{fieldLabel}</CardTitle>
                    <CardDescription>
                        Gestiona los elementos de esta lista
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {arrayValue.map((item, index) => (
                        <Card key={index} className="bg-muted/50">
                            <CardContent className="pt-6 space-y-3">
                                {Object.entries(item).map(([field, value]) => {
                                    // Si es un campo booleano, mostrar switch
                                    if (typeof value === 'boolean') {
                                        return (
                                            <div key={field} className="flex items-center justify-between space-y-2">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor={`${key}-${index}-${field}`}>
                                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        {value ? 'Habilitado' : 'Deshabilitado'}
                                                    </p>
                                                </div>
                                                <Switch
                                                    id={`${key}-${index}-${field}`}
                                                    checked={value}
                                                    onCheckedChange={(checked) =>
                                                        handleArrayItemChange(key, index, field, checked)
                                                    }
                                                />
                                            </div>
                                        );
                                    }

                                    // Para campos string normales
                                    return (
                                        <div key={field} className="space-y-2">
                                            <Label htmlFor={`${key}-${index}-${field}`}>
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                            </Label>
                                            <Input
                                                id={`${key}-${index}-${field}`}
                                                value={value as string}
                                                onChange={(e) =>
                                                    handleArrayItemChange(key, index, field, e.target.value)
                                                }
                                                placeholder={`Ingresa ${field}`}
                                            />
                                        </div>
                                    );
                                })}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleArrayItemDelete(key, index)}
                                    className="w-full mt-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    <Button
                        variant="outline"
                        onClick={() => handleArrayItemAdd(key)}
                        className="w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar nuevo
                    </Button>
                </CardContent>
            </Card>
        );
    };

    const renderField = (key: string, value: any) => {
        const fieldLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

        // Si es un array, usar el renderizador especial
        if (Array.isArray(value)) {
            return renderArrayField(key, value);
        }

        // Si es un objeto (pero no array), renderizar como JSON
        if (typeof value === 'object' && value !== null) {
            return (
                <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{fieldLabel}</Label>
                    <Textarea
                        id={key}
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleFieldChange(key, parsed);
                            } catch {
                                // Ignorar
                            }
                        }}
                        className="font-mono text-sm"
                        rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                        Formato JSON. Edita con cuidado.
                    </p>
                </div>
            );
        }

        // Si es un string largo, usar textarea
        if (typeof value === 'string' && value.length > 100) {
            return (
                <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{fieldLabel}</Label>
                    <Textarea
                        id={key}
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        rows={4}
                        placeholder={`Ingresa ${fieldLabel.toLowerCase()}`}
                    />
                </div>
            );
        }

        // Para strings cortos y otros tipos primitivos
        return (
            <div key={key} className="space-y-2">
                <Label htmlFor={key}>{fieldLabel}</Label>
                <Input
                    id={key}
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    type={typeof value === 'number' ? 'number' : 'text'}
                    placeholder={`Ingresa ${fieldLabel.toLowerCase()}`}
                />
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {section?.title || 'Editar Sección'}
                    </DialogTitle>
                    <DialogDescription>
                        {section?.description || 'Modifica el contenido de esta sección'}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {Object.entries(formData).map(([key, value]) => renderField(key, value))}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isLoading}>
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

