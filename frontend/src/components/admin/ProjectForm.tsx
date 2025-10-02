'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ProjectImageManager } from './ProjectImageManager';

const projectSchema = z.object({
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
    slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    short_description: z.string().min(10, 'La descripción corta debe tener al menos 10 caracteres'),
    content: z.string().optional(),
    github_url: z.string().url('URL inválida').optional().or(z.literal('')),
    thumbnail_url: z.string().url('URL inválida').optional().or(z.literal('')),
    technologies: z.string().min(1, 'Debes agregar al menos una tecnología'),
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
    const [projectImages, setProjectImages] = useState<Array<{ url: string; title: string; order: number }>>(
        project?.demo_images || []
    );

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: project?.title || '',
            slug: project?.slug || '',
            description: project?.description || '',
            short_description: project?.short_description || '',
            content: project?.content || '',
            github_url: project?.github_url || '',
            thumbnail_url: project?.thumbnail_url || '',
            technologies: project?.technologies?.join(', ') || '',
            tags: project?.tags?.join(', ') || '',
            is_featured: project?.is_featured || false,
            is_published: project?.is_published || false,
            order_index: project?.order_index || 0,
        },
    });

    const handleSubmit = async (values: ProjectFormValues) => {
        // Validar que haya al menos una tecnología
        const technologies = values.technologies
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech.length > 0);

        if (technologies.length === 0) {
            toast.error('Error de validación', {
                description: 'Debes agregar al menos una tecnología al proyecto',
                icon: <AlertCircle className="h-4 w-4" />,
            });
            return;
        }

        // Procesar los datos antes de enviar
        const processedData = {
            ...values,
            technologies,
            tags: values.tags
                ? values.tags
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0)
                : [],
            github_url: values.github_url || null,
            thumbnail_url: values.thumbnail_url || (projectImages.length > 0 ? projectImages[0].url : null),
            // Imágenes del proyecto con descripciones
            demo_images: projectImages.length > 0 ? projectImages : [],
            // Mantener images legacy vacío
            images: [],
            // Campos de video como null si están vacíos
            demo_video_type: null,
            demo_video_url: null,
            demo_video_thumbnail: null,
        };

        try {
            const success = await onSubmit(processedData);
            if (success) {
                toast.success('¡Éxito!', {
                    description: project ? 'Proyecto actualizado correctamente' : 'Proyecto creado correctamente',
                });
                router.push('/admin/projects');
            } else {
                toast.error('Error', {
                    description: 'No se pudo guardar el proyecto. Por favor, revisa los campos obligatorios.',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
            }
        } catch (error: any) {
            toast.error('Error al guardar', {
                description: error.message || 'Ocurrió un error inesperado',
                icon: <AlertCircle className="h-4 w-4" />,
            });
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
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-1">Campos obligatorios</h4>
                            <p className="text-sm text-blue-800">
                                Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios:
                                <strong> Título, Slug, Descripción, Descripción Corta y Tecnologías</strong>.
                            </p>
                        </div>
                    </div>
                </div>

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
                                            <FormLabel>Slug *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="mi-proyecto-increible" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                URL amigable para el proyecto (ej: mi-proyecto)
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
                                            <FormLabel>Descripción Corta *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Una breve descripción del proyecto..." {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Mínimo 10 caracteres
                                            </FormDescription>
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


                                {/* Gestor de Imágenes - Solo si el proyecto ya existe */}
                                {project?.id && (
                                    <div className="space-y-2">
                                        <Label>Imágenes del Proyecto</Label>
                                        <ProjectImageManager
                                            projectId={project.id}
                                            projectTitle={project.title}
                                            currentImages={projectImages}
                                            onImagesUpdate={setProjectImages}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {projectImages.length} imagen(es) cargada(s). Cada imagen puede tener su propia descripción.
                                        </p>
                                    </div>
                                )}

                                {/* Mensaje si es proyecto nuevo */}
                                {!project?.id && (
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            📸 Las imágenes se pueden agregar después de crear el proyecto
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Primero guarda el proyecto con la información básica, luego podrás gestionar las imágenes
                                        </p>
                                    </div>
                                )}

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
                                    <>{project ? 'Actualizar' : 'Crear Proyecto'}</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
