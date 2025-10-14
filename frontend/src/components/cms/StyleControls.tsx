'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Maximize2, Move } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SectionStyles {
    width?: 'full' | 'container' | 'narrow' | 'wide' | 'custom';
    customWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    padding?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };
    margin?: {
        top?: string;
        bottom?: string;
    };
    background?: string;
    customClass?: string;
}

interface StyleControlsProps {
    styles: SectionStyles;
    onChange: (styles: SectionStyles) => void;
}

export function StyleControls({ styles, onChange }: StyleControlsProps) {
    const [localStyles, setLocalStyles] = useState<SectionStyles>(styles || {
        width: 'full',
        padding: { top: '5rem', bottom: '5rem', left: '1rem', right: '1rem' },
        margin: { top: '0', bottom: '0' }
    });

    useEffect(() => {
        setLocalStyles(styles || {
            width: 'full',
            padding: { top: '5rem', bottom: '5rem', left: '1rem', right: '1rem' },
            margin: { top: '0', bottom: '0' }
        });
    }, [styles]);

    const updateStyles = (newStyles: Partial<SectionStyles>) => {
        const updated = { ...localStyles, ...newStyles };
        setLocalStyles(updated);
        onChange(updated);
    };

    const updatePadding = (side: 'top' | 'bottom' | 'left' | 'right', value: string) => {
        const updated = {
            ...localStyles,
            padding: { ...localStyles.padding, [side]: value }
        };
        setLocalStyles(updated);
        onChange(updated);
    };

    const updateMargin = (side: 'top' | 'bottom', value: string) => {
        const updated = {
            ...localStyles,
            margin: { ...localStyles.margin, [side]: value }
        };
        setLocalStyles(updated);
        onChange(updated);
    };

    const paddingPresets = [
        { label: 'Sin padding', value: '0' },
        { label: 'Pequeño', value: '2rem' },
        { label: 'Medio', value: '5rem' },
        { label: 'Grande', value: '8rem' },
        { label: 'Extra grande', value: '12rem' },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Maximize2 className="w-5 h-5 text-primary" />
                        <CardTitle>Dimensiones y Layout</CardTitle>
                    </div>
                    <CardDescription>
                        Controla el ancho, alto y espaciado de la sección
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Ancho */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Ancho de la sección</Label>
                        <Select
                            value={localStyles.width || 'full'}
                            onValueChange={(value: any) => updateStyles({ width: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full">🔲 Ancho completo (100%)</SelectItem>
                                <SelectItem value="container">📦 Contenedor estándar (1280px max)</SelectItem>
                                <SelectItem value="narrow">📄 Estrecho (768px max)</SelectItem>
                                <SelectItem value="wide">🖥️ Amplio (1536px max)</SelectItem>
                                <SelectItem value="custom">⚙️ Personalizado</SelectItem>
                            </SelectContent>
                        </Select>

                        {localStyles.width === 'custom' && (
                            <div className="ml-4 space-y-2">
                                <Label className="text-sm">Ancho personalizado</Label>
                                <Input
                                    value={localStyles.customWidth || '100%'}
                                    onChange={(e) => updateStyles({ customWidth: e.target.value })}
                                    placeholder="Ej: 80%, 1000px, 50vw"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Usa unidades CSS: px, %, rem, vw, etc.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Alto mínimo */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Alto mínimo</Label>
                        <Input
                            value={localStyles.minHeight || 'auto'}
                            onChange={(e) => updateStyles({ minHeight: e.target.value })}
                            placeholder="auto, 500px, 100vh, etc."
                        />
                        <p className="text-xs text-muted-foreground">
                            Altura mínima de la sección (auto = ajuste automático)
                        </p>
                    </div>

                    {/* Alto máximo */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Alto máximo</Label>
                        <Input
                            value={localStyles.maxHeight || 'none'}
                            onChange={(e) => updateStyles({ maxHeight: e.target.value })}
                            placeholder="none, 800px, 90vh, etc."
                        />
                        <p className="text-xs text-muted-foreground">
                            Altura máxima de la sección (none = sin límite)
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Move className="w-5 h-5 text-primary" />
                        <CardTitle>Espaciado</CardTitle>
                    </div>
                    <CardDescription>
                        Ajusta el padding interno y margin externo
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Padding */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Padding (espaciado interno)</Label>

                        {/* Presets rápidos */}
                        <div className="flex gap-2 flex-wrap">
                            {paddingPresets.map(preset => (
                                <Button
                                    key={preset.value}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        updatePadding('top', preset.value);
                                        updatePadding('bottom', preset.value);
                                    }}
                                    className="text-xs"
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label className="text-sm">⬆️ Superior</Label>
                                <Input
                                    value={localStyles.padding?.top || '5rem'}
                                    onChange={(e) => updatePadding('top', e.target.value)}
                                    placeholder="5rem"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">⬇️ Inferior</Label>
                                <Input
                                    value={localStyles.padding?.bottom || '5rem'}
                                    onChange={(e) => updatePadding('bottom', e.target.value)}
                                    placeholder="5rem"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">⬅️ Izquierda</Label>
                                <Input
                                    value={localStyles.padding?.left || '1rem'}
                                    onChange={(e) => updatePadding('left', e.target.value)}
                                    placeholder="1rem"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">➡️ Derecha</Label>
                                <Input
                                    value={localStyles.padding?.right || '1rem'}
                                    onChange={(e) => updatePadding('right', e.target.value)}
                                    placeholder="1rem"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Margin */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Margin (espaciado externo)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">⬆️ Superior</Label>
                                <Input
                                    value={localStyles.margin?.top || '0'}
                                    onChange={(e) => updateMargin('top', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">⬇️ Inferior</Label>
                                <Input
                                    value={localStyles.margin?.bottom || '0'}
                                    onChange={(e) => updateMargin('bottom', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Background */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Color de fondo</Label>
                        <Input
                            value={localStyles.background || ''}
                            onChange={(e) => updateStyles({ background: e.target.value })}
                            placeholder="transparent, #ffffff, rgb(255,255,255)"
                        />
                        <p className="text-xs text-muted-foreground">
                            Usa transparent, hex (#fff), rgb, o clases de Tailwind
                        </p>
                    </div>

                    {/* Clase personalizada */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Clase CSS personalizada</Label>
                        <Input
                            value={localStyles.customClass || ''}
                            onChange={(e) => updateStyles({ customClass: e.target.value })}
                            placeholder="bg-gradient-to-r from-blue-500 to-purple-600"
                        />
                        <p className="text-xs text-muted-foreground">
                            Agrega clases de Tailwind o CSS personalizadas
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Preview de estilos aplicados */}
            <Card className="border-primary/50">
                <CardHeader>
                    <CardTitle className="text-sm">Vista previa de estilos CSS</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                        {`width: ${localStyles.width === 'custom' ? localStyles.customWidth : localStyles.width}
min-height: ${localStyles.minHeight || 'auto'}
max-height: ${localStyles.maxHeight || 'none'}
padding: ${localStyles.padding?.top} ${localStyles.padding?.right} ${localStyles.padding?.bottom} ${localStyles.padding?.left}
margin: ${localStyles.margin?.top} auto ${localStyles.margin?.bottom}
background: ${localStyles.background || 'transparent'}`}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}

