'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const contactSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    const onSubmit = async (values: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            // Simular envío del formulario
            // En un caso real, aquí harías una llamada a tu API
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('¡Mensaje enviado correctamente! Te responderé pronto.');
            form.reset();
        } catch (error) {
            toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Contacto
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        ¿Tienes un proyecto en mente? ¿Quieres colaborar? ¡Me encantaría escuchar de ti!
                        No dudes en contactarme a través de cualquiera de estos medios.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Información de contacto */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de Contacto</CardTitle>
                                <CardDescription>
                                    Puedes contactarme directamente a través de estos medios
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <a
                                            href="mailto:tu@email.com"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            tu@email.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Teléfono</p>
                                        <a
                                            href="tel:+34123456789"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            +34 123 456 789
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Ubicación</p>
                                        <p className="text-sm text-muted-foreground">
                                            Madrid, España
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Redes Sociales</CardTitle>
                                <CardDescription>
                                    También puedes encontrarme en estas plataformas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild variant="outline" className="w-full justify-start">
                                    <a
                                        href="https://linkedin.com/in/tu-perfil"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </a>
                                </Button>

                                <Button asChild variant="outline" className="w-full justify-start">
                                    <a
                                        href="https://github.com/tu-usuario"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                    >
                                        <Github className="w-4 h-4" />
                                        GitHub
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">Tiempo de respuesta</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Normalmente respondo en un plazo de 24-48 horas. Si es urgente,
                                    no dudes en contactarme por teléfono.
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-muted-foreground">Disponible para nuevos proyectos</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Formulario de contacto */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Envíame un Mensaje</CardTitle>
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
                                                            <Input
                                                                type="email"
                                                                placeholder="tu@email.com"
                                                                {...field}
                                                            />
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
                                                        <Input
                                                            placeholder="¿De qué quieres hablar?"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Ej: Propuesta de proyecto, Colaboración, Consulta técnica, etc.
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
                                                            placeholder="Cuéntame más detalles sobre tu proyecto o consulta..."
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

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full md:w-auto"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Enviar mensaje
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Información adicional */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Tipos de Proyectos
                                    </h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Desarrollo web completo</li>
                                        <li>• Aplicaciones móviles</li>
                                        <li>• APIs y backends</li>
                                        <li>• Consultoría técnica</li>
                                        <li>• Optimización de rendimiento</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Proceso de Trabajo
                                    </h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Consulta inicial gratuita</li>
                                        <li>• Propuesta detallada</li>
                                        <li>• Desarrollo iterativo</li>
                                        <li>• Comunicación constante</li>
                                        <li>• Soporte post-lanzamiento</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Cuánto tiempo toma un proyecto?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Depende de la complejidad, pero la mayoría de proyectos web toman entre 2-8 semanas.
                                    Te daré una estimación detallada después de la consulta inicial.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Trabajas con equipos remotos?</h3>
                                <p className="text-sm text-muted-foreground">
                                    ¡Absolutamente! Tengo experiencia trabajando con equipos distribuidos y
                                    uso herramientas modernas de colaboración para mantener la comunicación fluida.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Ofreces soporte después del lanzamiento?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Sí, ofrezco diferentes planes de mantenimiento y soporte. También proporciono
                                    documentación completa para que puedas gestionar tu proyecto.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">¿Qué tecnologías utilizas?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Me especializo en React, Next.js, Node.js, Python, y bases de datos modernas.
                                    Siempre elijo la mejor tecnología para cada proyecto específico.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
