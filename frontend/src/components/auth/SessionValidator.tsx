'use client';

import { useAuthStore } from '@/store/auth';
import { useEffect, useRef } from 'react';

/**
 * Componente que valida la sesión del usuario al cargar la aplicación
 * Si el token está expirado, cierra la sesión automáticamente
 */
export function SessionValidator() {
    const { validateSession, isAuthenticated, token } = useAuthStore();
    const hasValidated = useRef(false);

    useEffect(() => {
        // Solo validar una vez al montar el componente
        if (isAuthenticated && token && !hasValidated.current) {
            hasValidated.current = true;
            validateSession();
        }
    }, [isAuthenticated, token, validateSession]);

    // Este componente no renderiza nada
    return null;
}

