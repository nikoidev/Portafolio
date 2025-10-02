'use client';

import { CreateSectionModal } from '@/components/cms/CreateSectionModal';
import { SectionEditor } from '@/components/cms/SectionEditor';
import { PermissionGuard } from '@/components/shared/PermissionGuard';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePermissions } from '@/hooks/usePermissions';
import { cmsApi } from '@/lib/cms-api';
import { PAGE_LABELS, PageContent } from '@/types/cms';
import { ArrowDown, ArrowLeft, ArrowUp, Edit, Eye, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditPageCMS() {
    const params = useParams();
    const pageKey = params.page as string;
    const { hasPermission } = usePermissions();
    const [sections, setSections] = useState<PageContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSectionKeys, setEditingSectionKeys] = useState<{ pageKey: string; sectionKey: string; readOnly: boolean } | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deletingSection, setDeletingSection] = useState<PageContent | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reorderingSection, setReorderingSection] = useState<string | null>(null);

    // Verificar permisos
    const canUpdateContent = hasPermission('update_content');
    const canDeleteContent = hasPermission('delete_content');
    const canCreateContent = hasPermission('create_content');

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

    const handleEdit = (section: PageContent, readOnly: boolean = false) => {
        setEditingSectionKeys({
            pageKey: section.page_key,
            sectionKey: section.section_key,
            readOnly
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

    const handleReorder = async (section: PageContent, direction: 'up' | 'down') => {
        try {
            setReorderingSection(section.section_key);
            await cmsApi.reorderSection(section.page_key, section.section_key, direction);
            toast.success(`Sección movida ${direction === 'up' ? 'arriba' : 'abajo'}`);
            loadSections();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al reordenar la sección');
        } finally {
            setReorderingSection(null);
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
                        <h1 className="text-3xl font-bold">{canUpdateContent ? 'Editar' : 'Ver'}: {pageLabel}</h1>
                        <p className="text-muted-foreground mt-2">
                            {canUpdateContent ? 'Gestiona el contenido de las secciones de esta página' : 'Visualiza el contenido de las secciones de esta página'}
                        </p>
                    </div>
                    <PermissionGuard permission="create_content">
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Sección
                        </Button>
                    </PermissionGuard>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : sections.length > 0 ? (
                <div className="grid gap-4">
                    {sections.map((section, index) => (
                        <Card key={section.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between gap-4">
                                    {/* Botones de ordenamiento - Solo con permiso */}
                                    {canUpdateContent && (
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleReorder(section, 'up')}
                                                disabled={index === 0 || reorderingSection === section.section_key}
                                                className="h-6 px-2"
                                                title="Mover arriba"
                                            >
                                                {reorderingSection === section.section_key ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <ArrowUp className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleReorder(section, 'down')}
                                                disabled={index === sections.length - 1 || reorderingSection === section.section_key}
                                                className="h-6 px-2"
                                                title="Mover abajo"
                                            >
                                                {reorderingSection === section.section_key ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <ArrowDown className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Información de la sección */}
                                    <div className="flex-1">
                                        <CardTitle>{section.title}</CardTitle>
                                        <CardDescription>{section.description}</CardDescription>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            ID: {section.section_key} • {Object.keys(section.content).length} campos
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex gap-2">
                                        {canUpdateContent ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(section, false)}
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(section, true)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Ver
                                            </Button>
                                        )}
                                        <PermissionGuard permission="delete_content">
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteClick(section)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Eliminar
                                            </Button>
                                        </PermissionGuard>
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

            {/* Modal de edición/visualización */}
            {editingSectionKeys && (
                <SectionEditor
                    pageKey={editingSectionKeys.pageKey}
                    sectionKey={editingSectionKeys.sectionKey}
                    isOpen={true}
                    onClose={handleClose}
                    onSaved={loadSections}
                    readOnly={editingSectionKeys.readOnly}
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
