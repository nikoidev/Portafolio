'use client';

import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cmsApi } from '@/lib/cms-api';
import { PAGE_LABELS, PageContent } from '@/types/cms';
import { ArrowLeft, Edit, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditPageCMS() {
    const params = useParams();
    const pageKey = params.page as string;
    const [sections, setSections] = useState<PageContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSection, setEditingSection] = useState<PageContent | null>(null);
    const [editedContent, setEditedContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSections();
    }, [pageKey]);

    const loadSections = async () => {
        try {
            setIsLoading(true);
            const data = await cmsApi.getPageSections(pageKey);
            setSections(data);
        } catch (error: any) {
            toast.error('Error al cargar secciones');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (section: PageContent) => {
        setEditingSection(section);
        setEditedContent(JSON.stringify(section.content, null, 2));
    };

    const handleSave = async () => {
        if (!editingSection) return;

        try {
            setIsSaving(true);
            const parsedContent = JSON.parse(editedContent);

            await cmsApi.updateSection(
                editingSection.page_key,
                editingSection.section_key,
                { content: parsedContent }
            );

            toast.success('Sección actualizada correctamente');
            setEditingSection(null);
            loadSections();
        } catch (error: any) {
            if (error instanceof SyntaxError) {
                toast.error('JSON inválido. Verifica el formato');
            } else {
                toast.error(error.response?.data?.detail || 'Error al guardar');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const pageLabel = PAGE_LABELS[pageKey as keyof typeof PAGE_LABELS] || pageKey;

    return (
        <>
            <Header variant="admin" />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/admin/cms">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al CMS
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Editar: {pageLabel}</h1>
                    <p className="text-muted-foreground mt-2">
                        Gestiona el contenido de las secciones de esta página
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : editingSection ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Editando: {editingSection.title}</CardTitle>
                            <CardDescription>{editingSection.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Contenido (JSON)</Label>
                                <Textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="font-mono text-sm min-h-[400px]"
                                    placeholder='{"title": "Mi título", "description": "..."}'
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Edita el contenido en formato JSON. Asegúrate de que sea válido.
                                </p>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setEditingSection(null)}
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Guardar Cambios
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {sections.map((section) => (
                            <Card key={section.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>{section.title}</CardTitle>
                                            <CardDescription>{section.description}</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleEdit(section)}
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-48">
                                        {JSON.stringify(section.content, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

