'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { CV } from '@/types/api';
import { AlertCircle, CheckCircle, Download, FileText, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CVManagementPage() {
    const [cv, setCV] = useState<CV | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Load current CV
    useEffect(() => {
        loadCV();
    }, []);

    const loadCV = async () => {
        try {
            setLoading(true);
            const data = await api.getCV();
            setCV(data);
        } catch (error: any) {
            // If 404, no CV exists yet (this is expected)
            if (error?.status_code !== 404) {
                console.error('Error loading CV:', error);
            }
            setCV(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            setMessage({ type: 'error', text: 'Solo se permiten archivos PDF' });
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setMessage({ type: 'error', text: 'El archivo excede el tamaño máximo de 10MB' });
            return;
        }

        try {
            setUploading(true);
            setMessage(null);

            await api.uploadCV(file);

            setMessage({ type: 'success', text: 'CV subido exitosamente' });
            await loadCV();
        } catch (error: any) {
            console.error('Error uploading CV:', error);
            setMessage({ type: 'error', text: error.message || 'Error al subir el CV' });
        } finally {
            setUploading(false);
            // Reset input
            event.target.value = '';
        }
    };

    const handleDelete = async () => {
        if (!cv) return;

        if (!confirm('¿Estás seguro de que deseas eliminar el CV? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            setDeleting(true);
            setMessage(null);

            await api.deleteCV();

            setMessage({ type: 'success', text: 'CV eliminado exitosamente' });
            setCV(null);
        } catch (error: any) {
            console.error('Error deleting CV:', error);
            setMessage({ type: 'error', text: error.message || 'Error al eliminar el CV' });
        } finally {
            setDeleting(false);
        }
    };

    const handleDownload = () => {
        const downloadUrl = api.getCVDownloadURL();
        window.open(downloadUrl, '_blank');
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Gestión de CV</h1>
                <p className="text-muted-foreground">
                    Sube tu CV en formato PDF para que los visitantes puedan descargarlo.
                </p>
            </div>

            {message && (
                <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                        {message.text}
                    </AlertDescription>
                </Alert>
            )}

            {cv ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            CV Actual
                        </CardTitle>
                        <CardDescription>
                            Tu CV está disponible para descarga pública
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium text-gray-900">{cv.filename}</p>
                                    <p className="text-sm text-gray-600">
                                        Tamaño: {formatFileSize(cv.file_size)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownload}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Descargar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {deleting ? 'Eliminando...' : 'Eliminar'}
                                    </Button>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1 pt-3 border-t border-gray-200">
                                <p>Subido: {formatDate(cv.created_at)}</p>
                                {cv.updated_at !== cv.created_at && (
                                    <p>Actualizado: {formatDate(cv.updated_at)}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600 mb-3">
                                ¿Deseas reemplazar tu CV? Sube un nuevo archivo:
                            </p>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                    <Button disabled={uploading} asChild>
                                        <span>
                                            <Upload className="h-4 w-4 mr-2" />
                                            {uploading ? 'Subiendo...' : 'Reemplazar CV'}
                                        </span>
                                    </Button>
                                </label>
                                <span className="text-sm text-gray-500">
                                    PDF, máx. 10MB
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Subir CV
                        </CardTitle>
                        <CardDescription>
                            No hay ningún CV subido. Sube tu CV en formato PDF.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Sube tu CV
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Archivo PDF, tamaño máximo 10MB
                            </p>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                <Button disabled={uploading} asChild>
                                    <span>
                                        <Upload className="h-4 w-4 mr-2" />
                                        {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                                    </span>
                                </Button>
                            </label>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Información</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p>Solo se puede tener un CV activo a la vez</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p>El CV estará disponible públicamente en: <code className="text-xs bg-gray-100 px-2 py-1 rounded">/cv/download</code></p>
                    </div>
                    <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p>Al subir un nuevo CV, el anterior será reemplazado automáticamente</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p>El CV se almacena de forma segura en la base de datos</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

