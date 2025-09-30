'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Eye, FileText, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Esquemas de validación
const workExperienceSchema = z.object({
    title: z.string().min(1, 'El título es requerido'),
    company: z.string().min(1, 'La empresa es requerida'),
    location: z.string().optional(),
    start_date: z.string().min(1, 'La fecha de inicio es requerida'),
    end_date: z.string().optional(),
    is_current: z.boolean().default(false),
    description: z.array(z.string()).default([]),
});

const educationSchema = z.object({
    degree: z.string().min(1, 'El título es requerido'),
    institution: z.string().min(1, 'La institución es requerida'),
    location: z.string().optional(),
    start_date: z.string().min(1, 'La fecha de inicio es requerida'),
    end_date: z.string().optional(),
    description: z.array(z.string()).default([]),
});

const technicalSkillSchema = z.object({
    category: z.string().min(1, 'La categoría es requerida'),
    skills: z.array(z.string()).min(1, 'Al menos una habilidad es requerida'),
});

const languageSchema = z.object({
    name: z.string().min(1, 'El nombre del idioma es requerido'),
    level: z.string().min(1, 'El nivel es requerido'),
});

const certificationSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    issuer: z.string().min(1, 'El emisor es requerido'),
    issue_date: z.string().min(1, 'La fecha es requerida'),
    credential_url: z.string().url('URL inválida').optional().or(z.literal('')),
});

