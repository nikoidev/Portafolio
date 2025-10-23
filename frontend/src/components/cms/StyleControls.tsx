'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlignCenter, AlignLeft, Maximize2, Palette, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SectionStyles {
    width?: 'full' | 'container' | 'narrow' | 'wide';
    height?: 'auto' | 'small' | 'medium' | 'large' | 'fullscreen';
    spacing?: 'none' | 'compact' | 'normal' | 'relaxed' | 'spacious';
    background?: 'none' | 'light' | 'dark' | 'primary' | 'gradient';

    // Campos técnicos (se generan automáticamente)
    padding?: { top?: string; bottom?: string; left?: string; right?: string; };
    margin?: { top?: string; bottom?: string; };
    minHeight?: string;
    maxHeight?: string;
    customClass?: string;
}

interface StyleControlsProps {
    styles: SectionStyles;
    onChange: (styles: SectionStyles) => void;
}

// Mapeo de valores amigables a CSS
const SPACING_MAP = {
    none: { top: '0', bottom: '0', left: '1rem', right: '1rem' },
    compact: { top: '2rem', bottom: '2rem', left: '1rem', right: '1rem' },
    normal: { top: '5rem', bottom: '5rem', left: '1rem', right: '1rem' },
    relaxed: { top: '8rem', bottom: '8rem', left: '1rem', right: '1rem' },
    spacious: { top: '12rem', bottom: '12rem', left: '2rem', right: '2rem' },
};

const HEIGHT_MAP = {
    auto: { min: 'auto', max: 'none' },
    small: { min: '300px', max: 'none' },
    medium: { min: '500px', max: 'none' },
    large: { min: '700px', max: 'none' },
    fullscreen: { min: '100vh', max: 'none' },
};

const BACKGROUND_MAP = {
    none: { bg: 'transparent', class: '' },
    light: { bg: '', class: 'bg-muted/30' },
    dark: { bg: '', class: 'bg-secondary/50' },
    primary: { bg: '', class: 'bg-primary/5' },
    gradient: { bg: '', class: 'bg-gradient-to-br from-primary/5 via-background to-secondary/5' },
};

