'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { ImageIcon, Loader2, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface ProjectImage {
    url: string;
    title?: string;
    order?: number;
}

interface ProjectImageManagerProps {
    projectId: number;
    projectTitle: string;
    currentImages: ProjectImage[];
    onImagesUpdate: (images: ProjectImage[]) => void;
}

export function ProjectImageManager({
    projectId,
    projectTitle,
    currentImages,
    onImagesUpdate
}: ProjectImageManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState<ProjectImage[]>(currentImages);
    const [isUploading, setIsUploading] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<Array<{
        file: File;
        preview: string;
        title: string;
    }>>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            title: ''
        }));
        setPendingFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
        },
        // Sin límite de imágenes
        disabled: isUploading
    });

    const handleUploadImages = async () => {
        if (pendingFiles.length === 0) {
            toast.error('No hay imágenes para subir');
            return;
        }

        // Validar que todas tengan descripción
        const missingTitles = pendingFiles.some(f => !f.title.trim());
        if (missingTitles) {
            toast.error('Todas las imágenes deben tener una descripción');
            return;
        }

        setIsUploading(true);

        try {
            const uploadedImages: ProjectImage[] = [];

            for (const pending of pendingFiles) {
                const formData = new FormData();
                formData.append('file', pending.file);
                formData.append('optimize', 'true');
                formData.append('project_slug', projectId.toString());

                const result = await api.uploadImage(formData);

                uploadedImages.push({
                    url: result.data.url,
                    title: pending.title,
                    order: images.length + uploadedImages.length + 1
                });
            }

            const updatedImages = [...images, ...uploadedImages];
            setImages(updatedImages);
            onImagesUpdate(updatedImages);
            setPendingFiles([]);

            toast.success(`${uploadedImages.length} imagen(es) subida(s) correctamente`);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al subir imágenes');
        } finally {
            setIsUploading(false);
        }
    };

    const removePendingFile = (index: number) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
    };

    const updatePendingTitle = (index: number, title: string) => {
        setPendingFiles(prev => prev.map((item, i) =>
            i === index ? { ...item, title } : item
        ));
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
            .map((img, i) => ({ ...img, order: i + 1 }));
        setImages(updatedImages);
        onImagesUpdate(updatedImages);
        toast.success('Imagen eliminada');
    };

    const updateImageTitle = (index: number, title: string) => {
        const updatedImages = images.map((img, i) =>
            i === index ? { ...img, title } : img
        );
        setImages(updatedImages);
        onImagesUpdate(updatedImages);
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        const newImages = [...images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newImages.length) return;

        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

        const reordered = newImages.map((img, i) => ({ ...img, order: i + 1 }));
        setImages(reordered);
        onImagesUpdate(reordered);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Gestionar Imágenes del Proyecto ({images.length})
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gestionar Imágenes - {projectTitle}</DialogTitle>
                    <DialogDescription>
                        Sube imágenes con descripciones para mostrar en la galería del proyecto
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Zona de carga */}
                    <div className="border-2 border-dashed rounded-lg p-8">
                        <div {...getRootProps()} className={`cursor-pointer text-center ${isDragActive ? 'bg-primary/5' : ''}`}>
                            <input {...getInputProps()} />
                            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                                {isDragActive ? '¡Suelta las imágenes aquí!' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Puedes subir todas las imágenes que necesites, 10MB por archivo
                            </p>
                        </div>
                    </div>

                    {/* Archivos pendientes de subir */}
                    {pendingFiles.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold">Imágenes pendientes ({pendingFiles.length})</h3>
                            {pendingFiles.map((pending, index) => (
                                <div key={index} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex gap-4">
                                        <img
                                            src={pending.preview}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <div className="flex-1 space-y-2">
                                            <Label>Descripción de la imagen *</Label>
                                            <Textarea
                                                value={pending.title}
                                                onChange={(e) => updatePendingTitle(index, e.target.value)}
                                                placeholder="Ej: Dashboard principal mostrando estadísticas en tiempo real"
                                                rows={2}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePendingFile(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={handleUploadImages}
                                disabled={isUploading}
                                className="w-full"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Subiendo...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Subir {pendingFiles.length} imagen(es)
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Imágenes ya subidas */}
                    {images.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold">Imágenes del proyecto ({images.length})</h3>
                            {images.map((image, index) => (
                                <div key={index} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex gap-4">
                                        <img
                                            src={`http://localhost:8004${image.url}`}
                                            alt={image.title || 'Imagen del proyecto'}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <div className="flex-1 space-y-2">
                                            <Label>Descripción</Label>
                                            <Input
                                                value={image.title || ''}
                                                onChange={(e) => updateImageTitle(index, e.target.value)}
                                                placeholder="Descripción de la imagen"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Orden: {image.order || index + 1}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => moveImage(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                ↑
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => moveImage(index, 'down')}
                                                disabled={index === images.length - 1}
                                            >
                                                ↓
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeImage(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {images.length === 0 && pendingFiles.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No hay imágenes aún. Sube algunas para comenzar.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

