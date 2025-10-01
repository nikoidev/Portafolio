'use client';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { cmsApi } from '@/lib/cms-api';
import { PageContent } from '@/types/cms';
import { Loader2, Save } from 'lucide-react';
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

    const renderField = (key: string, value: any) => {
        const fieldLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

        // Si el valor es un objeto o array, renderizar como JSON
        if (typeof value === 'object') {
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
                                // Ignorar si no es JSON válido mientras escribe
                            }
                        }}
                        className="font-mono text-sm"
                        rows={6}
                    />
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
                />
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    <div className="space-y-4 py-4">
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

