'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Copy, Download, Eye, File, Image as ImageIcon, Loader2, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FileItem {
    filename: string;
    url: string;
    size: number;
    created_at: string;
    modified_at: string;
}

interface FileGalleryProps {
    fileType?: 'images' | 'files' | 'cv_pdfs';
    title?: string;
    description?: string;
    onFileSelect?: (file: FileItem) => void;
    selectable?: boolean;
}

export function FileGallery({
    fileType = 'images',
    title = 'Galería de Archivos',
    description = 'Gestiona tus archivos subidos',
    onFileSelect,
    selectable = false
}: FileGalleryProps) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    useEffect(() => {
        loadFiles();
    }, [fileType]);

    const loadFiles = async () => {
        setIsLoading(true);
        try {
            const endpoint = fileType === 'images'
                ? '/api/v1/uploads/images'
                : `/api/v1/uploads/files?file_type=${fileType}`;

            const response = await api.get(endpoint) as any;
            const fileList = fileType === 'images'
                ? response.data?.images || response
                : response.data?.files || response;

            setFiles(fileList || []);
        } catch (error) {
            console.error('Error loading files:', error);
            setFiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFile = async (filename: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
            return;
        }

        setDeleteLoading(filename);
        try {
            const endpoint = fileType === 'images'
                ? `/api/v1/uploads/images/${filename}`
                : `/api/v1/uploads/files/${filename}?file_type=${fileType}`;

            await api.delete(endpoint);
            setFiles(prev => prev.filter(f => f.filename !== filename));
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Error al eliminar archivo');
        } finally {
            setDeleteLoading(null);
        }
    };

    const copyUrl = (url: string) => {
        const fullUrl = `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        // TODO: Mostrar toast de confirmación
        alert('URL copiada al portapapeles');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredFiles = files.filter(file =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFileSelection = (filename: string) => {
        const newSelection = new Set(selectedFiles);
        if (newSelection.has(filename)) {
            newSelection.delete(filename);
        } else {
            newSelection.add(filename);
        }
        setSelectedFiles(newSelection);
    };

    const handleFileSelect = (file: FileItem) => {
        if (onFileSelect) {
            onFileSelect(file);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Cargando archivos...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>

                {/* Buscador */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar archivos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </CardHeader>
            <CardContent>
                {filteredFiles.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {fileType === 'images' ? (
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            ) : (
                                <File className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <p className="text-muted-foreground">
                            {searchTerm ? 'No se encontraron archivos' : 'No hay archivos subidos'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredFiles.map((file) => (
                            <div
                                key={file.filename}
                                className={`
                                    border rounded-lg p-4 hover:shadow-md transition-shadow
                                    ${selectable && selectedFiles.has(file.filename) ? 'ring-2 ring-primary' : ''}
                                    ${selectable ? 'cursor-pointer' : ''}
                                `}
                                onClick={() => selectable && toggleFileSelection(file.filename)}
                            >
                                {/* Preview */}
                                <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                    {fileType === 'images' ? (
                                        <img
                                            src={file.url}
                                            alt={file.filename}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <File className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Información */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium truncate" title={file.filename}>
                                        {file.filename}
                                    </p>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{formatFileSize(file.size)}</span>
                                        <span>{formatDate(file.modified_at)}</span>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                    <div className="flex space-x-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(file.url, '_blank');
                                            }}
                                            title="Ver archivo"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyUrl(file.url);
                                            }}
                                            title="Copiar URL"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        {onFileSelect && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileSelect(file);
                                                }}
                                                title="Seleccionar"
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFile(file.filename);
                                        }}
                                        disabled={deleteLoading === file.filename}
                                        title="Eliminar"
                                    >
                                        {deleteLoading === file.filename ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Información adicional */}
                {filteredFiles.length > 0 && (
                    <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <span>{filteredFiles.length} archivos</span>
                            <span>
                                {formatFileSize(
                                    filteredFiles.reduce((total, file) => total + file.size, 0)
                                )} total
                            </span>
                        </div>
                        {selectable && selectedFiles.size > 0 && (
                            <div className="mt-2">
                                {selectedFiles.size} archivo(s) seleccionado(s)
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