const cvSchema = z.object({
    full_name: z.string().min(1, 'El nombre completo es requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    linkedin_url: z.string().url('URL inválida').optional().or(z.literal('')),
    github_url: z.string().url('URL inválida').optional().or(z.literal('')),
    portfolio_url: z.string().url('URL inválida').optional().or(z.literal('')),
    location: z.string().optional(),
    summary: z.string().optional(),
    work_experience: z.array(workExperienceSchema).default([]),
    education: z.array(educationSchema).default([]),
    technical_skills: z.array(technicalSkillSchema).default([]),
    languages: z.array(languageSchema).default([]),
    certifications: z.array(certificationSchema).default([]),
});

type CVFormValues = z.infer<typeof cvSchema>;

export default function CVManagementPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [cvExists, setCvExists] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [templates, setTemplates] = useState<any[]>([]);
    const [colorSchemes, setColorSchemes] = useState<any[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [selectedColorScheme, setSelectedColorScheme] = useState('blue');

    const form = useForm<CVFormValues>({
        resolver: zodResolver(cvSchema),
        defaultValues: {
            full_name: '',
            email: '',
            phone: '',
            linkedin_url: '',
            github_url: '',
            portfolio_url: '',
            location: '',
            summary: '',
            work_experience: [],
            education: [],
            technical_skills: [],
            languages: [],
            certifications: [],
        },
    });

    const {
        fields: workExperienceFields,
        append: appendWorkExperience,
        remove: removeWorkExperience,
    } = useFieldArray({
        control: form.control,
        name: 'work_experience',
    });

    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control: form.control,
        name: 'education',
    });

    const {
        fields: technicalSkillsFields,
        append: appendTechnicalSkill,
        remove: removeTechnicalSkill,
    } = useFieldArray({
        control: form.control,
        name: 'technical_skills',
    });

    const {
        fields: languagesFields,
        append: appendLanguage,
        remove: removeLanguage,
    } = useFieldArray({
        control: form.control,
        name: 'languages',
    });

    const {
        fields: certificationsFields,
        append: appendCertification,
        remove: removeCertification,
    } = useFieldArray({
        control: form.control,
        name: 'certifications',
    });

    // Cargar datos del CV
    useEffect(() => {
        const loadCV = async () => {
            try {
                const cvData = await api.getCV() as any;
                setCvExists(true);
                setPdfUrl(cvData.pdf_url || '');

                // Llenar el formulario con los datos existentes
                form.reset({
                    full_name: cvData.full_name || '',
                    email: cvData.email || '',
                    phone: cvData.phone || '',
                    linkedin_url: cvData.linkedin_url || '',
                    github_url: cvData.github_url || '',
                    portfolio_url: cvData.portfolio_url || '',
                    location: cvData.location || '',
                    summary: cvData.summary || '',
                    work_experience: cvData.work_experience || [],
                    education: cvData.education || [],
                    technical_skills: cvData.technical_skills || [],
                    languages: cvData.languages || [],
                    certifications: cvData.certifications || [],
                });
            } catch (error) {
                console.log('No hay CV existente, creando uno nuevo');
                setCvExists(false);
            }
        };

        const loadTemplatesAndSchemes = async () => {
            try {
                const [templatesData, schemesData] = await Promise.all([
                    api.getCVTemplates(),
                    api.getCVColorSchemes(),
                ]);
                setTemplates((templatesData as any).templates || []);
                setColorSchemes((schemesData as any).color_schemes || []);
            } catch (error) {
                console.error('Error cargando plantillas:', error);
            }
        };

        loadCV();
        loadTemplatesAndSchemes();
    }, [form]);

    const handleSubmit = async (values: CVFormValues) => {
        setIsLoading(true);
        try {
            if (cvExists) {
                await api.updateCV(values);
                toast.success('CV actualizado correctamente');
            } else {
                await api.createOrUpdateCV(values);
                setCvExists(true);
                toast.success('CV creado correctamente');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al guardar el CV');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGeneratePDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const result = await api.generateCVPDF(selectedTemplate, selectedColorScheme) as any;
            setPdfUrl(result.pdf_url);
            toast.success('PDF generado correctamente');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Error al generar PDF');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de CV</h1>
                    <p className="text-muted-foreground">
                        Administra tu currículum vitae y genera PDFs profesionales
                    </p>
                </div>
                <div className="flex gap-2">
                    {pdfUrl && (
                        <Button variant="outline" asChild>
                            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver PDF
                            </a>
                        </Button>
                    )}
                    <Button
                        onClick={handleGeneratePDF}
                        disabled={isGeneratingPDF || !cvExists}
                        variant="secondary"
                    >
                        {isGeneratingPDF ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        Generar PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Formulario principal */}
                <div className="lg:col-span-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                            <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="experience">Experiencia</TabsTrigger>
                                    <TabsTrigger value="education">Educación</TabsTrigger>
                                    <TabsTrigger value="skills">Habilidades</TabsTrigger>
                                    <TabsTrigger value="additional">Adicional</TabsTrigger>
                                </TabsList>

                                {/* Información Personal */}
                                <TabsContent value="personal" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Información Personal</CardTitle>
                                            <CardDescription>
                                                Datos básicos de contacto y presentación
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="full_name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nombre Completo</FormLabel>
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
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input type="email" placeholder="juan@ejemplo.com" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Teléfono</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="+34 123 456 789" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="location"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Ubicación</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Madrid, España" {...field} />
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
                                                            <FormLabel>LinkedIn</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://linkedin.com/in/usuario" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="github_url"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>GitHub</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://github.com/usuario" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="summary"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Resumen Profesional</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Breve descripción de tu perfil profesional..."
                                                                className="min-h-[100px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Un resumen conciso de tu experiencia y objetivos profesionales
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Experiencia Laboral */}
                                <TabsContent value="experience" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>Experiencia Laboral</CardTitle>
                                                    <CardDescription>
                                                        Tu historial profesional
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => appendWorkExperience({
                                                        title: '',
                                                        company: '',
                                                        location: '',
                                                        start_date: '',
                                                        end_date: '',
                                                        is_current: false,
                                                        description: [],
                                                    })}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Agregar Experiencia
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {workExperienceFields.map((field, index) => (
                                                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium">Experiencia #{index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeWorkExperience(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`work_experience.${index}.title`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Cargo</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Desarrollador Full Stack" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`work_experience.${index}.company`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Empresa</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Tech Company S.L." {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`work_experience.${index}.start_date`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Fecha de Inicio</FormLabel>
                                                                    <FormControl>
                                                                        <Input type="date" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`work_experience.${index}.end_date`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Fecha de Fin</FormLabel>
                                                                    <FormControl>
                                                                        <Input type="date" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Educación */}
                                <TabsContent value="education" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>Educación</CardTitle>
                                                    <CardDescription>
                                                        Tu formación académica
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => appendEducation({
                                                        degree: '',
                                                        institution: '',
                                                        location: '',
                                                        start_date: '',
                                                        end_date: '',
                                                        description: [],
                                                    })}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Agregar Educación
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {educationFields.map((field, index) => (
                                                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium">Educación #{index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeEducation(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`education.${index}.degree`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Título</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Ingeniería Informática" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`education.${index}.institution`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Institución</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Universidad Politécnica" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Habilidades */}
                                <TabsContent value="skills" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>Habilidades Técnicas</CardTitle>
                                                    <CardDescription>
                                                        Tus competencias técnicas organizadas por categorías
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => appendTechnicalSkill({
                                                        category: '',
                                                        skills: [],
                                                    })}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Agregar Categoría
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {technicalSkillsFields.map((field, index) => (
                                                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium">Categoría #{index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeTechnicalSkill(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <FormField
                                                        control={form.control}
                                                        name={`technical_skills.${index}.category`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Categoría</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Frontend, Backend, Bases de Datos..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Información Adicional */}
                                <TabsContent value="additional" className="space-y-6">
                                    {/* Idiomas */}
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>Idiomas</CardTitle>
                                                    <CardDescription>
                                                        Los idiomas que dominas
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => appendLanguage({
                                                        name: '',
                                                        level: '',
                                                    })}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Agregar Idioma
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {languagesFields.map((field, index) => (
                                                <div key={field.id} className="flex items-center gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`languages.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input placeholder="Español, Inglés..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`languages.${index}.level`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input placeholder="Nativo, Avanzado, Intermedio..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeLanguage(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Certificaciones */}
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>Certificaciones</CardTitle>
                                                    <CardDescription>
                                                        Certificaciones y cursos relevantes
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => appendCertification({
                                                        name: '',
                                                        issuer: '',
                                                        issue_date: '',
                                                        credential_url: '',
                                                    })}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Agregar Certificación
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {certificationsFields.map((field, index) => (
                                                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium">Certificación #{index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeCertification(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`certifications.${index}.name`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Nombre</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="AWS Certified Developer" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`certifications.${index}.issuer`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Emisor</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Amazon Web Services" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    {cvExists ? 'Actualizar CV' : 'Crear CV'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Panel lateral - Configuración PDF */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Configuración PDF
                            </CardTitle>
                            <CardDescription>
                                Personaliza el diseño de tu CV
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Plantilla</label>
                                <div className="space-y-2">
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedTemplate === template.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                            onClick={() => setSelectedTemplate(template.id)}
                                        >
                                            <div className="font-medium text-sm">{template.name}</div>
                                            <div className="text-xs text-muted-foreground">{template.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <label className="text-sm font-medium mb-2 block">Esquema de Colores</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {colorSchemes.map((scheme) => (
                                        <div
                                            key={scheme.id}
                                            className={`p-2 border rounded-lg cursor-pointer transition-colors ${selectedColorScheme === scheme.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                            onClick={() => setSelectedColorScheme(scheme.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: scheme.primary }}
                                                />
                                                <span className="text-sm">{scheme.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <Button
                                onClick={handleGeneratePDF}
                                disabled={isGeneratingPDF || !cvExists}
                                className="w-full"
                            >
                                {isGeneratingPDF ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                )}
                                Generar PDF
                            </Button>

                            {pdfUrl && (
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver PDF Actual
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
