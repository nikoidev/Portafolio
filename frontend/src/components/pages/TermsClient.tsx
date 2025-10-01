'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCMSContent } from '@/hooks/useCMSContent';
import { Calendar, FileText, Loader2 } from 'lucide-react';

export default function TermsClient() {
    const { content: headerContent, isLoading: headerLoading, refresh: refreshHeader } = useCMSContent('terms', 'header');
    const { content: sectionsContent, isLoading: sectionsLoading, refresh: refreshSections } = useCMSContent('terms', 'sections');

    const defaultHeader = {
        title: 'Términos y Condiciones',
        last_updated: '1 de Enero de 2024',
        description: 'Por favor, lee estos términos y condiciones cuidadosamente antes de usar nuestro sitio web.'
    };

    const defaultSections = {
        sections: [
            {
                title: 'Aceptación de los Términos',
                content: 'Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso, todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de las leyes locales aplicables. Si no estás de acuerdo con alguno de estos términos, tienes prohibido usar o acceder a este sitio.'
            },
            {
                title: 'Uso del Sitio Web',
                content: 'Este sitio web es un portafolio personal que muestra proyectos, habilidades y experiencia profesional. El contenido del sitio se proporciona únicamente con fines informativos. No garantizamos que el sitio esté libre de errores o que el acceso sea ininterrumpido. Nos reservamos el derecho de modificar o discontinuar el sitio en cualquier momento sin previo aviso.'
            },
            {
                title: 'Propiedad Intelectual',
                content: 'El contenido de este sitio web, incluyendo pero no limitado a texto, gráficos, logotipos, imágenes, código fuente y software, es propiedad del titular del sitio web o de sus proveedores de contenido y está protegido por leyes de propiedad intelectual. No puedes reproducir, distribuir, modificar o crear trabajos derivados del contenido sin permiso expreso.'
            },
            {
                title: 'Enlaces a Sitios de Terceros',
                content: 'Este sitio web puede contener enlaces a sitios web de terceros que no son propiedad ni están controlados por nosotros. No tenemos control sobre, y no asumimos ninguna responsabilidad por el contenido, políticas de privacidad o prácticas de sitios web de terceros. Al usar este sitio, liberas expresamente de cualquier responsabilidad derivada del uso de cualquier sitio web de terceros.'
            },
            {
                title: 'Formulario de Contacto',
                content: 'Al usar el formulario de contacto del sitio, aceptas proporcionar información veraz y actualizada. La información que proporciones a través del formulario de contacto se utilizará únicamente para responder a tus consultas y no será compartida con terceros sin tu consentimiento, excepto según lo requerido por la ley.'
            },
            {
                title: 'Limitación de Responsabilidad',
                content: 'En ningún caso seremos responsables de daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar este sitio web, incluso si hemos sido advertidos de la posibilidad de tales daños. Tu uso del sitio es bajo tu propio riesgo.'
            },
            {
                title: 'Proyectos Mostrados',
                content: 'Los proyectos mostrados en este portafolio son ejemplos del trabajo realizado. Algunos proyectos pueden ser trabajos académicos, proyectos personales o trabajos realizados para clientes. Los detalles de los proyectos se proporcionan con fines demostrativos y pueden no reflejar el estado actual de los proyectos en producción.'
            },
            {
                title: 'Modificaciones de los Términos',
                content: 'Nos reservamos el derecho de revisar estos términos y condiciones en cualquier momento sin previo aviso. Al continuar utilizando este sitio web después de publicar los cambios, aceptas estar sujeto a los términos revisados. Te recomendamos que revises periódicamente estos términos para estar informado de cualquier cambio.'
            },
            {
                title: 'Ley Aplicable',
                content: 'Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes del país en el que reside el titular del sitio web. Cualquier disputa que surja en relación con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de dicha ubicación.'
            },
            {
                title: 'Contacto',
                content: 'Si tienes alguna pregunta sobre estos Términos y Condiciones, no dudes en ponerte en contacto con nosotros a través del formulario de contacto disponible en el sitio web.'
            }
        ]
    };

    const header = headerContent || defaultHeader;
    const sections = sectionsContent || defaultSections;

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
                <EditableSection pageKey="terms" sectionKey="header" onContentUpdate={refreshHeader}>
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 rounded-full bg-primary/10">
                                <FileText className="w-12 h-12 text-primary" />
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
                <EditableSection pageKey="terms" sectionKey="sections" onContentUpdate={refreshSections}>
                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardContent className="p-8 space-y-8">
                                {sections.sections.map((section: any, index: number) => (
                                    <div key={index}>
                                        <div className="mb-4">
                                            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                                                    {index + 1}
                                                </span>
                                                {section.title}
                                            </h2>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {section.content}
                                            </p>
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
                                Si tienes alguna pregunta sobre estos términos, por favor contáctanos a través de
                                nuestro <a href="/contact" className="text-primary hover:underline">formulario de contacto</a>.
                            </p>
                        </div>
                    </div>
                </EditableSection>
            </div>
        </div>
    );
}

