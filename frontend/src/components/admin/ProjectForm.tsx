'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ImageSelector } from './ImageSelector';

const projectSchema = z.object({
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
    slug: z.string().optional(),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    short_description: z.string().optional(),
    content: z.string().optional(),
    github_url: z.string().url('URL inválida').optional().or(z.literal('')),
    live_demo_url: z.string().url('URL inválida').optional().or(z.literal('')),
    demo_type: z.enum(['iframe', 'link', 'video', 'images']).optional(),
    thumbnail_url: z.string().url('URL inválida').optional().or(z.literal('')),
    images: z.array(z.string()).default([]),
    technologies: z.string(),
    tags: z.string().optional(),
    is_featured: z.boolean().default(false),
    is_published: z.boolean().default(false),
    order_index: z.number().default(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
    project?: Project;
    onSubmit: (data: any) => Promise<boolean>;
    isLoading?: boolean;
}

export function ProjectForm({ project, onSubmit, isLoading = false }: ProjectFormProps) {
    const router = useRouter();

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: project?.title || '',
            slug: project?.slug || '',
            description: project?.description || '',
            short_description: project?.short_description || '',
            content: project?.content || '',
            github_url: project?.github_url || '',
            live_demo_url: project?.live_demo_url || '',
            demo_type: project?.demo_type || 'link',
            thumbnail_url: project?.thumbnail_url || '',
            images: project?.images || [],
            technologies: project?.technologies?.join(', ') || '',
            tags: project?.tags?.join(', ') || '',
            is_featured: project?.is_featured || false,
            is_published: project?.is_published || false,
            order_index: project?.order_index || 0,
        },
    });

    const handleSubmit = async (values: ProjectFormValues) => {
        // Procesar los datos antes de enviar
        const processedData = {
            ...values,
            technologies: values.technologies
                .split(',')
                .map(tech => tech.trim())
                .filter(tech => tech.length > 0),
            tags: values.tags
                ? values.tags
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0)
                : [],
            github_url: values.github_url || undefined,
            live_demo_url: values.live_demo_url || undefined,
            thumbnail_url: values.thumbnail_url || (values.images.length > 0 ? values.images[0] : undefined),
            // Mantener images para compatibilidad
            images: values.images,
            // Inicializar campos de demo vacíos si no están presentes
            demo_video_type: undefined,
            demo_video_url: undefined,
            demo_video_thumbnail: undefined,
            demo_images: [],
            live_demo_type: values.live_demo_url ? 'external' : undefined,
        };

        const success = await onSubmit(processedData);
        if (success) {
            router.push('/admin/projects');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información básica */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Título *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mi Proyecto Increíble" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="mi-proyecto-increible" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Se generará automáticamente si se deja vacío
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="short_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción Corta</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Una breve descripción..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="technologies"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tecnologías *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="React, Next.js, TypeScript" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Separar con comas
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Etiquetas</FormLabel>
                                            <FormControl>
                                                <Input placeholder="web, frontend, api" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Separar con comas
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* URLs y configuración */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="github_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL de GitHub</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://github.com/usuario/proyecto" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="live_demo_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL del Demo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://mi-proyecto.vercel.app" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                URL del proyecto desplegado o demo en vivo
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="demo_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Demo</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="iframe">Iframe (Interactivo)</option>
                                                    <option value="link">Enlace Externo</option>
                                                    <option value="video">Video</option>
                                                    <option value="images">Solo Imágenes</option>
                                                </select>
                                            </FormControl>
                                            <FormDescription>
                                                Iframe: Muestra el proyecto en un modal interactivo<br />
                                                Enlace: Abre en nueva pestaña<br />
                                                Video: Muestra un video del demo<br />
                                                Imágenes: Solo muestra las capturas de pantalla
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Imágenes del Proyecto</FormLabel>
                                            <FormControl>
                                                <ImageSelector
                                                    selectedImages={field.value}
                                                    onImagesChange={field.onChange}
                                                    maxImages={5}
                                                    title="Seleccionar Imágenes del Proyecto"
                                                    description="Elige hasta 5 imágenes para mostrar en tu proyecto"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                La primera imagen será la imagen principal del proyecto
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="thumbnail_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL de Imagen Manual (Opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Solo si quieres usar una imagen externa en lugar de las subidas
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="order_index"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Orden</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Orden de aparición (menor número = primero)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="is_published"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        className="rounded border-gray-300"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Publicado</FormLabel>
                                                    <FormDescription>
                                                        Visible en el sitio público
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_featured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        className="rounded border-gray-300"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Destacado</FormLabel>
                                                    <FormDescription>
                                                        Aparece en la página principal
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Descripción completa */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descripción detallada del proyecto..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contenido Detallado</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Contenido completo del proyecto (Markdown soportado)..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Puedes usar Markdown para formatear el contenido
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Botones */}
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    project ? 'Actualizar' : 'Crear Proyecto'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
