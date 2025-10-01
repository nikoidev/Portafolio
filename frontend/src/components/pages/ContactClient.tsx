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
    const { content: contactInfoContent, isLoading: contactInfoLoading, refresh: refreshContactInfo } = useCMSContent('contact', 'contact_info');
    const { content: availabilityContent, isLoading: availabilityLoading, refresh: refreshAvailability } = useCMSContent('contact', 'availability');
    const { content: callCtaContent, isLoading: callCtaLoading, refresh: refreshCallCta } = useCMSContent('contact', 'call_cta');
    const { content: faqContent, isLoading: faqLoading, refresh: refreshFaq } = useCMSContent('contact', 'faq');

    const defaultHeader = {
        title: 'Contacto',
        subtitle: '¿Tienes un proyecto en mente? ¿Quieres colaborar? Me encantaría escuchar de ti. Contacta conmigo y hablemos de tu próximo proyecto.',
    };

    const defaultContactInfo = {
        contacts: [
            {
                icon: 'mail',
                label: 'Email',
                value: 'tu@email.com',
                href: 'mailto:tu@email.com',
                description: 'Respondo en 24-48 horas'
            },
            {
                icon: 'phone',
                label: 'Teléfono',
                value: '+34 XXX XXX XXX',
                href: 'tel:+34XXXXXXXXX',
                description: 'Lun - Vie, 9:00 - 18:00'
            },
            {
                icon: 'map-pin',
                label: 'Ubicación',
                value: 'Madrid, España',
                href: 'https://maps.google.com/?q=Madrid,Spain',
                description: 'Disponible para trabajo remoto'
            },
            {
                icon: 'linkedin',
                label: 'LinkedIn',
                value: 'linkedin.com/in/tu-perfil',
                href: 'https://linkedin.com/in/tu-perfil',
                description: 'Conecta conmigo profesionalmente'
            },
            {
                icon: 'github',
                label: 'GitHub',
                value: 'github.com/tu-usuario',
                href: 'https://github.com/tu-usuario',
                description: 'Revisa mi código y proyectos'
            }
        ]
    };

    const defaultAvailability = {
        title: 'Disponibilidad',
        status: 'Disponible',
        status_color: 'green',
        response_time: '24-48 horas',
        work_mode: 'Remoto/Híbrido'
    };

    const defaultCallCta = {
        title: '¿Prefieres una llamada?',
        description: 'Si prefieres hablar directamente, podemos agendar una videollamada.',
        button_text: 'Agendar llamada',
        button_url: 'mailto:tu@email.com?subject=Solicitud de videollamada'
    };

    const defaultFaq = {
        title: 'Preguntas frecuentes',
        faqs: [
            {
                question: '¿Cuánto tiempo toma un proyecto?',
                answer: 'Depende de la complejidad, pero típicamente entre 2-8 semanas para proyectos web completos.'
            },
            {
                question: '¿Trabajas con equipos?',
                answer: 'Sí, tengo experiencia trabajando tanto de forma independiente como en equipos multidisciplinarios.'
            },
            {
                question: '¿Ofreces mantenimiento?',
                answer: 'Sí, ofrezco servicios de mantenimiento y soporte continuo para todos mis proyectos.'
            },
            {
                question: '¿Trabajas con startups?',
                answer: 'Absolutamente. Me encanta trabajar con startups y ayudar a convertir ideas en productos reales.'
            }
        ]
    };

    const header = headerContent || defaultHeader;
    const contactInfoData = contactInfoContent || defaultContactInfo;
    const availability = availabilityContent || defaultAvailability;
    const callCta = callCtaContent || defaultCallCta;
    const faq = faqContent || defaultFaq;

    // Mapeo de iconos
    const iconMap: Record<string, any> = {
        mail: Mail,
        phone: Phone,
        'map-pin': MapPin,
        linkedin: Linkedin,
        github: Github,
    };

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

    const isLoadingData = headerLoading || contactInfoLoading || availabilityLoading || callCtaLoading || faqLoading;

    if (isLoadingData) {
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
                        <EditableSection pageKey="contact" sectionKey="contact_info" onContentUpdate={refreshContactInfo}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información de contacto</CardTitle>
                                    <CardDescription>
                                        Otras formas de ponerte en contacto conmigo
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {contactInfoData.contacts.map((info, index) => {
                                        const IconComponent = iconMap[info.icon] || Mail;
                                        return (
                                            <a
                                                key={index}
                                                href={info.href}
                                                target={info.href.startsWith('http') ? '_blank' : undefined}
                                                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                    <IconComponent className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{info.label}</h3>
                                                    <p className="text-sm text-muted-foreground">{info.value}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </EditableSection>

                        {/* Disponibilidad */}
                        <EditableSection pageKey="contact" sectionKey="availability" onContentUpdate={refreshAvailability}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{availability.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Estado actual:</span>
                                        <span className={`text-sm font-medium text-${availability.status_color}-600 flex items-center gap-1`}>
                                            <div className={`w-2 h-2 rounded-full bg-${availability.status_color}-600`}></div>
                                            {availability.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Tiempo de respuesta:</span>
                                        <span className="text-sm font-medium">{availability.response_time}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Modalidad:</span>
                                        <span className="text-sm font-medium">{availability.work_mode}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </EditableSection>

                        {/* Call to action */}
                        <EditableSection pageKey="contact" sectionKey="call_cta" onContentUpdate={refreshCallCta}>
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2">{callCta.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {callCta.description}
                                    </p>
                                    <Button asChild variant="outline" className="w-full">
                                        <a href={callCta.button_url}>
                                            {callCta.button_text}
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </EditableSection>
                    </div>
                </div>

                {/* FAQ Section */}
                <EditableSection pageKey="contact" sectionKey="faq" onContentUpdate={refreshFaq}>
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center mb-8">{faq.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {faq.faqs.map((item, index) => (
                                <Card key={index}>
                                    <CardContent className="pt-6">
                                        <h3 className="font-semibold mb-2">{item.question}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.answer}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </EditableSection>
            </div>
        </div>
    );
}

