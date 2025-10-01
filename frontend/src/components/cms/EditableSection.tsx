'use client';

import { useEditMode } from '@/contexts/EditModeContext';
import { Edit2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { SectionEditor } from './SectionEditor';

interface EditableSectionProps {
    pageKey: string;
    sectionKey: string;
    children: ReactNode;
    onContentUpdate?: () => void;
    className?: string;
}

export function EditableSection({
    pageKey,
    sectionKey,
    children,
    onContentUpdate,
    className = '',
}: EditableSectionProps) {
    const { isEditMode } = useEditMode();
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const handleSaved = () => {
        if (onContentUpdate) {
            onContentUpdate();
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Contenido de la sección */}
            <div className={isEditMode ? 'ring-2 ring-orange-400 ring-opacity-50 rounded-lg' : ''}>
                {children}
            </div>

            {/* Botón de edición (solo visible en modo edición) */}
            {isEditMode && (
                <div className="absolute top-2 right-2 z-10">
                    <button
                        onClick={() => setIsEditorOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-md shadow-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                        title="Editar sección"
                    >
                        <Edit2 className="w-4 h-4" />
                        Editar
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
        </div>
    );
}

