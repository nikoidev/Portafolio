'use client';

import { SettingsForm } from '@/components/admin/SettingsForm';
import { PermissionGuard } from '@/components/shared/PermissionGuard';
import { Card, CardContent } from '@/components/ui/card';
import { settingsApi } from '@/lib/settings-api';
import { Settings, SettingsUpdate } from '@/types/settings';
import { Loader2, Settings as SettingsIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await settingsApi.getSettings();
            setSettings(data);
        } catch (err: any) {
            console.error('Error al cargar configuración:', err);
            setError(err.response?.data?.detail || 'Error al cargar la configuración');
            toast.error('Error al cargar la configuración');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (data: SettingsUpdate) => {
        try {
            const updated = await settingsApi.updateSettings(data);
            setSettings(updated);
            toast.success('Configuración guardada correctamente');
        } catch (err: any) {
            console.error('Error al guardar configuración:', err);
            throw err; // Re-lanzar para que el formulario lo maneje
        }
    };

    const handleReset = async () => {
        try {
            const resetData = await settingsApi.resetSettings();
            setSettings(resetData);
            toast.success('Configuración reseteada correctamente');
            // Recargar la página para reflejar los cambios
            await loadSettings();
        } catch (err: any) {
            console.error('Error al resetear configuración:', err);
            toast.error(err.response?.data?.detail || 'Error al resetear la configuración');
            throw err;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    if (error || !settings) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Configuración del Sitio</h1>
                    <p className="text-muted-foreground">
                        Gestiona la configuración global de tu portafolio
                    </p>
                </div>

                <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                <SettingsIcon className="w-8 h-8 text-red-600 dark:text-red-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                                    Error al cargar la configuración
                                </h3>
                                <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                                    {error || 'No se pudo cargar la configuración'}
                                </p>
                                <button
                                    onClick={loadSettings}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                >
                                    Reintentar
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <PermissionGuard permission="manage_settings">
            <div className="space-y-6 max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Configuración del Sitio</h1>
                        <p className="text-muted-foreground">
                            Gestiona la configuración global de tu portafolio
                        </p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
                        <SettingsIcon className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Banner Informativo */}
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                    <SettingsIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                    Configuración Global del Portafolio
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Aquí puedes personalizar todos los aspectos de tu portafolio: información del sitio,
                                    contacto, redes sociales, SEO, apariencia, avisos y más. Los cambios se aplicarán
                                    inmediatamente en todo el sitio.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Formulario de Configuración */}
                <SettingsForm
                    settings={settings}
                    onSave={handleSave}
                    onReset={handleReset}
                />
            </div>
        </PermissionGuard>
    );
}

