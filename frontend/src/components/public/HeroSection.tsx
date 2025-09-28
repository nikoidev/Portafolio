'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Saludo */}
                    <div className="mb-6">
                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            👋 ¡Hola! Soy desarrollador Full Stack
                        </span>
                    </div>

                    {/* Título principal */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Creando experiencias web
                        <span className="block text-primary">excepcionales</span>
                    </h1>

                    {/* Descripción */}
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                        Especializado en <strong>React</strong>, <strong>Next.js</strong>, <strong>Node.js</strong> y <strong>Python</strong>.
                        Transformo ideas en aplicaciones web modernas, escalables y centradas en el usuario.
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild size="lg" className="text-lg px-8 py-6">
                            <Link href="/projects">
                                Ver mis proyectos
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                            <Link href="/cv/download" className="flex items-center">
                                <Download className="w-5 h-5 mr-2" />
                                Descargar CV
                            </Link>
                        </Button>
                    </div>

                    {/* Redes sociales */}
                    <div className="flex justify-center space-x-6 mb-12">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-background border hover:bg-accent transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-6 h-6" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-background border hover:bg-accent transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-6 h-6" />
                        </a>
                        <a
                            href="mailto:contact@example.com"
                            className="p-3 rounded-full bg-background border hover:bg-accent transition-colors"
                            aria-label="Email"
                        >
                            <Mail className="w-6 h-6" />
                        </a>
                    </div>

                    {/* Indicador de scroll */}
                    <div className="animate-bounce">
                        <ArrowDown className="w-6 h-6 mx-auto text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
            </div>
        </section>
    );
}
