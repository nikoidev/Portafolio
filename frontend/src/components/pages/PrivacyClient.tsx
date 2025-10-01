'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCMSContent } from '@/hooks/useCMSContent';
import { Calendar, Loader2, Shield } from 'lucide-react';

export default function PrivacyClient() {
    const { content: headerContent, isLoading: headerLoading, refresh: refreshHeader } = useCMSContent('privacy', 'header');
    const { content: sectionsContent, isLoading: sectionsLoading, refresh: refreshSections } = useCMSContent('privacy', 'sections');

    const defaultHeader = {
        title: 'Política de Privacidad',
        last_updated: '1 de Enero de 2024',
        description: 'Esta Política de Privacidad describe cómo se recopila, utiliza y comparte tu información personal cuando visitas o realizas una compra en este sitio web.'
    };

    const defaultSections = {
        sections: [
            {
                title: 'Información que Recopilamos',
                icon: 'shield',
                content: 'Cuando visitas el sitio, recopilamos automáticamente cierta información sobre tu dispositivo, incluyendo información sobre tu navegador web, dirección IP, zona horaria y algunas de las cookies instaladas en tu dispositivo. Además, cuando navegas por el sitio, recopilamos información sobre las páginas web individuales o productos que ves, qué sitios web o términos de búsqueda te remitieron al sitio, e información sobre cómo interactúas con el sitio.'
            },
            {
                title: 'Uso de tu Información',
                icon: 'shield',
                content: 'Utilizamos la información que recopilamos para: mejorar y optimizar nuestro sitio web, evaluar el éxito de nuestras campañas de marketing, responder a tus comentarios o consultas, y analizar las tendencias de uso del sitio. Si nos proporcionas información de contacto a través del formulario de contacto, podemos usar esa información para comunicarnos contigo.'
            },
            {
                title: 'Compartir tu Información',
                icon: 'shield',
                content: 'No vendemos, intercambiamos ni transferimos tu información personal identificable a terceros sin tu consentimiento. Esto no incluye a terceros de confianza que nos ayudan a operar nuestro sitio web, realizar nuestro negocio o atenderte, siempre que esas partes acuerden mantener esta información confidencial.'
            },
            {
                title: 'Cookies y Tecnologías de Seguimiento',
                icon: 'shield',
                content: 'Utilizamos cookies y tecnologías similares de seguimiento para rastrear la actividad en nuestro sitio web y almacenar cierta información. Las cookies son archivos con una pequeña cantidad de datos que pueden incluir un identificador único anónimo. Puedes configurar tu navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie.'
            },
            {
                title: 'Seguridad de los Datos',
                icon: 'shield',
                content: 'La seguridad de tu información personal es importante para nosotros. Implementamos medidas de seguridad diseñadas para proteger tu información personal contra acceso no autorizado y uso indebido. Sin embargo, ten en cuenta que ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro.'
            },
            {
                title: 'Tus Derechos',
                icon: 'shield',
                content: 'Tienes derecho a acceder, corregir, actualizar o solicitar la eliminación de tu información personal. Si deseas ejercer estos derechos, contáctanos usando la información de contacto proporcionada en el sitio. También tienes derecho a oponerte al procesamiento de tu información personal, solicitar que restrinjamos el procesamiento de tu información personal o solicitar la portabilidad de tu información personal.'
            },
            {
                title: 'Cambios a esta Política',
                icon: 'shield',
                content: 'Podemos actualizar esta política de privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por otras razones operativas, legales o reglamentarias. Te notificaremos sobre cualquier cambio publicando la nueva política de privacidad en esta página y actualizando la fecha de "última actualización".'
            },
            {
                title: 'Contacto',
                icon: 'shield',
                content: 'Si tienes preguntas sobre esta Política de Privacidad o deseas ejercer tus derechos, no dudes en contactarnos a través del formulario de contacto en el sitio web o mediante el correo electrónico proporcionado.'
            }
        ]
    };

    const header = headerContent || defaultHeader;
    const sections = sectionsContent || defaultSections;

    const iconMap: Record<string, any> = {
        shield: Shield,
        calendar: Calendar,
    };

    const isLoading = headerLoading || sectionsLoading;

    if (isLoading) {
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
                <EditableSection pageKey="privacy" sectionKey="header" onContentUpdate={refreshHeader}>
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 rounded-full bg-primary/10">
                                <Shield className="w-12 h-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                            {header.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Última actualización: {header.last_updated}</span>
                        </div>
                        <p className="text-lg text-muted-foreground text-center">
                            {header.description}
                        </p>
                    </div>
                </EditableSection>

                {/* Sections */}
                <EditableSection pageKey="privacy" sectionKey="sections" onContentUpdate={refreshSections}>
                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardContent className="p-8 space-y-8">
                                {sections.sections.map((section: any, index: number) => (
                                    <div key={index}>
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                                                <Shield className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold mb-3">
                                                    {section.title}
                                                </h2>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {section.content}
                                                </p>
                                            </div>
                                        </div>
                                        {index < sections.sections.length - 1 && (
                                            <Separator className="mt-8" />
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Footer info */}
                        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground text-center">
                                Si tienes alguna pregunta sobre esta política, por favor contáctanos a través de
                                nuestro <a href="/contact" className="text-primary hover:underline">formulario de contacto</a>.
                            </p>
                        </div>
                    </div>
                </EditableSection>
            </div>
        </div>
    );
}

