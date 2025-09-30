'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { AlertCircle, CheckCircle, File, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
    file: File;
    preview?: string;
    status: 'uploading' | 'success' | 'error';
    result?: any;
    error?: string;
}

interface FileUploadProps {
    accept?: Record<string, string[]>;
    maxFiles?: number;
    maxSize?: number;
    uploadType?: 'images' | 'files';
    onUploadComplete?: (results: any[]) => void;
    title?: string;
    description?: string;
}

export function FileUpload({
    accept = {
        'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024, // 10MB
    uploadType = 'images',
    onUploadComplete,
    title = 'Subir Archivos',
    description = 'Arrastra y suelta archivos aquí o haz clic para seleccionar'
}: FileUploadProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
            status: 'uploading' as const
        }));

        setFiles(prev => [...prev, ...newFiles]);
        uploadFiles(newFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        maxSize,
        disabled: isUploading
    });

    const uploadFiles = async (filesToUpload: UploadedFile[]) => {
        setIsUploading(true);

        try {
            if (uploadType === 'images') {
                // Subir imágenes una por una para mejor control
                for (let i = 0; i < filesToUpload.length; i++) {
                    const fileData = filesToUpload[i];
                    try {
                        const formData = new FormData();
                        formData.append('file', fileData.file);
                        formData.append('optimize', 'true');

                        const result = await api.post('/api/v1/uploads/images', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        // Actualizar estado del archivo
                        setFiles(prev => prev.map(f =>
                            f.file === fileData.file
                                ? { ...f, status: 'success', result: result.data }
                                : f
                        ));
                    } catch (error: any) {
                        setFiles(prev => prev.map(f =>
                            f.file === fileData.file
                                ? {
                                    ...f,
                                    status: 'error',
                                    error: error.response?.data?.detail || 'Error al subir archivo'
                                }
                                : f
                        ));
                    }
                }
            } else {
                // Subir archivos generales
                for (let i = 0; i < filesToUpload.length; i++) {
                    const fileData = filesToUpload[i];
                    try {
                        const formData = new FormData();
                        formData.append('file', fileData.file);
                        formData.append('file_type', 'general');

                        const result = await api.post('/api/v1/uploads/files', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        setFiles(prev => prev.map(f =>
                            f.file === fileData.file
                                ? { ...f, status: 'success', result: result.data }
                                : f
                        ));
                    } catch (error: any) {
                        setFiles(prev => prev.map(f =>
                            f.file === fileData.file
                                ? {
                                    ...f,
                                    status: 'error',
                                    error: error.response?.data?.detail || 'Error al subir archivo'
                                }
                                : f
                        ));
                    }
                }
            }

            // Notificar resultados
            const successfulUploads = files.filter(f => f.status === 'success');
            if (onUploadComplete && successfulUploads.length > 0) {
                onUploadComplete(successfulUploads.map(f => f.result));
            }
        } finally {
            setIsUploading(false);
        }
    };

    const removeFile = (fileToRemove: File) => {
        setFiles(prev => {
            const fileData = prev.find(f => f.file === fileToRemove);
            if (fileData?.preview) {
                URL.revokeObjectURL(fileData.preview);
            }
            return prev.filter(f => f.file !== fileToRemove);
        });
    };

    const clearAll = () => {
        files.forEach(f => {
            if (f.preview) {
                URL.revokeObjectURL(f.preview);
            }
        });
        setFiles([]);
    };

    const getStatusIcon = (status: UploadedFile['status']) => {
        switch (status) {
            case 'uploading':
                return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Zona de drop */}
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                        }
                        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    {isDragActive ? (
                        <p className="text-primary font-medium">Suelta los archivos aquí...</p>
                    ) : (
                        <div>
                            <p className="text-gray-600 mb-2">
                                Arrastra archivos aquí o <span className="text-primary font-medium">haz clic para seleccionar</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Máximo {maxFiles} archivos, {formatFileSize(maxSize)} por archivo
                            </p>
                        </div>
                    )}
                </div>

                {/* Lista de archivos */}
                {files.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Archivos ({files.length})</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAll}
                                disabled={isUploading}
                            >
                                Limpiar todo
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {files.map((fileData, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 border rounded-lg"
                                >
                                    {/* Preview o icono */}
                                    <div className="flex-shrink-0">
                                        {fileData.preview ? (
                                            <img
                                                src={fileData.preview}
                                                alt={fileData.file.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                {fileData.file.type.startsWith('image/') ? (
                                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                                ) : (
                                                    <File className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Información del archivo */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {fileData.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(fileData.file.size)}
                                        </p>
                                        {fileData.error && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {fileData.error}
                                            </p>
                                        )}
                                    </div>

                                    {/* Estado */}
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(fileData.status)}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(fileData.file)}
                                            disabled={fileData.status === 'uploading'}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen */}
                        <div className="text-sm text-gray-600">
                            {files.filter(f => f.status === 'success').length} exitosos, {' '}
                            {files.filter(f => f.status === 'error').length} fallidos, {' '}
                            {files.filter(f => f.status === 'uploading').length} subiendo
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
