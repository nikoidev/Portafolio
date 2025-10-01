'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth';
import { ROLE_DESCRIPTIONS, ROLE_LABELS, User, UserCreate, UserRole, UserUpdate } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const userSchema = z.object({
    email: z.string().email('Email inválido'),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional().or(z.literal('')),
    role: z.nativeEnum(UserRole),
    is_active: z.boolean().default(true),
    bio: z.string().optional(),
    avatar_url: z.string().url('URL inválida').optional().or(z.literal('')),
    github_url: z.string().url('URL inválida').optional().or(z.literal('')),
    linkedin_url: z.string().url('URL inválida').optional().or(z.literal('')),
    twitter_url: z.string().url('URL inválida').optional().or(z.literal('')),
    website_url: z.string().url('URL inválida').optional().or(z.literal('')),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
    user?: User;
    onSubmit: (data: UserCreate | UserUpdate) => Promise<boolean>;
    isLoading?: boolean;
}

export function UserForm({ user, onSubmit, isLoading = false }: UserFormProps) {
    const router = useRouter();
    const { user: currentUser, isSuperAdmin } = useAuthStore();
    const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

    useEffect(() => {
        // Determinar roles disponibles según el usuario actual
        const roles: UserRole[] = [];

        if (isSuperAdmin()) {
            // Super admin puede asignar todos los roles
            roles.push(
                UserRole.SUPER_ADMIN,
                UserRole.ADMIN,
                UserRole.EDITOR,
                UserRole.VIEWER
            );
        } else if (currentUser?.role === UserRole.ADMIN) {
            // Admin puede asignar todos excepto super admin
            roles.push(
                UserRole.ADMIN,
                UserRole.EDITOR,
                UserRole.VIEWER
            );
        } else {
            // Editor/Viewer solo pueden asignar editor y viewer
            roles.push(
                UserRole.EDITOR,
                UserRole.VIEWER
            );
        }

        setAvailableRoles(roles);
    }, [currentUser, isSuperAdmin]);

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: user?.email || '',
            name: user?.name || '',
            password: '',
            role: user?.role || UserRole.EDITOR,
            is_active: user?.is_active ?? true,
            bio: user?.bio || '',
            avatar_url: user?.avatar_url || '',
            github_url: user?.github_url || '',
            linkedin_url: user?.linkedin_url || '',
            twitter_url: user?.twitter_url || '',
            website_url: user?.website_url || '',
        },
    });

    const handleSubmit = async (values: UserFormValues) => {
        const processedData: any = {
            ...values,
            password: values.password || undefined,
        };

        // Limpiar URLs vacías
        Object.keys(processedData).forEach(key => {
            if (processedData[key] === '') {
                processedData[key] = undefined;
            }
        });

        const success = await onSubmit(processedData);
        if (success) {
            router.push('/admin/users');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {user ? 'Editar Usuario' : 'Nuevo Usuario'}
                </CardTitle>
                <CardDescription>
                    {user
                        ? 'Actualiza la información del usuario y sus permisos'
                        : 'Crea un nuevo usuario y asigna su rol en el sistema'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información básica */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Juan Pérez" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="juan@ejemplo.com"
                                                    {...field}
                                                    disabled={!!user} // No permitir cambiar email en edición
                                                />
                                            </FormControl>
                                            {user && (
                                                <FormDescription>
                                                    El email no se puede modificar
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {user ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder={user ? 'Dejar vacío para mantener' : '••••••••'}
                                                    {...field}
                                                />
                                            </FormControl>
                                            {user && (
                                                <FormDescription>
                                                    Solo completa si quieres cambiar la contraseña
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Biografía</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Una breve descripción sobre el usuario..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Rol y configuración */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rol *</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    disabled={user?.id === currentUser?.id} // No permitir cambiar propio rol
                                                >
                                                    {availableRoles.map((role) => (
                                                        <option key={role} value={role}>
                                                            {ROLE_LABELS[role]}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormDescription>
                                                {ROLE_DESCRIPTIONS[field.value as UserRole]}
                                            </FormDescription>
                                            {user?.id === currentUser?.id && (
                                                <FormDescription className="text-destructive">
                                                    No puedes cambiar tu propio rol
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    className="rounded border-gray-300"
                                                    disabled={user?.id === currentUser?.id}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Usuario Activo</FormLabel>
                                                <FormDescription>
                                                    Los usuarios inactivos no pueden iniciar sesión
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-2">
                                    <FormLabel>Redes Sociales (opcional)</FormLabel>

                                    <FormField
                                        control={form.control}
                                        name="github_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="https://github.com/usuario" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="linkedin_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="https://linkedin.com/in/usuario" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="twitter_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="https://twitter.com/usuario" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="website_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="https://sitio-web.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

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
                                    user ? 'Actualizar Usuario' : 'Crear Usuario'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
