'use client';

import { cmsApi } from '@/lib/cms-api';
import { useEffect, useState } from 'react';

export function useCMSContent(pageKey: string, sectionKey: string) {
    const [content, setContent] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadContent = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await cmsApi.getSectionPublic(pageKey, sectionKey);
            setContent(data.content);
        } catch (err: any) {
            // Si es un 404, no es un error real, solo significa que no hay contenido
            if (err.response?.status === 404) {
                setError(null);
                setContent(null);
            } else {
                setError(err.message || 'Error al cargar contenido');
                setContent(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadContent();
    }, [pageKey, sectionKey]);

    return {
        content,
        isLoading,
        error,
        refresh: loadContent,
    };
}