export function StyleControls({ styles, onChange }: StyleControlsProps) {
    const [width, setWidth] = useState<string>(styles?.width || 'full');
    const [height, setHeight] = useState<string>(styles?.height || 'auto');
    const [spacing, setSpacing] = useState<string>(styles?.spacing || 'normal');
    const [background, setBackground] = useState<string>(styles?.background || 'none');

    useEffect(() => {
        setWidth(styles?.width || 'full');
        setHeight(styles?.height || 'auto');
        setSpacing(styles?.spacing || 'normal');
        setBackground(styles?.background || 'none');
    }, [styles]);

    const applyChanges = (newWidth?: string, newHeight?: string, newSpacing?: string, newBg?: string) => {
        const w = newWidth || width;
        const h = newHeight || height;
        const s = newSpacing || spacing;
        const bg = newBg || background;

        const spacingValues = SPACING_MAP[s as keyof typeof SPACING_MAP];
        const heightValues = HEIGHT_MAP[h as keyof typeof HEIGHT_MAP];
        const bgValues = BACKGROUND_MAP[bg as keyof typeof BACKGROUND_MAP];

        const updatedStyles: SectionStyles = {
            width: w as any,
            height: h as any,
            spacing: s as any,
            background: bg as any,
            padding: spacingValues,
            margin: { top: '0', bottom: '0' },
            minHeight: heightValues.min,
            maxHeight: heightValues.max,
            customClass: bgValues.class,
        };

        onChange(updatedStyles);
    };

    const handleWidthChange = (value: string) => {
        setWidth(value);
        applyChanges(value, undefined, undefined, undefined);
    };

    const handleHeightChange = (value: string) => {
        setHeight(value);
        applyChanges(undefined, value, undefined, undefined);
    };

    const handleSpacingChange = (value: string) => {
        setSpacing(value);
        applyChanges(undefined, undefined, value, undefined);
    };

    const handleBackgroundChange = (value: string) => {
        setBackground(value);
        applyChanges(undefined, undefined, undefined, value);
    };

    return (
        <div className="space-y-6">
            {/* Ancho de la sección */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlignLeft className="w-5 h-5 text-primary" />
                        <CardTitle>Ancho de la sección</CardTitle>
                    </div>
                    <CardDescription>
                        ¿Qué tan ancha quieres que sea esta sección?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={width} onValueChange={handleWidthChange} className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="narrow" id="width-narrow" />
                            <div className="flex-1">
                                <Label htmlFor="width-narrow" className="cursor-pointer font-semibold">
                                    📱 Estrecha
                                </Label>
                                <p className="text-sm text-muted-foreground">Ideal para texto, fácil de leer</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="container" id="width-container" />
                            <div className="flex-1">
                                <Label htmlFor="width-container" className="cursor-pointer font-semibold">
                                    💻 Normal
                                </Label>
                                <p className="text-sm text-muted-foreground">Ancho estándar, equilibrado</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="wide" id="width-wide" />
                            <div className="flex-1">
                                <Label htmlFor="width-wide" className="cursor-pointer font-semibold">
                                    🖥️ Amplia
                                </Label>
                                <p className="text-sm text-muted-foreground">Para mostrar mucho contenido</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="full" id="width-full" />
                            <div className="flex-1">
                                <Label htmlFor="width-full" className="cursor-pointer font-semibold">
                                    🔲 Toda la pantalla
                                </Label>
                                <p className="text-sm text-muted-foreground">Ocupa todo el ancho disponible</p>
                            </div>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Altura de la sección */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Maximize2 className="w-5 h-5 text-primary" />
                        <CardTitle>Altura de la sección</CardTitle>
                    </div>
                    <CardDescription>
                        ¿Qué tan alta quieres que sea esta sección?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={height} onValueChange={handleHeightChange} className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="auto" id="height-auto" />
                            <div className="flex-1">
                                <Label htmlFor="height-auto" className="cursor-pointer font-semibold">
                                    📏 Automática
                                </Label>
                                <p className="text-sm text-muted-foreground">Se ajusta al contenido</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="small" id="height-small" />
                            <div className="flex-1">
                                <Label htmlFor="height-small" className="cursor-pointer font-semibold">
                                    📐 Pequeña
                                </Label>
                                <p className="text-sm text-muted-foreground">Mínimo 300 píxeles de alto</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="medium" id="height-medium" />
                            <div className="flex-1">
                                <Label htmlFor="height-medium" className="cursor-pointer font-semibold">
                                    📊 Mediana
                                </Label>
                                <p className="text-sm text-muted-foreground">Mínimo 500 píxeles de alto</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="large" id="height-large" />
                            <div className="flex-1">
                                <Label htmlFor="height-large" className="cursor-pointer font-semibold">
                                    📈 Grande
                                </Label>
                                <p className="text-sm text-muted-foreground">Mínimo 700 píxeles de alto</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="fullscreen" id="height-fullscreen" />
                            <div className="flex-1">
                                <Label htmlFor="height-fullscreen" className="cursor-pointer font-semibold">
                                    🖼️ Pantalla completa
                                </Label>
                                <p className="text-sm text-muted-foreground">Ocupa toda la altura de la pantalla</p>
                            </div>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Espaciado */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlignCenter className="w-5 h-5 text-primary" />
                        <CardTitle>Espaciado interior</CardTitle>
                    </div>
                    <CardDescription>
                        ¿Cuánto espacio quieres alrededor del contenido?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={spacing} onValueChange={handleSpacingChange} className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="none" id="spacing-none" />
                            <div className="flex-1">
                                <Label htmlFor="spacing-none" className="cursor-pointer font-semibold">
                                    🔸 Sin espaciado
                                </Label>
                                <p className="text-sm text-muted-foreground">Contenido pegado a los bordes</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="compact" id="spacing-compact" />
                            <div className="flex-1">
                                <Label htmlFor="spacing-compact" className="cursor-pointer font-semibold">
                                    🔹 Compacto
                                </Label>
                                <p className="text-sm text-muted-foreground">Poco espacio arriba y abajo</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="normal" id="spacing-normal" />
                            <div className="flex-1">
                                <Label htmlFor="spacing-normal" className="cursor-pointer font-semibold">
                                    🔷 Normal
                                </Label>
                                <p className="text-sm text-muted-foreground">Espaciado equilibrado (recomendado)</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="relaxed" id="spacing-relaxed" />
                            <div className="flex-1">
                                <Label htmlFor="spacing-relaxed" className="cursor-pointer font-semibold">
                                    🔶 Relajado
                                </Label>
                                <p className="text-sm text-muted-foreground">Bastante espacio arriba y abajo</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="spacious" id="spacing-spacious" />
                            <div className="flex-1">
                                <Label htmlFor="spacing-spacious" className="cursor-pointer font-semibold">
                                    🔲 Espacioso
                                </Label>
                                <p className="text-sm text-muted-foreground">Mucho espacio arriba y abajo</p>
                            </div>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Fondo */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" />
                        <CardTitle>Color de fondo</CardTitle>
                    </div>
                    <CardDescription>
                        Elige el fondo que quieres para esta sección
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={background} onValueChange={handleBackgroundChange} className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer bg-transparent">
                            <RadioGroupItem value="none" id="bg-none" />
                            <div className="flex-1">
                                <Label htmlFor="bg-none" className="cursor-pointer font-semibold">
                                    ⚪ Transparente
                                </Label>
                                <p className="text-sm text-muted-foreground">Sin color de fondo</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer bg-muted/30">
                            <RadioGroupItem value="light" id="bg-light" />
                            <div className="flex-1">
                                <Label htmlFor="bg-light" className="cursor-pointer font-semibold">
                                    ⚫ Gris claro
                                </Label>
                                <p className="text-sm text-muted-foreground">Fondo gris suave</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer bg-secondary/50">
                            <RadioGroupItem value="dark" id="bg-dark" />
                            <div className="flex-1">
                                <Label htmlFor="bg-dark" className="cursor-pointer font-semibold">
                                    ⬛ Gris oscuro
                                </Label>
                                <p className="text-sm text-muted-foreground">Fondo gris más intenso</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer bg-primary/5">
                            <RadioGroupItem value="primary" id="bg-primary" />
                            <div className="flex-1">
                                <Label htmlFor="bg-primary" className="cursor-pointer font-semibold">
                                    🎨 Color principal
                                </Label>
                                <p className="text-sm text-muted-foreground">Usa el color principal del sitio</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <RadioGroupItem value="gradient" id="bg-gradient" />
                            <div className="flex-1">
                                <Label htmlFor="bg-gradient" className="cursor-pointer font-semibold">
                                    🌈 Degradado
                                </Label>
                                <p className="text-sm text-muted-foreground">Gradiente de colores suave</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 via-background to-secondary/20 border" />
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Preview simple */}
            <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <CardTitle className="text-sm">Vista previa</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Ancho:</span>
                        <span className="font-medium">
                            {width === 'full' && '🔲 Toda la pantalla'}
                            {width === 'wide' && '🖥️ Amplia'}
                            {width === 'container' && '💻 Normal'}
                            {width === 'narrow' && '📱 Estrecha'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Altura:</span>
                        <span className="font-medium">
                            {height === 'auto' && '📏 Automática'}
                            {height === 'small' && '📐 Pequeña'}
                            {height === 'medium' && '📊 Mediana'}
                            {height === 'large' && '📈 Grande'}
                            {height === 'fullscreen' && '🖼️ Pantalla completa'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Espaciado:</span>
                        <span className="font-medium">
                            {spacing === 'none' && '🔸 Sin espaciado'}
                            {spacing === 'compact' && '🔹 Compacto'}
                            {spacing === 'normal' && '🔷 Normal'}
                            {spacing === 'relaxed' && '🔶 Relajado'}
                            {spacing === 'spacious' && '🔲 Espacioso'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Fondo:</span>
                        <span className="font-medium">
                            {background === 'none' && '⚪ Transparente'}
                            {background === 'light' && '⚫ Gris claro'}
                            {background === 'dark' && '⬛ Gris oscuro'}
                            {background === 'primary' && '🎨 Color principal'}
                            {background === 'gradient' && '🌈 Degradado'}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
