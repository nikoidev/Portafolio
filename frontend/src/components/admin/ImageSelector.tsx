'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { FileGallery } from './FileGallery';
import { FileUpload } from './FileUpload';

interface FileItem {
    filename: string;
    url: string;
    size: number;
    created_at: string;
    modified_at: string;
}

interface ImageSelectorProps {
    selectedImages: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    title?: string;
    description?: string;
}

export function ImageSelector({
    selectedImages,
    onImagesChange,
    maxImages = 5,
    title = 'Seleccionar Imágenes',
    description = 'Elige imágenes para tu proyecto'
}: ImageSelectorProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleImageSelect = (file: FileItem) => {
        if (selectedImages.includes(file.url)) {
            // Si ya está seleccionada, la removemos
            onImagesChange(selectedImages.filter(url => url !== file.url));
        } else if (selectedImages.length < maxImages) {
            // Si no está seleccionada y no hemos alcanzado el límite, la agregamos
            onImagesChange([...selectedImages, file.url]);
        }
    };

    const removeImage = (urlToRemove: string) => {
        onImagesChange(selectedImages.filter(url => url !== urlToRemove));
    };

    const handleUploadComplete = (results: any[]) => {
        // Refrescar la galería y agregar automáticamente las nuevas imágenes
        setRefreshKey(prev => prev + 1);

        const newImageUrls = results.map(result => result.data.url);
        const updatedImages = [...selectedImages];

        newImageUrls.forEach(url => {
            if (!updatedImages.includes(url) && updatedImages.length < maxImages) {
                updatedImages.push(url);
            }
        });

        onImagesChange(updatedImages);
    };

    return (
        <div className="space-y-4">
            {/* Imágenes seleccionadas */}
            {selectedImages.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Imágenes Seleccionadas</CardTitle>
                        <CardDescription>
                            {selectedImages.length} de {maxImages} imágenes seleccionadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {selectedImages.map((imageUrl, index) => (
                                <div key={imageUrl} className="relative group">
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={`Imagen seleccionada ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(imageUrl)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    {index === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                            Principal
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Botón para abrir selector */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 border-dashed"
                        disabled={selectedImages.length >= maxImages}
                    >
                        <div className="text-center">
                            <Plus className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-medium">
                                {selectedImages.length >= maxImages
                                    ? `Máximo ${maxImages} imágenes alcanzado`
                                    : 'Seleccionar Imágenes'
                                }
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {selectedImages.length}/{maxImages} seleccionadas
                            </p>
                        </div>
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Upload rápido */}
                        <FileUpload
                            accept={{
                                'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
                            }}
                            maxFiles={5}
                            uploadType="images"
                            onUploadComplete={handleUploadComplete}
                            title="Subir Nuevas Imágenes"
                            description="Sube imágenes y se seleccionarán automáticamente"
                        />

                        {/* Galería para seleccionar */}
                        <FileGallery
                            key={`selector-${refreshKey}`}
                            fileType="images"
                            title="Galería de Imágenes"
                            description="Haz clic en las imágenes para seleccionarlas"
                            selectable={true}
                            onFileSelect={handleImageSelect}
                        />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            {selectedImages.length} de {maxImages} imágenes seleccionadas
                        </div>
                        <Button onClick={() => setIsDialogOpen(false)}>
                            Confirmar Selección
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Información adicional */}
            {selectedImages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay imágenes seleccionadas</p>
                    <p className="text-sm">
                        Haz clic en "Seleccionar Imágenes" para elegir imágenes para tu proyecto
                    </p>
                </div>
            )}
        </div>
    );
}
