'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Maximize2, Minimize2, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    demoUrl: string;
    projectTitle: string;
    demoType?: 'iframe' | 'link' | 'video' | 'images';
}

export function DemoModal({
    isOpen,
    onClose,
    demoUrl,
    projectTitle,
    demoType = 'iframe'
}: DemoModalProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);

    const handleRefresh = () => {
        setIframeKey(prev => prev + 1);
    };

    const handleOpenInNewTab = () => {
        window.open(demoUrl, '_blank', 'noopener,noreferrer');
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Si el tipo de demo es 'link', simplemente abrir en nueva pestaña
    if (demoType === 'link') {
        if (isOpen) {
            handleOpenInNewTab();
            onClose();
        }
        return null;
    }

    // Si el tipo de demo es 'video', mostrar el video
    if (demoType === 'video') {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-6xl w-full h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{projectTitle} - Demo</DialogTitle>
                        <DialogDescription>
                            Video demostración del proyecto
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 relative">
                        <video
                            key={iframeKey}
                            src={demoUrl}
                            controls
                            className="w-full h-full rounded-lg"
                        >
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                    <div className="flex justify-between items-center gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reiniciar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Para iframe (default) - Demo interactivo
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={`${isFullscreen
                        ? 'max-w-full w-screen h-screen p-2'
                        : 'max-w-7xl w-full h-[90vh]'
                    } transition-all duration-200`}
            >
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle>{projectTitle} - Demo en Vivo</DialogTitle>
                            <DialogDescription>
                                Interactúa con el proyecto en tiempo real. Puedes navegar, hacer clic y probar todas las funcionalidades.
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleFullscreen}
                                title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="w-4 h-4" />
                                ) : (
                                    <Maximize2 className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 relative bg-muted rounded-lg overflow-hidden">
                    {/* Iframe del demo */}
                    <iframe
                        key={iframeKey}
                        src={demoUrl}
                        className="w-full h-full border-0"
                        title={`Demo de ${projectTitle}`}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                        loading="lazy"
                    />
                </div>

                {/* Controles */}
                <div className="flex justify-between items-center gap-2 pt-4">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reiniciar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenInNewTab}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir en nueva pestaña
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
