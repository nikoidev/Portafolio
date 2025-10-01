'use client';

import { CreateSectionModal } from '@/components/cms/CreateSectionModal';
import { SectionEditor } from '@/components/cms/SectionEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cmsApi } from '@/lib/cms-api';
import { PAGE_LABELS, PageContent } from '@/types/cms';
import { ArrowLeft, Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditPageCMS() {
    const params = useParams();
    const pageKey = params.page as string;
    const [sections, setSections] = useState<PageContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSectionKeys, setEditingSectionKeys] = useState<{ pageKey: string; sectionKey: string } | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deletingSection, setDeletingSection] = useState<PageContent | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
        setEditingSectionKeys({
            pageKey: section.page_key,
            sectionKey: section.section_key
        });
    };

    const handleClose = () => {
        setEditingSectionKeys(null);
        loadSections();
    };

    const handleDeleteClick = (section: PageContent) => {
        setDeletingSection(section);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingSection) return;

        try {
            setIsDeleting(true);
            await cmsApi.deleteSection(deletingSection.page_key, deletingSection.section_key);
            toast.success('Sección eliminada correctamente');
            setDeletingSection(null);
            loadSections();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al eliminar la sección');
        } finally {
            setIsDeleting(false);
        }
    };

    const pageLabel = PAGE_LABELS[pageKey as keyof typeof PAGE_LABELS] || pageKey;

    return (
        <div>
            <div className="mb-8">
                <Link href="/admin/cms">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al CMS
                    </Button>
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Editar: {pageLabel}</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona el contenido de las secciones de esta página
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Sección
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : sections.length > 0 ? (
                <div className="grid gap-4">
                    {sections.map((section) => (
                        <Card key={section.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <CardTitle>{section.title}</CardTitle>
                                        <CardDescription>{section.description}</CardDescription>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            ID: {section.section_key} • {Object.keys(section.content).length} campos
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(section)}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteClick(section)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">No hay secciones</h3>
                            <p className="text-muted-foreground mb-4">
                                Esta página aún no tiene secciones. ¡Agrega la primera!
                            </p>
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Primera Sección
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modal de edición */}
            {editingSectionKeys && (
                <SectionEditor
                    pageKey={editingSectionKeys.pageKey}
                    sectionKey={editingSectionKeys.sectionKey}
                    isOpen={true}
                    onClose={handleClose}
                    onSaved={loadSections}
                />
            )}

            {/* Modal de creación */}
            <CreateSectionModal
                pageKey={pageKey}
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={loadSections}
            />

            {/* Dialog de confirmación de eliminación */}
            <AlertDialog open={!!deletingSection} onOpenChange={(open) => !open && setDeletingSection(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar sección?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar la sección "<strong>{deletingSection?.title}</strong>".
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                'Eliminar'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
