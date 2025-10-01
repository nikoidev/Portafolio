'use client';

import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cmsApi } from '@/lib/cms-api';
import { PageInfo } from '@/types/cms';
import { FileText, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CMSPage() {
    const [pages, setPages] = useState<PageInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);

    const loadPages = async () => {
        try {
            setIsLoading(true);
            const data = await cmsApi.getAvailablePages();
            setPages(data);
        } catch (error: any) {
            toast.error('Error al cargar páginas');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, []);

    const handleSeedContent = async () => {
        try {
            setIsSeeding(true);
            await cmsApi.seedDefaultContent();
            toast.success('Contenido inicial creado correctamente');
            loadPages();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al crear contenido');
        } finally {
            setIsSeeding(false);
        }
    };

    const getIcon = (icon: string) => {
        const icons: Record<string, string> = {
            home: '🏠',
            user: '👤',
            folder: '📁',
            mail: '📧',
        };
        return icons[icon] || '📄';
    };

    return (
        <>
            <Header variant="admin" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión Web (CMS)</h1>
                        <p className="text-muted-foreground mt-2">
                            Administra el contenido de todas las páginas del portafolio
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={loadPages}
                            disabled={isLoading}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualizar
                        </Button>
                        <Button
                            onClick={handleSeedContent}
                            disabled={isSeeding}
                        >
                            {isSeeding ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <FileText className="w-4 h-4 mr-2" />
                            )}
                            Crear Contenido Inicial
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pages.map((page) => (
                            <Link key={page.page_key} href={`/admin/cms/${page.page_key}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="text-4xl">{getIcon(page.icon)}</div>
                                            <div>
                                                <CardTitle>{page.label}</CardTitle>
                                                <CardDescription>
                                                    {page.sections_count} {page.sections_count === 1 ? 'sección' : 'secciones'}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {page.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {!isLoading && pages.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No hay contenido</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Crea el contenido inicial para comenzar a gestionar las páginas
                            </p>
                            <Button onClick={handleSeedContent} disabled={isSeeding}>
                                {isSeeding ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <FileText className="w-4 h-4 mr-2" />
                                )}
                                Crear Contenido Inicial
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

