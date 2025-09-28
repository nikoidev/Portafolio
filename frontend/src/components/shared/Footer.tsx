'use client';

import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Información principal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Portafolio</h3>
                        <p className="text-sm text-muted-foreground">
                            Desarrollador Full Stack especializado en crear experiencias web modernas y escalables.
                        </p>
                    </div>

                    {/* Enlaces rápidos */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Enlaces</h4>
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/projects"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Proyectos
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Sobre mí
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Contacto
                            </Link>
                            <Link
                                href="/cv/download"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Descargar CV
                            </Link>
                        </nav>
                    </div>

                    {/* Redes sociales */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Sígueme</h4>
                        <div className="flex flex-col space-y-2">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                LinkedIn
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Twitter
                            </a>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Contacto</h4>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                ¿Tienes un proyecto en mente?
                            </p>
                            <Link
                                href="/contact"
                                className="text-sm text-primary hover:underline"
                            >
                                Hablemos →
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} Portafolio Personal. Todos los derechos reservados.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link
                                href="/privacy"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Privacidad
                            </Link>
                            <Link
                                href="/terms"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Términos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
