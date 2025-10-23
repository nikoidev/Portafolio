'use client';

import { getImageUrl } from '@/lib/api';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

interface GalleryImage {
    url: string;
    title?: string;
    order?: number;
}

interface ImageGalleryProps {
    images: GalleryImage[];
    className?: string;
}

export function ImageGallery({ images, className = '' }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const sortedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Block body scroll when lightbox is open
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isLightboxOpen]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
    };

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsLightboxOpen(true);
    };

    if (sortedImages.length === 0) {
        return null;
    }

    return (
        <>
            {/* Gallery */}
            <div className={`relative ${className}`}>
                {/* Main Image */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer" onClick={() => openLightbox(currentIndex)}>
                    <img
                        src={getImageUrl(sortedImages[currentIndex].url)}
                        alt={sortedImages[currentIndex].title || `Screenshot ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-2 text-white">
                            <ZoomIn className="w-6 h-6" />
                            <span className="text-sm font-medium">Click para ampliar</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                {sortedImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {sortedImages.length}
                </div>

                {/* Title - Solo si no hay descripción debajo */}
                {sortedImages[currentIndex].title && !sortedImages[currentIndex].title.length && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm max-w-md">
                        {sortedImages[currentIndex].title}
                    </div>
                )}

                {/* Description below image */}
                {sortedImages[currentIndex].title && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                        <p className="text-sm text-foreground/80">
                            <span className="font-semibold">Descripción:</span> {sortedImages[currentIndex].title}
                        </p>
                    </div>
                )}

                {/* Thumbnails */}
                {sortedImages.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {sortedImages.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${index === currentIndex
                                    ? 'border-primary scale-105'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                title={image.title || `Imagen ${index + 1}`}
                            >
                                <img
                                    src={getImageUrl(image.url)}
                                    alt={image.title || `Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    {/* Header with close button and counter */}
                    <div className="flex items-center justify-between p-4 flex-shrink-0">
                        <div className="text-white text-lg font-medium">
                            {currentIndex + 1} / {sortedImages.length}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLightboxOpen(false);
                            }}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Navigation buttons */}
                    {sortedImages.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                            >
                                <ChevronRight className="w-8 h-8" />
                            </Button>
                        </>
                    )}

                    {/* Scrollable content area */}
                    <div
                        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="max-w-7xl mx-auto flex flex-col items-center justify-start min-h-full py-4">
                            {/* Image */}
                            <img
                                src={getImageUrl(sortedImages[currentIndex].url)}
                                alt={sortedImages[currentIndex].title || `Screenshot ${currentIndex + 1}`}
                                className="max-w-full h-auto object-contain rounded-lg"
                                style={{ maxHeight: 'calc(100vh - 200px)' }}
                            />

                            {/* Description */}
                            {sortedImages[currentIndex].title && (
                                <div className="mt-6 w-full max-w-3xl">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                        <p className="text-white text-base leading-relaxed">
                                            <span className="font-semibold text-white/90">Descripción: </span>
                                            {sortedImages[currentIndex].title}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

