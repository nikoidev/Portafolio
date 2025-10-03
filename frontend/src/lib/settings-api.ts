/**
 * API Client para Settings (Configuración Global)
 */

import { Settings, SettingsCreate, SettingsPublic, SettingsUpdate } from '@/types/settings';
import { api } from './api';

export const settingsApi = {
    /**
     * Obtener configuración completa (solo admin)
     */
    getSettings: async (): Promise<Settings> => {
        return await api.get<Settings>('/api/v1/settings/admin');
    },

    /**
     * Obtener configuración pública (sin autenticación)
     */
    getPublicSettings: async (): Promise<SettingsPublic> => {
        return await api.get<SettingsPublic>('/api/v1/settings/public');
    },

    /**
     * Crear configuración inicial (solo si no existe)
     */
    createSettings: async (data: SettingsCreate): Promise<Settings> => {
        return await api.post<Settings>('/api/v1/settings/', data);
    },

    /**
     * Actualizar configuración global
     */
    updateSettings: async (data: SettingsUpdate): Promise<Settings> => {
        return await api.put<Settings>('/api/v1/settings/', data);
    },

    /**
     * Resetear configuración a valores por defecto
     */
    resetSettings: async (): Promise<Settings> => {
        return await api.post<Settings>('/api/v1/settings/reset');
    },

    /**
     * Eliminar configuración (usar con precaución)
     */
    deleteSettings: async (): Promise<{ message: string }> => {
        return await api.delete<{ message: string }>('/api/v1/settings/');
    },
};

