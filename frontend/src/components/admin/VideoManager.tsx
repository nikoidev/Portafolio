'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { upload } from '@vercel/blob/client';
import { Loader2, Trash2, Upload, Video, Youtube } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface VideoManagerProps {
    projectId: string;
    projectTitle: string;
    currentVideo?: {
        type: string | null;
        url: string | null;
        thumbnail: string | null;
    };
    onVideoUpdate: (video: { type: string | null; url: string | null; thumbnail: string | null }) => void;
}

export function VideoManager({
    projectId,
    projectTitle,
    currentVideo,
    onVideoUpdate
}: VideoManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState(currentVideo?.type === 'youtube' ? currentVideo.url || '' : '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const extractYoutubeId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([^&\n?#]+)$/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match?.[1]) return match[1];
        }
        return null;
    };

    const handleSaveYoutube = () => {
        if (!youtubeUrl.trim()) { toast.error('Ingresa una URL de YouTube válida'); return; }
        const videoId = extractYoutubeId(youtubeUrl);
        if (!videoId) { toast.error('URL de YouTube inválida'); return; }

        onVideoUpdate({
            type: 'youtube',
            url: `https://www.youtube.com/embed/${videoId}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        });
        toast.success('Video de YouTube agregado');
        setIsOpen(false);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) setSelectedFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'video/*': ['.mp4', '.webm', '.mov', '.avi'] },
        maxFiles: 1,
        disabled: isUploading,
    });

    // Uses Vercel Blob client-side upload (signed URL) — supports files > 4.5 MB
    const handleUploadLocalVideo = async () => {
        if (!selectedFile) { toast.error('Selecciona un video primero'); return; }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const filename = `videos/${projectId}/${Date.now()}-${selectedFile.name}`;

            const blob = await upload(filename, selectedFile, {
                access: 'public',
                handleUploadUrl: '/api/uploads/presigned',
                onUploadProgress: ({ percentage }) => setUploadProgress(Math.round(percentage)),
            });

            setUploadProgress(100);
            onVideoUpdate({ type: 'local', url: blob.url, thumbnail: null });
            toast.success('Video subido correctamente');
            setSelectedFile(null);
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Error al subir el video');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveVideo = () => {
        onVideoUpdate({ type: null, url: null, thumbnail: null });
        setYoutubeUrl('');
        setSelectedFile(null);
        toast.success('Video eliminado');
    };

    const hasVideo = currentVideo?.url;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant={hasVideo ? 'outline' : 'default'}>
                    <Video className="w-4 h-4 mr-2" />
                    {hasVideo ? 'Cambiar Video Demo' : 'Agregar Video Demo'}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gestionar Video del Proyecto</DialogTitle>
                    <DialogDescription>
                        Agrega un video de demostración desde YouTube o sube un archivo local
                    </DialogDescription>
                </DialogHeader>

                {hasVideo && (
                    <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Video Actual</h3>
                            <Button type="button" variant="destructive" size="sm" onClick={handleRemoveVideo}>
                                <Trash2 className="w-4 h-4 mr-2" />Eliminar
                            </Button>
                        </div>
                        <div className="aspect-video bg-black rounded overflow-hidden">
                            {currentVideo?.type === 'youtube' ? (
                                <iframe src={currentVideo.url || ''} className="w-full h-full" allowFullScreen />
                            ) : (
                                <video src={currentVideo?.url || ''} controls className="w-full h-full" />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Tipo: {currentVideo?.type === 'youtube' ? 'YouTube' : 'Video Local'}
                        </p>
                    </div>
                )}

                <Tabs defaultValue="youtube" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="youtube"><Youtube className="w-4 h-4 mr-2" />YouTube</TabsTrigger>
                        <TabsTrigger value="local"><Upload className="w-4 h-4 mr-2" />Video Local</TabsTrigger>
                    </TabsList>

                    <TabsContent value="youtube" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="youtube-url">URL del Video de YouTube</Label>
                            <Input
                                id="youtube-url"
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Formatos: youtube.com/watch?v=ID, youtu.be/ID, o solo el ID
                            </p>
                        </div>

                        {youtubeUrl && extractYoutubeId(youtubeUrl) && (
                            <div className="aspect-video bg-black rounded overflow-hidden">
                                <iframe
                                    src={`https://www.youtube.com/embed/${extractYoutubeId(youtubeUrl)}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        <Button onClick={handleSaveYoutube} className="w-full" disabled={!youtubeUrl || !extractYoutubeId(youtubeUrl)}>
                            Guardar Video de YouTube
                        </Button>
                    </TabsContent>

                    <TabsContent value="local" className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8">
                            <div {...getRootProps()} className={`cursor-pointer text-center ${isDragActive ? 'bg-primary/5' : ''}`}>
                                <input {...getInputProps()} />
                                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-2">
                                    {isDragActive ? '¡Suelta el video aquí!' : 'Arrastra un video o haz clic para seleccionar'}
                                </p>
                                <p className="text-xs text-muted-foreground">MP4, WebM, MOV — sin límite de tamaño (upload directo a Blob)</p>
                            </div>
                        </div>

                        {selectedFile && (
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-medium">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="aspect-video bg-black rounded overflow-hidden mt-4">
                                    <video src={URL.createObjectURL(selectedFile)} controls className="w-full h-full" />
                                </div>
                            </div>
                        )}

                        {isUploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subiendo...</span><span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                                </div>
                            </div>
                        )}

                        <Button onClick={handleUploadLocalVideo} className="w-full" disabled={!selectedFile || isUploading}>
                            {isUploading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Subiendo...</>
                            ) : (
                                <><Upload className="w-4 h-4 mr-2" />Subir Video</>
                            )}
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
