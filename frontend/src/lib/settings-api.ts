/**
 * API Client para Settings (Configuración Global)
 */

import { Settings, SettingsPublic, SettingsUpdate } from '@/types/settings';
import { api } from './api';

export const settingsApi = {
    getSettings: async (): Promise<Settings> => {
        return await api.get<Settings>('/api/settings');
    },

    getPublicSettings: async (): Promise<SettingsPublic> => {
        return await api.get<SettingsPublic>('/api/settings/public');
    },

    updateSettings: async (data: SettingsUpdate): Promise<Settings> => {
        return await api.put<Settings>('/api/settings', data);
    },

    /**
     * Upload an icon file (image) and return its Vercel Blob URL.
     */
    uploadSocialIcon: async (file: File): Promise<{ success: boolean; icon_path: string; filename: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        return await api.post<{ success: boolean; icon_path: string; filename: string }>(
            '/api/uploads/image',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
    },
};
