'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Download, Eye, FileText, Loader2, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CVManagementPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [currentCV, setCurrentCV] = useState<string | null>(null);
    const [cvExists, setCvExists] = useState(false);

    // Cargar CV actual
    useEffect(() => {
        const loadCV = async () => {
            try {
                const cvData = await api.getCV() as any;
                if (cvData && cvData.manual_cv_url) {
                    setCurrentCV(cvData.manual_cv_url);
                    setCvExists(true);
                }
            } catch (error) {
                console.log('No hay CV existente');
                setCvExists(false);
            }
        };

        loadCV();
    }, []);

    const handleUploadCV = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar que sea un PDF
        if (file.type !== 'application/pdf') {
            toast.error('Solo se permiten archivos PDF');
            return;
        }

        // Validar tamaño (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('El archivo es muy grande. Máximo 10MB');
            return;
        }

        setIsUploading(true);
        try {
            // Subir el archivo
            const formData = new FormData();
            formData.append('file', file);
            const uploadResult = await api.uploadFile(formData);

            // Crear o actualizar el CV automáticamente
            const cvData = {
                full_name: 'CV',
                title: 'Curriculum Vitae',
                email: 'cv@nikoidev.com',
                cv_source: 'manual',
                manual_cv_url: uploadResult.url,
            };

            if (cvExists) {
                await api.updateCV(cvData);
                toast.success('CV actualizado correctamente');
            } else {
                await api.createOrUpdateCV(cvData);
                toast.success('CV subido correctamente');
                setCvExists(true);
            }

            setCurrentCV(uploadResult.url);
        } catch (error: any) {
            console.error('Error al subir CV:', error);
            toast.error(error.response?.data?.detail || 'Error al subir el CV');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteCV = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar el CV?')) {
            return;
        }

        try {
            await api.deleteCV();
            setCurrentCV(null);
            setCvExists(false);
            toast.success('CV eliminado correctamente');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al eliminar el CV');
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de CV</h1>
                    <p className="text-muted-foreground">
                        Sube tu currículum vitae en formato PDF para que los visitantes puedan descargarlo
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Tu CV
                        </CardTitle>
                        <CardDescription>
                            Sube tu CV en formato PDF (máximo 10MB)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Estado actual del CV */}
                        {currentCV ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-primary" />
                                        <div>
                                            <p className="font-medium">CV actual</p>
                                            <p className="text-sm text-muted-foreground">
                                                Listo para descargar
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={`${process.env.NEXT_PUBLIC_API_URL}${currentCV}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Ver
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={`${process.env.NEXT_PUBLIC_API_URL}${currentCV}`}
                                                download
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Descargar
                                            </a>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDeleteCV}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-muted-foreground mb-3">
                                        ¿Quieres reemplazar tu CV actual?
                                    </p>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleUploadCV}
                                        className="hidden"
                                        id="cv-upload-replace"
                                        disabled={isUploading}
                                    />
                                    <label htmlFor="cv-upload-replace">
                                        <Button
                                            variant="outline"
                                            disabled={isUploading}
                                            asChild
                                        >
                                            <span className="cursor-pointer">
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Subiendo...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Reemplazar CV
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-lg p-12 text-center">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleUploadCV}
                                    className="hidden"
                                    id="cv-upload"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="cv-upload"
                                    className="cursor-pointer flex flex-col items-center gap-4"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Subiendo CV...</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Por favor espera
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-lg">
                                                    Haz clic para subir tu CV
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Solo archivos PDF (máximo 10MB)
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </label>
                            </div>
                        )}

                        {/* Información adicional */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                <strong>Nota:</strong> Una vez que subas tu CV, estará disponible públicamente en{' '}
                                <a
                                    href="/cv/download"
                                    target="_blank"
                                    className="underline"
                                >
                                    /cv/download
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
