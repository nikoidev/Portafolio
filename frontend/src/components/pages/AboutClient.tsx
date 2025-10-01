'use client';

import { EditableSection } from '@/components/cms/EditableSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useCMSContent } from '@/hooks/useCMSContent';
import {
    Award,
    BookOpen,
    Briefcase,
    Calendar,
    Code,
    Coffee,
    Download,
    Github,
    Linkedin,
    Loader2,
    Mail,
    MapPin,
    Star,
    Users
} from 'lucide-react';
import Link from 'next/link';

export default function AboutClient() {
    // CMS Content
    const { content: heroContent, isLoading: heroLoading, refresh: refreshHero } = useCMSContent('about', 'hero');
    const { content: bioContent, isLoading: bioLoading, refresh: refreshBio } = useCMSContent('about', 'bio');
    const { content: statsContent, isLoading: statsLoading, refresh: refreshStats } = useCMSContent('about', 'stats');
    const { content: personalInfoContent, isLoading: personalInfoLoading, refresh: refreshPersonalInfo } = useCMSContent('about', 'personal_info');
    const { content: skillsContent, isLoading: skillsLoading, refresh: refreshSkills } = useCMSContent('about', 'skills');
    const { content: hobbiesContent, isLoading: hobbiesLoading, refresh: refreshHobbies } = useCMSContent('about', 'hobbies');
    const { content: ctaContent, isLoading: ctaLoading, refresh: refreshCta } = useCMSContent('about', 'cta');
    const { content: experienceContent, isLoading: experienceLoading, refresh: refreshExperience } = useCMSContent('about', 'experience');
    const { content: educationContent, isLoading: educationLoading, refresh: refreshEducation } = useCMSContent('about', 'education');
    const { content: testimonialsContent, isLoading: testimonialsLoading, refresh: refreshTestimonials } = useCMSContent('about', 'testimonials');

    const defaultHero = {
        initials: 'JD',
        title: 'Sobre Mí',
        subtitle: 'Soy un desarrollador full stack apasionado por crear experiencias digitales excepcionales y soluciones tecnológicas innovadoras.',
        contact_email: 'mailto:tu@email.com',
        github_url: 'https://github.com/tu-usuario',
        linkedin_url: 'https://linkedin.com/in/tu-perfil',
    };

    const defaultBio = {
        paragraph_1: 'Mi viaje en el desarrollo de software comenzó hace más de 5 años, cuando descubrí mi pasión por resolver problemas complejos a través del código. Desde entonces, he tenido la oportunidad de trabajar en proyectos diversos, desde startups innovadoras hasta empresas establecidas.',
        paragraph_2: 'Me especializo en el desarrollo full stack, con un enfoque particular en tecnologías modernas como React, Next.js, Node.js y Python. Mi objetivo siempre es crear soluciones que no solo funcionen bien técnicamente, sino que también proporcionen una experiencia excepcional al usuario.',
        paragraph_3: 'Cuando no estoy programando, me gusta mantenerme actualizado con las últimas tendencias tecnológicas, contribuir a proyectos de código abierto, y compartir conocimientos con la comunidad de desarrolladores.',
    };

    const defaultStats = {
        stats: [
            { label: 'Años de experiencia', value: '5+', icon: 'calendar' },
            { label: 'Proyectos completados', value: '50+', icon: 'briefcase' },
            { label: 'Clientes satisfechos', value: '30+', icon: 'users' },
            { label: 'Tazas de café', value: '∞', icon: 'coffee' },
        ]
    };

    const defaultPersonalInfo = {
        location: 'Madrid, España',
        email: 'tu@email.com',
        github: 'https://github.com/tu-usuario',
        linkedin: 'https://linkedin.com/in/tu-perfil',
    };

    const defaultSkills = {
        skills: [
            { name: 'JavaScript/TypeScript', level: 95, category: 'Frontend' },
            { name: 'React/Next.js', level: 90, category: 'Frontend' },
            { name: 'Node.js', level: 85, category: 'Backend' },
            { name: 'Python', level: 80, category: 'Backend' },
            { name: 'PostgreSQL', level: 75, category: 'Database' },
            { name: 'Docker', level: 70, category: 'DevOps' },
        ]
    };

    const defaultHobbies = {
        hobbies: [
            'Código Abierto',
            'Inteligencia Artificial',
            'Fotografía',
            'Viajes',
            'Música',
            'Gaming',
            'Lectura',
            'Deportes'
        ]
    };

    const defaultCta = {
        title: '¿Trabajamos juntos?',
        description: 'Siempre estoy abierto a nuevas oportunidades y proyectos interesantes.',
        button_primary_text: 'Contactar',
        button_primary_url: '/contact',
        button_secondary_text: 'Ver proyectos',
        button_secondary_url: '/projects',
    };

    const defaultExperience = {
        experience: [
            {
                title: 'Desarrollador Full Stack Senior',
                company: 'Tech Company S.L.',
                period: '2022 - Presente',
                description: 'Desarrollo de aplicaciones web modernas usando React, Next.js y Node.js. Liderazgo técnico en proyectos de gran escala.',
                achievements: [
                    'Mejoré el rendimiento de la aplicación principal en un 40%',
                    'Lideré un equipo de 4 desarrolladores',
                    'Implementé arquitectura de microservicios'
                ]
            },
            {
                title: 'Desarrollador Frontend',
                company: 'Startup Innovadora',
                period: '2020 - 2022',
                description: 'Especialización en interfaces de usuario modernas y experiencia de usuario optimizada.',
                achievements: [
                    'Desarrollé 3 aplicaciones web desde cero',
                    'Reduje el tiempo de carga en un 60%',
                    'Implementé testing automatizado'
                ]
            },
            {
                title: 'Desarrollador Junior',
                company: 'Agencia Digital',
                period: '2019 - 2020',
                description: 'Primeros pasos en el desarrollo profesional, trabajando en proyectos diversos para diferentes clientes.',
                achievements: [
                    'Completé más de 20 proyectos web',
                    'Aprendí múltiples tecnologías',
                    'Colaboré con equipos multidisciplinarios'
                ]
            }
        ]
    };

    const defaultEducation = {
        education: [
            {
                title: 'Ingeniería Informática',
                institution: 'Universidad Politécnica de Madrid',
                period: '2015 - 2019',
                description: 'Especialización en Desarrollo de Software y Sistemas Distribuidos'
            },
            {
                title: 'Certificación AWS Solutions Architect',
                institution: 'Amazon Web Services',
                period: '2023',
                description: 'Certificación profesional en arquitectura de soluciones en la nube'
            }
        ]
    };

    const defaultTestimonials = {
        title: 'Lo que dicen de mi trabajo',
        testimonials: [
            {
                message: 'Excelente desarrollador, siempre entrega proyectos de alta calidad en tiempo y forma. Su atención al detalle es impresionante.',
                name: 'María García',
                role: 'CEO, Tech Startup',
                initials: 'MG'
            },
            {
                message: 'Trabajar con él fue una experiencia fantástica. Su conocimiento técnico y capacidad de comunicación son excepcionales.',
                name: 'Juan López',
                role: 'CTO, Digital Agency',
                initials: 'JL'
            },
            {
                message: 'Un profesional comprometido que siempre va más allá de lo esperado. Recomiendo su trabajo sin dudarlo.',
                name: 'Ana Rodríguez',
                role: 'Product Manager',
                initials: 'AR'
            }
        ]
    };

    const hero = heroContent || defaultHero;
    const bio = bioContent || defaultBio;
    const stats = statsContent || defaultStats;
    const personalInfo = personalInfoContent || defaultPersonalInfo;
    const skills = skillsContent || defaultSkills;
    const hobbies = hobbiesContent || defaultHobbies;
    const cta = ctaContent || defaultCta;
    const experience = experienceContent || defaultExperience;
    const education = educationContent || defaultEducation;
    const testimonials = testimonialsContent || defaultTestimonials;

    // Mapeo de iconos
    const iconMap: Record<string, any> = {
        calendar: Calendar,
        briefcase: Briefcase,
        users: Users,
        coffee: Coffee,
    };

    const isLoading = heroLoading || bioLoading || statsLoading || personalInfoLoading ||
        skillsLoading || hobbiesLoading || ctaLoading || experienceLoading ||
        educationLoading || testimonialsLoading;

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
                {/* Hero Section */}
                <EditableSection pageKey="about" sectionKey="hero" onContentUpdate={refreshHero}>
                    <div className="text-center mb-16">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white">
                                {hero.initials}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {hero.title}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            {hero.subtitle}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild>
                                <Link href="/contact">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contactar
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/cv/download" target="_blank">
                                    <Download className="w-4 h-4 mr-2" />
                                    Descargar CV
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <a href={hero.github_url} target="_blank" rel="noopener noreferrer">
                                    <Github className="w-4 h-4 mr-2" />
                                    GitHub
                                </a>
                            </Button>
                            <Button asChild variant="outline">
                                <a href={hero.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="w-4 h-4 mr-2" />
                                    LinkedIn
                                </a>
                            </Button>
                        </div>
                    </div>
                </EditableSection>

                {/* Stats */}
                <EditableSection pageKey="about" sectionKey="stats" onContentUpdate={refreshStats}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {stats.stats.map((stat, index) => {
                            const IconComponent = iconMap[stat.icon] || Calendar;
                            return (
                                <Card key={index} className="text-center">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-3">
                                            <IconComponent className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </EditableSection>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mi historia */}
                        <EditableSection pageKey="about" sectionKey="bio" onContentUpdate={refreshBio}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Mi Historia
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground">
                                        {bio.paragraph_1}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {bio.paragraph_2}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {bio.paragraph_3}
                                    </p>
                                </CardContent>
                            </Card>
                        </EditableSection>

                        {/* Experiencia */}
                        <EditableSection pageKey="about" sectionKey="experience" onContentUpdate={refreshExperience}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        Experiencia Profesional
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {experience.experience.map((exp, index) => (
                                        <div key={index} className="relative">
                                            {index < experience.experience.length - 1 && (
                                                <div className="absolute left-4 top-12 w-px h-full bg-border"></div>
                                            )}
                                            <div className="flex gap-4">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                                        <h3 className="font-semibold">{exp.title}</h3>
                                                        <Badge variant="outline">{exp.period}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                                                    <p className="text-sm mb-3">{exp.description}</p>
                                                    <ul className="text-sm text-muted-foreground space-y-1">
                                                        {exp.achievements.map((achievement, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <Star className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                                                {achievement}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </EditableSection>

                        {/* Educación */}
                        <EditableSection pageKey="about" sectionKey="education" onContentUpdate={refreshEducation}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        Educación y Certificaciones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {education.education.map((edu, index) => (
                                        <div key={index}>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                                <h3 className="font-semibold">{edu.title}</h3>
                                                <Badge variant="outline">{edu.period}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">{edu.institution}</p>
                                            <p className="text-sm">{edu.description}</p>
                                            {index < education.education.length - 1 && <Separator className="mt-4" />}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </EditableSection>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Información personal */}
                        <EditableSection pageKey="about" sectionKey="personal_info" onContentUpdate={refreshPersonalInfo}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Personal</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{personalInfo.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <a href={`mailto:${personalInfo.email}`} className="text-sm hover:text-primary transition-colors">
                                            {personalInfo.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Github className="w-4 h-4 text-muted-foreground" />
                                        <a
                                            href={personalInfo.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm hover:text-primary transition-colors"
                                        >
                                            GitHub
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Linkedin className="w-4 h-4 text-muted-foreground" />
                                        <a
                                            href={personalInfo.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm hover:text-primary transition-colors"
                                        >
                                            LinkedIn
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </EditableSection>

                        {/* Habilidades técnicas */}
                        <EditableSection pageKey="about" sectionKey="skills" onContentUpdate={refreshSkills}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Code className="w-5 h-5" />
                                        Habilidades Técnicas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {skills.skills.map((skill, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium">{skill.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {skill.category}
                                                </Badge>
                                            </div>
                                            <Progress value={skill.level} className="h-2" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </EditableSection>

                        {/* Intereses */}
                        <EditableSection pageKey="about" sectionKey="hobbies" onContentUpdate={refreshHobbies}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Intereses y Hobbies</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {hobbies.hobbies.map((hobby, index) => (
                                            <Badge key={index} variant="secondary">{hobby}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </EditableSection>

                        {/* Call to action */}
                        <EditableSection pageKey="about" sectionKey="cta" onContentUpdate={refreshCta}>
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2">{cta.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {cta.description}
                                    </p>
                                    <div className="space-y-2">
                                        <Button asChild className="w-full">
                                            <Link href={cta.button_primary_url}>
                                                {cta.button_primary_text}
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href={cta.button_secondary_url}>
                                                {cta.button_secondary_text}
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </EditableSection>
                    </div>
                </div>

                {/* Testimonios o citas */}
                <EditableSection pageKey="about" sectionKey="testimonials" onContentUpdate={refreshTestimonials}>
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center mb-8">{testimonials.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.testimonials.map((testimonial, index) => (
                                <Card key={index}>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            "{testimonial.message}"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-xs font-bold">{testimonial.initials}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{testimonial.name}</p>
                                                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                            </div>
                                        </div>
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

