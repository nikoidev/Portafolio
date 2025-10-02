/**
 * Hook para acceder a la configuración global del sitio
 * Proporciona acceso centralizado a settings desde cualquier componente
 */

'use client';

import { settingsApi } from '@/lib/settings-api';
import { SettingsPublic } from '@/types/settings';
import { create } from 'zustand';

interface GlobalSettingsStore {
    settings: SettingsPublic | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Store de Zustand para configuración global
 * Persiste los settings y evita re-fetches innecesarios
 */
export const useGlobalSettingsStore = create<GlobalSettingsStore>((set, get) => ({
    settings: null,
    isLoading: false,
    error: null,

    fetchSettings: async () => {
        // Si ya tenemos settings, no refetch
        if (get().settings) return;

        set({ isLoading: true, error: null });
        try {
            const data = await settingsApi.getPublicSettings();
            set({ settings: data, isLoading: false });
        } catch (err: any) {
            console.error('Error loading global settings:', err);
            set({
                error: err.response?.data?.detail || 'Error al cargar configuración global',
                isLoading: false,
            });
        }
    },

    refetch: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await settingsApi.getPublicSettings();
            set({ settings: data, isLoading: false });
        } catch (err: any) {
            console.error('Error reloading global settings:', err);
            set({
                error: err.response?.data?.detail || 'Error al cargar configuración global',
                isLoading: false,
            });
        }
    },
}));

/**
 * Hook principal para usar la configuración global
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { settings, isLoading, refetch } = useGlobalSettings();
 *   
 *   if (isLoading) return <div>Cargando...</div>;
 *   
 *   return <div>{settings?.site_name}</div>;
 * }
 * ```
 */
export function useGlobalSettings() {
    const { settings, isLoading, error, fetchSettings, refetch } = useGlobalSettingsStore();

    // Auto-fetch en el primer mount
    if (!settings && !isLoading && !error) {
        fetchSettings();
    }

    return {
        settings,
        isLoading,
        error,
        refetch,

        // Helpers para acceso rápido
        siteName: settings?.site_name || 'Mi Portafolio',
        socialLinks: settings?.social_links || [],
        contactEmail: settings?.contact_email,
        contactPhone: settings?.contact_phone,
        contactLocation: settings?.contact_location,
        primaryColor: settings?.primary_color || '#3B82F6',
        themeMode: settings?.theme_mode || 'auto',
        maintenanceMode: settings?.maintenance_mode || false,
        bannerEnabled: settings?.banner_enabled || false,
        globalBanner: settings?.global_banner,
    };
}

/**
 * Hook para inicializar settings en el layout raíz
 * Debe llamarse una vez en el app layout
 */
export function useInitGlobalSettings() {
    const fetchSettings = useGlobalSettingsStore((state) => state.fetchSettings);

    return {
        init: fetchSettings,
    };
}

