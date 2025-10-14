'use client';

import { useEditMode } from '@/contexts/EditModeContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthStore } from '@/store/auth';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CreateSectionModal } from './CreateSectionModal';

// Mapeo de rutas a page_keys
const ROUTE_TO_PAGE_KEY: Record<string, string> = {
    '/': 'home',
    '/about': 'about',
    '/projects': 'projects',
    '/contact': 'contact',
};

export function CreateSectionButton() {
    const { isEditMode } = useEditMode();
    const { hasPermission } = usePermissions();
    const { isAuthenticated, isValidating, token } = useAuthStore();
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Obtener el page_key basado en la ruta actual
    const pageKey = ROUTE_TO_PAGE_KEY[pathname] || null;

    // Verificar si puede crear contenido
    const canCreateContent = hasPermission('create_content');

    // No mostrar el botón si no estamos en modo edición, no es una página editable, o no tiene permisos
    // También ocultar mientras valida la sesión
    if (isValidating || !isAuthenticated || !token || !isEditMode || !pageKey || !canCreateContent) {
        return null;
    }

    const handleCreated = () => {
        // Recargar la página para mostrar la nueva sección
        window.location.reload();
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 right-6 z-[100] flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-full shadow-xl hover:bg-green-600 transition-all hover:scale-110 text-sm font-medium"
                title="Agregar nueva sección"
            >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Agregar Sección</span>
            </button>

            <CreateSectionModal
                pageKey={pageKey}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={handleCreated}
            />
        </>
    );
}

