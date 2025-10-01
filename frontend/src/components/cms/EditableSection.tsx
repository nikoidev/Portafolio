'use client';

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
import { useEditMode } from '@/contexts/EditModeContext';
import { cmsApi } from '@/lib/cms-api';
import { ArrowDown, ArrowUp, Copy, Edit2, Loader2, Trash2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { SectionEditor } from './SectionEditor';

interface EditableSectionProps {
    pageKey: string;
    sectionKey: string;
    children: ReactNode;
    onContentUpdate?: () => void;
    onDeleted?: () => void;
    className?: string;
    showActions?: boolean; // Para ocultar acciones si es necesario
    canMoveUp?: boolean; // Si se puede mover hacia arriba
    canMoveDown?: boolean; // Si se puede mover hacia abajo
}

export function EditableSection({
    pageKey,
    sectionKey,
    children,
    onContentUpdate,
    onDeleted,
    className = '',
    showActions = true,
    canMoveUp = true,
    canMoveDown = true,
}: EditableSectionProps) {
    const { isEditMode } = useEditMode();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    const handleSaved = () => {
        if (onContentUpdate) {
            onContentUpdate();
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await cmsApi.deleteSection(pageKey, sectionKey);
            toast.success('Sección eliminada correctamente');
            setShowDeleteConfirm(false);

            // Notificar a la página padre para que recargue
            if (onDeleted) {
                onDeleted();
            } else if (onContentUpdate) {
                onContentUpdate();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al eliminar la sección');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async () => {
        try {
            setIsDuplicating(true);

            // Obtener el contenido actual de la sección
            const currentSection = await cmsApi.getSection(pageKey, sectionKey);

            // Crear una copia con un nuevo section_key
            const timestamp = Date.now();
            const newSectionKey = `${sectionKey}_copy_${timestamp}`;

            await cmsApi.createSection({
                page_key: pageKey,
                section_key: newSectionKey,
                title: `${currentSection.title} (Copia)`,
                description: currentSection.description,
                content: currentSection.content,
                is_active: currentSection.is_active,
                is_editable: currentSection.is_editable,
            });

            toast.success('Sección duplicada correctamente');

            // Recargar la página
            if (onContentUpdate) {
                onContentUpdate();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al duplicar la sección');
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleReorder = async (direction: 'up' | 'down') => {
        try {
            setIsReordering(true);
            await cmsApi.reorderSection(pageKey, sectionKey, direction);
            toast.success(`Sección movida ${direction === 'up' ? 'arriba' : 'abajo'}`);

            // Recargar la página para ver los cambios
            window.location.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al reordenar la sección');
            setIsReordering(false);
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Contenido de la sección */}
            <div className={isEditMode ? 'ring-2 ring-orange-400 ring-opacity-50 rounded-lg' : ''}>
                {children}
            </div>

            {/* Botones de acción (solo visible en modo edición) */}
            {isEditMode && showActions && (
                <div className="absolute top-2 right-2 z-[110] flex gap-2">
                    {/* Botones de reordenamiento */}
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => handleReorder('up')}
                            disabled={!canMoveUp || isReordering}
                            className="flex items-center justify-center px-2 py-1 bg-gray-500 text-white rounded-md shadow-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mover arriba"
                        >
                            {isReordering ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <ArrowUp className="w-3 h-3" />
                            )}
                        </button>
                        <button
                            onClick={() => handleReorder('down')}
                            disabled={!canMoveDown || isReordering}
                            className="flex items-center justify-center px-2 py-1 bg-gray-500 text-white rounded-md shadow-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mover abajo"
                        >
                            {isReordering ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <ArrowDown className="w-3 h-3" />
                            )}
                        </button>
                    </div>

                    <button
                        onClick={handleDuplicate}
                        disabled={isDuplicating}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Duplicar sección"
                    >
                        {isDuplicating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                    <button
                        onClick={() => setIsEditorOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-md shadow-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                        title="Editar sección"
                    >
                        <Edit2 className="w-4 h-4" />
                        Editar
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        title="Eliminar sección"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Modal de edición */}
            <SectionEditor
                pageKey={pageKey}
                sectionKey={sectionKey}
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSaved={handleSaved}
            />

            {/* Confirmación de eliminación */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta sección?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La sección se eliminará permanentemente de la página.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
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

