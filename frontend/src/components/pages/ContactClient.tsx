'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCMSContent } from '@/hooks/useCMSContent';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Linkedin, Loader2, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const contactFormSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresa un email válido'),
    subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactClient() {
    // CMS Content
    const { content: headerContent, isLoading: headerLoading, refresh: refreshHeader } = useCMSContent('contact', 'header');

    const defaultHeader = {
        title: 'Contacto',
        subtitle: '¿Tienes un proyecto en mente? ¿Quieres colaborar? Me encantaría escuchar de ti. Contacta conmigo y hablemos de tu próximo proyecto.',
    };

    const header = headerContent || defaultHeader;

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        try {
            // Aquí implementarías el envío del formulario
            // Por ahora, solo mostramos un toast de éxito
            console.log('Contact form data:', data);

            toast.success('¡Mensaje enviado correctamente!', {
                description: 'Te responderé en las próximas 24-48 horas.',
            });

            form.reset();
        } catch (error) {
            toast.error('Error al enviar el mensaje', {
                description: 'Por favor, intenta nuevamente o contacta directamente por email.',
            });
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'tu@email.com',
            href: 'mailto:tu@email.com',
            description: 'Respondo en 24-48 horas'
        },
        {
            icon: Phone,
            label: 'Teléfono',
            value: '+34 XXX XXX XXX',
            href: 'tel:+34XXXXXXXXX',
            description: 'Lun - Vie, 9:00 - 18:00'
        },
        {
            icon: MapPin,
            label: 'Ubicación',
            value: 'Madrid, España',
            href: 'https://maps.google.com/?q=Madrid,Spain',
            description: 'Disponible para trabajo remoto'
        },
        {
            icon: Linkedin,
            label: 'LinkedIn',
            value: 'linkedin.com/in/tu-perfil',
            href: 'https://linkedin.com/in/tu-perfil',
            description: 'Conecta conmigo profesionalmente'
        },
        {
            icon: Github,
            label: 'GitHub',
            value: 'github.com/tu-usuario',
            href: 'https://github.com/tu-usuario',
            description: 'Revisa mi código y proyectos'
        },
    ];

    if (headerLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <EditableSection pageKey="contact" sectionKey="header" onContentUpdate={refreshHeader}>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {header.title}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {header.subtitle}
                        </p>
                    </div>
                </EditableSection>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario de contacto */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Envíame un mensaje
                                </CardTitle>
                                <CardDescription>
                                    Completa el formulario y te responderé lo antes posible
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nombre completo</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Tu nombre" {...field} />
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
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="tu@email.com" type="email" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Asunto</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="¿De qué quieres hablar?" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Ej: Proyecto web, colaboración, consultoría, etc.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mensaje</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Cuéntame más detalles sobre tu proyecto o idea..."
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Incluye todos los detalles que consideres relevantes
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full" size="lg">
                                            <Send className="w-4 h-4 mr-2" />
                                            Enviar mensaje
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Información de contacto */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de contacto</CardTitle>
                                <CardDescription>
                                    Otras formas de ponerte en contacto conmigo
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {contactInfo.map((info, index) => (
                                    <a
                                        key={index}
                                        href={info.href}
                                        target={info.href.startsWith('http') ? '_blank' : undefined}
                                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <info.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{info.label}</h3>
                                            <p className="text-sm text-muted-foreground">{info.value}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                                        </div>
                                    </a>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Disponibilidad */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Disponibilidad</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Estado actual:</span>
                                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                        Disponible
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Tiempo de respuesta:</span>
                                    <span className="text-sm font-medium">24-48 horas</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Modalidad:</span>
                                    <span className="text-sm font-medium">Remoto/Híbrido</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Call to action */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Prefieres una llamada?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Si prefieres hablar directamente, podemos agendar una videollamada.
                                </p>
                                <Button asChild variant="outline" className="w-full">
                                    <a href="mailto:tu@email.com?subject=Solicitud de videollamada">
                                        Agendar llamada
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center mb-8">Preguntas frecuentes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Cuánto tiempo toma un proyecto?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Depende de la complejidad, pero típicamente entre 2-8 semanas para proyectos web completos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Trabajas con equipos?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Sí, tengo experiencia trabajando tanto de forma independiente como en equipos multidisciplinarios.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Ofreces mantenimiento?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Sí, ofrezco servicios de mantenimiento y soporte continuo para todos mis proyectos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Trabajas con startups?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Absolutamente. Me encanta trabajar con startups y ayudar a convertir ideas en productos reales.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

