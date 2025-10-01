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
import { Textarea } from '@/components/ui/textarea';
import { cmsApi } from '@/lib/cms-api';
import { PageContentCreate } from '@/types/cms';
import { getTemplateById, SECTION_TEMPLATES, SectionTemplate } from '@/types/cms-templates';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateSectionModalProps {
    pageKey: string;
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateSectionModal({
    pageKey,
    isOpen,
    onClose,
    onCreated,
}: CreateSectionModalProps) {
    const [step, setStep] = useState<'select' | 'configure'>('select');
    const [selectedTemplate, setSelectedTemplate] = useState<SectionTemplate | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sectionKey, setSectionKey] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleTemplateSelect = (template: SectionTemplate) => {
        setSelectedTemplate(template);
        setStep('configure');
        
        // Auto-generar section_key basado en el template
        const timestamp = Date.now();
        setSectionKey(`${template.id.replace(/-/g, '_')}_${timestamp}`);
        setTitle(template.name);
        setDescription(template.description);
    };

    const handleCreate = async () => {
        if (!selectedTemplate || !title || !sectionKey) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            setIsCreating(true);

            // Crear el contenido inicial basado en la plantilla
            const initialContent: Record<string, any> = {};
            selectedTemplate.fields.forEach(field => {
                initialContent[field.key] = field.defaultValue;
            });

            const newSection: PageContentCreate = {
                page_key: pageKey,
                section_key: sectionKey,
                title: title,
                description: description,
                content: initialContent,
                is_active: true,
                is_editable: true,
            };

            await cmsApi.createSection(newSection);
            toast.success('Sección creada correctamente');
            
            // Reset y cerrar
            handleClose();
            onCreated();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al crear la sección');
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        setStep('select');
        setSelectedTemplate(null);
        setTitle('');
        setDescription('');
        setSectionKey('');
        onClose();
    };

    const handleBack = () => {
        setStep('select');
        setSelectedTemplate(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {step === 'select' ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Selecciona una Plantilla</DialogTitle>
                            <DialogDescription>
                                Elige el tipo de sección que deseas agregar
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            {SECTION_TEMPLATES.map((template) => (
                                <Card
                                    key={template.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
                                    onClick={() => handleTemplateSelect(template)}
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="text-4xl">{template.icon}</div>
                                            <div>
                                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                                <CardDescription>{template.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xs text-muted-foreground">
                                            {template.fields.length} campos configurables
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBack}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Cambiar plantilla
                                </Button>
                            </div>
                            <DialogTitle>Configurar Nueva Sección</DialogTitle>
                            <DialogDescription>
                                Plantilla: {selectedTemplate?.name}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título de la Sección *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Mi Sección Especial"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Nombre que aparecerá en el admin panel
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe el propósito de esta sección"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sectionKey">Identificador de Sección *</Label>
                                <Input
                                    id="sectionKey"
                                    value={sectionKey}
                                    onChange={(e) => setSectionKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                                    placeholder="mi_seccion_especial"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Identificador único (solo letras, números y guiones bajos)
                                </p>
                            </div>

                            {selectedTemplate && selectedTemplate.fields.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Campos de la Sección</CardTitle>
                                        <CardDescription>
                                            Esta sección tendrá los siguientes campos editables:
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {selectedTemplate.fields.map((field, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <Check className="w-4 h-4 text-primary mt-0.5" />
                                                    <div>
                                                        <span className="font-medium">{field.label}</span>
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            ({field.type})
                                                        </span>
                                                        {field.description && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {field.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose} disabled={isCreating}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreate} disabled={isCreating || !title || !sectionKey}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        Crear Sección
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

