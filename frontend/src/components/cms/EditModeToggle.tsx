'use client';

import { Button } from '@/components/ui/button';
import { useEditMode } from '@/contexts/EditModeContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthStore } from '@/store/auth';
import { Edit, Eye } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function EditModeToggle() {
    const { isAuthenticated } = useAuthStore();
    const { isEditMode, toggleEditMode } = useEditMode();
    const { hasPermission } = usePermissions();
    const pathname = usePathname();

    // Páginas específicas de admin donde NO queremos el toggle
    const excludedPages = [
        '/admin/login',
        '/admin/projects',
        '/admin/cv',
        '/admin/users',
        '/admin/cms',
        '/admin/uploads',
    ];

    const isExcludedPage = excludedPages.some(page => pathname.startsWith(page));

    // No mostrar si no está autenticado, está en página excluida, o no tiene permiso para editar contenido
    const canEditContent = hasPermission('update_content');

    if (!isAuthenticated || isExcludedPage || !canEditContent) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <Button
                onClick={toggleEditMode}
                size="lg"
                className={`shadow-lg transition-all ${isEditMode
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-primary hover:bg-primary/90'
                    }`}
            >
                {isEditMode ? (
                    <>
                        <Eye className="w-5 h-5 mr-2" />
                        Vista Previa
                    </>
                ) : (
                    <>
                        <Edit className="w-5 h-5 mr-2" />
                        Editar Página
                    </>
                )}
            </Button>
        </div>
    );
}

