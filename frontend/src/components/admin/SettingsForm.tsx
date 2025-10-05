'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings, SettingsUpdate, SocialLink } from '@/types/settings';
import {
    Bell,
    Globe,
    Mail,
    Newspaper,
    Plus,
    RotateCcw,
    Save,
    Search,
    Share2,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface SettingsFormProps {
    settings: Settings;
    onSave: (data: SettingsUpdate) => Promise<void>;
    onReset?: () => Promise<void>;
}

export function SettingsForm({ settings, onSave, onReset }: SettingsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(settings.social_links || []);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SettingsUpdate>({
        defaultValues: {
            ...settings,
            social_links: socialLinks
        }
    });

    const themeMode = watch('theme_mode', settings.theme_mode);
    const maintenanceMode = watch('maintenance_mode', settings.maintenance_mode);
    const bannerEnabled = watch('banner_enabled', settings.banner_enabled);
    const newsletterEnabled = watch('newsletter_enabled', settings.newsletter_enabled);

    const onSubmit = async (data: SettingsUpdate) => {
        // Validar que todas las redes sociales tengan campos completos
        const incompleteSocialLinks = socialLinks.filter(
            link => !link.name.trim() || !link.url.trim() || !link.icon.trim()
        );

        if (incompleteSocialLinks.length > 0) {
            toast.error('Por favor completa todos los campos de las redes sociales o elimínalas');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSave({ ...data, social_links: socialLinks });
            toast.success('Configuración guardada correctamente');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al guardar la configuración');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = async () => {
        if (!onReset) return;

        if (confirm('¿Estás seguro de resetear la configuración a valores por defecto?')) {
            try {
                setIsSubmitting(true);
                await onReset();
                toast.success('Configuración reseteada correctamente');
            } catch (error: any) {
                toast.error(error.response?.data?.detail || 'Error al resetear la configuración');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { name: '', url: '', icon: '', enabled: true }]);
    };

    const removeSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: string | boolean) => {
        const updated = [...socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setSocialLinks(updated);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información del Sitio */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <CardTitle>Información del Sitio</CardTitle>
                            <CardDescription>Configuración general del portafolio</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="site_name">Nombre del Sitio *</Label>
                            <Input
                                id="site_name"
                                {...register('site_name', { required: 'El nombre es requerido' })}
                                placeholder="Mi Portafolio"
                            />
                            {errors.site_name && (
                                <p className="text-sm text-red-500">{errors.site_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="site_logo_url">URL del Logo</Label>
                            <Input
                                id="site_logo_url"
                                {...register('site_logo_url')}
                                placeholder="https://ejemplo.com/logo.png"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="site_description">Descripción del Sitio</Label>
                        <Textarea
                            id="site_description"
                            {...register('site_description')}
                            placeholder="Breve descripción de tu portafolio"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="site_favicon_url">URL del Favicon</Label>
                        <Input
                            id="site_favicon_url"
                            {...register('site_favicon_url')}
                            placeholder="https://ejemplo.com/favicon.ico"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contacto Global */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Mail className="w-5 h-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <CardTitle>Información de Contacto</CardTitle>
                            <CardDescription>Datos de contacto visibles en el sitio</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Email</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                {...register('contact_email')}
                                placeholder="contacto@ejemplo.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact_phone">Teléfono</Label>
                            <Input
                                id="contact_phone"
                                {...register('contact_phone')}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact_location">Ubicación</Label>
                            <Input
                                id="contact_location"
                                {...register('contact_location')}
                                placeholder="Ciudad, País"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact_availability">Disponibilidad</Label>
                            <Input
                                id="contact_availability"
                                {...register('contact_availability')}
                                placeholder="Disponible para proyectos"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Redes Sociales */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <CardTitle>Redes Sociales</CardTitle>
                                <CardDescription>Enlaces a tus perfiles sociales</CardDescription>
                            </div>
                        </div>
                        <Button type="button" onClick={addSocialLink} variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {socialLinks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Share2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No hay redes sociales configuradas</p>
                            <p className="text-sm">Haz clic en "Agregar" para añadir una red social</p>
                        </div>
                    ) : (
                        socialLinks.map((link, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Red Social #{index + 1}</h4>
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor={`social_enabled_${index}`} className="text-sm">Activo</Label>
                                        <Switch
                                            id={`social_enabled_${index}`}
                                            checked={link.enabled}
                                            onCheckedChange={(checked) => updateSocialLink(index, 'enabled', checked)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSocialLink(index)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        placeholder="Nombre (ej: GitHub)"
                                        value={link.name}
                                        onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                                    />
                                    <Input
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Icono (URL o clase)"
                                        value={link.icon}
                                        onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* SEO y Marketing */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Search className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                        </div>
                        <div>
                            <CardTitle>SEO y Marketing</CardTitle>
                            <CardDescription>Optimización para motores de búsqueda</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="seo_title">Título SEO</Label>
                            <Input
                                id="seo_title"
                                {...register('seo_title')}
                                placeholder="Título para motores de búsqueda"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seo_og_image">Imagen OG (Open Graph)</Label>
                            <Input
                                id="seo_og_image"
                                {...register('seo_og_image')}
                                placeholder="https://ejemplo.com/og-image.jpg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="seo_description">Descripción SEO</Label>
                        <Textarea
                            id="seo_description"
                            {...register('seo_description')}
                            placeholder="Descripción para motores de búsqueda"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="seo_keywords">Palabras Clave</Label>
                        <Input
                            id="seo_keywords"
                            {...register('seo_keywords')}
                            placeholder="desarrollo web, portfolio, react, nextjs"
                        />
                        <p className="text-xs text-muted-foreground">Separadas por comas</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                            <Input
                                id="google_analytics_id"
                                {...register('google_analytics_id')}
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="google_search_console">Google Search Console</Label>
                            <Input
                                id="google_search_console"
                                {...register('google_search_console')}
                                placeholder="Código de verificación"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Avisos y Notificaciones */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div>
                            <CardTitle>Avisos y Notificaciones</CardTitle>
                            <CardDescription>Mensajes globales y modo mantenimiento</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Modo Mantenimiento */}
                    <div className="space-y-4 p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="maintenance_mode" className="text-base font-medium">
                                    Modo Mantenimiento
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Deshabilita temporalmente el acceso público al sitio
                                </p>
                            </div>
                            <Switch
                                id="maintenance_mode"
                                checked={maintenanceMode}
                                onCheckedChange={(checked) => setValue('maintenance_mode', checked)}
                            />
                        </div>

                        {maintenanceMode && (
                            <div className="space-y-2">
                                <Label htmlFor="maintenance_message">Mensaje de Mantenimiento</Label>
                                <Textarea
                                    id="maintenance_message"
                                    {...register('maintenance_message')}
                                    placeholder="Estamos realizando mejoras. Volvemos pronto."
                                    rows={2}
                                />
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Banner Global */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="banner_enabled" className="text-base font-medium">
                                    Banner Global
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Muestra un mensaje destacado en todas las páginas
                                </p>
                            </div>
                            <Switch
                                id="banner_enabled"
                                checked={bannerEnabled}
                                onCheckedChange={(checked) => setValue('banner_enabled', checked)}
                            />
                        </div>

                        {bannerEnabled && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="banner_type">Tipo de Banner</Label>
                                    <select
                                        id="banner_type"
                                        {...register('banner_type')}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="info">Información</option>
                                        <option value="success">Éxito</option>
                                        <option value="warning">Advertencia</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="global_banner">Mensaje del Banner</Label>
                                    <Textarea
                                        id="global_banner"
                                        {...register('global_banner')}
                                        placeholder="¡Nuevo proyecto disponible!"
                                        rows={2}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Newsletter e Integraciones */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                            <Newspaper className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div>
                            <CardTitle>Newsletter e Integraciones</CardTitle>
                            <CardDescription>Servicios externos y herramientas</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Newsletter */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="newsletter_enabled" className="text-base font-medium">
                                    Newsletter
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Activar suscripción a newsletter
                                </p>
                            </div>
                            <Switch
                                id="newsletter_enabled"
                                checked={newsletterEnabled}
                                onCheckedChange={(checked) => setValue('newsletter_enabled', checked)}
                            />
                        </div>

                        {newsletterEnabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newsletter_provider">Proveedor</Label>
                                    <Input
                                        id="newsletter_provider"
                                        {...register('newsletter_provider')}
                                        placeholder="ej: Mailchimp, SendGrid"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newsletter_api_key">API Key</Label>
                                    <Input
                                        id="newsletter_api_key"
                                        type="password"
                                        {...register('newsletter_api_key')}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Otras Integraciones */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <h4 className="font-medium">Otras Integraciones</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="facebook_pixel">Facebook Pixel ID</Label>
                                <Input
                                    id="facebook_pixel"
                                    {...register('facebook_pixel')}
                                    placeholder="123456789"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hotjar_id">Hotjar ID</Label>
                                <Input
                                    id="hotjar_id"
                                    {...register('hotjar_id')}
                                    placeholder="1234567"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    disabled={isSubmitting || !onReset}
                    className="w-full sm:w-auto"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Resetear a Predeterminados
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
            </div>
        </form>
    );
}

