'use client';

import { Button } from '@/components/ui/button';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAuthStore } from '@/store/auth';
import { Edit, Eye } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function EditModeToggle() {
    const { isAuthenticated } = useAuthStore();
    const { isEditMode, toggleEditMode } = useEditMode();
    const pathname = usePathname();

    // Solo mostrar en páginas públicas (no en admin)
    const isAdminPage = pathname.startsWith('/admin');

    // No mostrar si no está autenticado o está en página admin
    if (!isAuthenticated || isAdminPage) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
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

