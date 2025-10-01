'use client';

import { SectionEditor } from '@/components/cms/SectionEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cmsApi } from '@/lib/cms-api';
import { PAGE_LABELS, PageContent } from '@/types/cms';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditPageCMS() {
    const params = useParams();
    const pageKey = params.page as string;
    const [sections, setSections] = useState<PageContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSectionKeys, setEditingSectionKeys] = useState<{ pageKey: string; sectionKey: string } | null>(null);

    useEffect(() => {
        loadSections();
    }, [pageKey]);

    const loadSections = async () => {
        try {
            setIsLoading(true);
            const data = await cmsApi.getPageSections(pageKey);
            setSections(data);
        } catch (error: any) {
            toast.error('Error al cargar secciones');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (section: PageContent) => {
        setEditingSectionKeys({
            pageKey: section.page_key,
            sectionKey: section.section_key
        });
    };

    const handleClose = () => {
        setEditingSectionKeys(null);
        loadSections();
    };

    const pageLabel = PAGE_LABELS[pageKey as keyof typeof PAGE_LABELS] || pageKey;

    return (
        <div>
            <div className="mb-8">
                <Link href="/admin/cms">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al CMS
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Editar: {pageLabel}</h1>
                <p className="text-muted-foreground mt-2">
                    Gestiona el contenido de las secciones de esta página
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {sections.map((section) => (
                        <Card key={section.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{section.title}</CardTitle>
                                        <CardDescription>{section.description}</CardDescription>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleEdit(section)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    {Object.keys(section.content).length} campos configurables
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal de edición (mismo que la edición visual) */}
            {editingSectionKeys && (
                <SectionEditor
                    pageKey={editingSectionKeys.pageKey}
                    sectionKey={editingSectionKeys.sectionKey}
                    isOpen={true}
                    onClose={handleClose}
                    onSaved={loadSections}
                />
            )}
        </div>
    );
}
