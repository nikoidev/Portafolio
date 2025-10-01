'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';

interface VideoPlayerProps {
    type: 'youtube' | 'local';
    url: string;
    thumbnail?: string;
    title?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    className?: string;
}

export function VideoPlayer({
    type,
    url,
    thumbnail,
    title = 'Video demo',
    autoPlay = false,
    muted = true,
    loop = true,
    className = '',
}: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(autoPlay);

    // Extraer ID de YouTube
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = type === 'youtube' ? getYouTubeId(url) : null;

    if (type === 'youtube' && youtubeId) {
        return (
            <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
                {!isPlaying && thumbnail ? (
                    <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                        <img
                            src={thumbnail}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${youtubeId}`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                )}
            </div>
        );
    }

    // Video local
    return (
        <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
            <video
                src={url}
                title={title}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                controls
                className="w-full h-full"
                poster={thumbnail}
            >
                Tu navegador no soporta el tag de video.
            </video>
        </div>
    );
}

