'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCMSContent } from '@/hooks/useCMSContent';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { Check, Copy, ExternalLink, Github, Linkedin, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactClient() {
    const [copiedEmail, setCopiedEmail] = useState(false);

    // Global configuration
    const { socialLinks: globalSocialLinks, contactEmail: globalEmail, contactPhone: globalPhone } = useGlobalSettings();

    // CMS Content
    const { content: headerContent, isLoading: headerLoading, refresh: refreshHeader } = useCMSContent('contact', 'header');
    const { content: contactInfoContent, isLoading: contactInfoLoading, refresh: refreshContactInfo } = useCMSContent('contact', 'contact_info');
    const { content: availabilityContent, isLoading: availabilityLoading, refresh: refreshAvailability } = useCMSContent('contact', 'availability');
    const { content: faqContent, isLoading: faqLoading, refresh: refreshFaq } = useCMSContent('contact', 'faq');

    const defaultHeader = {
        title: '¿Tienes un proyecto en mente?',
        subtitle: 'Me encantaría escuchar de ti. Contacta conmigo directamente a través de cualquiera de estos canales y hablemos de tu próximo proyecto.',
    };

    const defaultContactInfo = {
        contacts: [
            {
                icon: 'mail',
                label: 'Email',
                value: 'tu@email.com',
                href: 'mailto:tu@email.com',
                description: 'Respondo en menos de 24 horas',
                primary: true
            },
            {
                icon: 'linkedin',
                label: 'LinkedIn',
                value: 'Conecta conmigo',
                href: 'https://linkedin.com/in/tu-perfil',
                description: 'Red profesional',
                primary: true
            },
            {
                icon: 'github',
                label: 'GitHub',
                value: 'Revisa mi código',
                href: 'https://github.com/tu-usuario',
                description: 'Proyectos y repositorios',
                primary: true
            }
        ]
    };

    const defaultAvailability = {
        title: 'Disponibilidad',
        status: 'Disponible para nuevos proyectos',
        status_color: 'green',
        response_time: '24 horas',
        work_mode: 'Remoto / Híbrido',
        timezone: 'GMT+1 (Madrid)'
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
    const contactInfoData = contactInfoContent ? {
        ...defaultContactInfo,
        ...contactInfoContent,
        contacts: Array.isArray(contactInfoContent.contact_methods)
            ? contactInfoContent.contact_methods.map((method: any) => ({
                icon: method.icon?.includes('simpleicons') ? 'mail' : 'mail',
                label: method.label || 'Contacto',
                value: method.value || '',
                href: method.link || '#',
                description: method.description || '',
                primary: method.primary ?? true
            }))
            : (contactInfoContent.contacts || defaultContactInfo.contacts)
    } : defaultContactInfo;

    // Integrate global contact data
    const useGlobalContactData = (contactInfoData as any).use_global_contact ?? true;
    const allContacts = useGlobalContactData && (globalEmail || globalSocialLinks.length > 0)
        ? [
            ...(globalEmail ? [{
                icon: 'mail',
                label: 'Email',
                value: globalEmail,
                href: `mailto:${globalEmail}`,
                description: 'Respondo en menos de 24 horas',
                primary: true
            }] : []),
            ...globalSocialLinks.filter((l: any) => l.enabled).map((link: any) => ({
                icon: link.name.toLowerCase().includes('linkedin') ? 'linkedin' :
                    link.name.toLowerCase().includes('github') ? 'github' : 'link',
                label: link.name,
                value: `Conecta en ${link.name}`,
                href: link.url,
                description: `Red ${link.name}`,
                primary: true
            })),
            ...(globalPhone ? [{
                icon: 'phone',
                label: 'Teléfono',
                value: globalPhone,
                href: `tel:${globalPhone}`,
                description: 'Lun - Vie, 9:00 - 18:00',
                primary: false
            }] : [])
        ]
        : contactInfoData.contacts;

    const availability = availabilityContent || defaultAvailability;
    const faq = faqContent ? {
        ...defaultFaq,
        ...faqContent,
        faqs: Array.isArray(faqContent.faqs) ? faqContent.faqs : defaultFaq.faqs
    } : defaultFaq;

    // Icon mapping
    const iconMap: Record<string, any> = {
        mail: Mail,
        phone: Phone,
        'map-pin': MapPin,
        linkedin: Linkedin,
        github: Github,
        link: ExternalLink,
    };

    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(true);
        toast.success('Email copiado al portapapeles');
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const isLoadingData = headerLoading || contactInfoLoading || availabilityLoading || faqLoading;

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
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {header.title}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            {header.subtitle}
                        </p>
                    </div>
                </EditableSection>

                {/* Main contact methods */}
                <EditableSection pageKey="contact" sectionKey="contact_info" onContentUpdate={refreshContactInfo}>
                    <div className="max-w-5xl mx-auto mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {allContacts.filter((c: any) => c.primary !== false).slice(0, 3).map((contact: any, index: number) => {
                                const IconComponent = iconMap[contact.icon] || Mail;
                                const isEmail = contact.icon === 'mail';

                                return (
                                    <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50">
                                        <CardContent className="pt-8 pb-6 text-center">
                                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mx-auto mb-4">
                                                <IconComponent className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2">{contact.label}</h3>
                                            <p className="text-sm text-muted-foreground mb-4">{contact.description}</p>

                                            {isEmail ? (
                                                <div className="space-y-2">
                                                    <Button
                                                        asChild
                                                        className="w-full"
                                                        size="sm"
                                                    >
                                                        <a href={contact.href}>
                                                            <Mail className="w-4 h-4 mr-2" />
                                                            Enviar email
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        size="sm"
                                                        onClick={() => handleCopyEmail(contact.value)}
                                                    >
                                                        {copiedEmail ? (
                                                            <>
                                                                <Check className="w-4 h-4 mr-2" />
                                                                ¡Copiado!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-4 h-4 mr-2" />
                                                                Copiar email
                                                            </>
                                                        )}
                                                    </Button>
                                                    <p className="text-xs text-muted-foreground mt-2">{contact.value}</p>
                                                </div>
                                            ) : (
                                                <Button
                                                    asChild
                                                    className="w-full"
                                                    size="sm"
                                                >
                                                    <a
                                                        href={contact.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        {contact.value}
                                                    </a>
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </EditableSection>

                {/* Availability and additional contacts */}
                <div className="max-w-5xl mx-auto mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Availability */}
                        <EditableSection pageKey="contact" sectionKey="availability" onContentUpdate={refreshAvailability}>
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${availability.status_color === 'green' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                        {availability.title}
                                    </CardTitle>
                                    <CardDescription>
                                        Estado actual y tiempos de respuesta
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Estado:</span>
                                        <span className="text-sm font-medium">{availability.status}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Respuesta:</span>
                                        <span className="text-sm font-medium">{availability.response_time}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Modalidad:</span>
                                        <span className="text-sm font-medium">{availability.work_mode}</span>
                                    </div>
                                    {availability.timezone && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Zona horaria:</span>
                                            <span className="text-sm font-medium">{availability.timezone}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </EditableSection>

                        {/* Additional contacts */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Otros canales</CardTitle>
                                <CardDescription>
                                    Más formas de conectar
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {allContacts.filter((c: any) => c.primary === false || allContacts.indexOf(c) >= 3).slice(0, 4).map((contact: any, index: number) => {
                                    const IconComponent = iconMap[contact.icon] || ExternalLink;
                                    return (
                                        <a
                                            key={index}
                                            href={contact.href}
                                            target={contact.href.startsWith('http') ? '_blank' : undefined}
                                            rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                <IconComponent className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm">{contact.label}</h3>
                                                <p className="text-xs text-muted-foreground">{contact.description}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    );
                                })}
                                {allContacts.filter((c: any) => c.primary === false || allContacts.indexOf(c) >= 3).length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p className="text-sm">Los métodos principales están arriba 👆</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <EditableSection pageKey="contact" sectionKey="faq" onContentUpdate={refreshFaq}>
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">{faq.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {faq.faqs.map((item: any, index: number) => (
                                <Card key={index} className="hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <h3 className="font-semibold mb-3 text-primary">{item.question}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
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
