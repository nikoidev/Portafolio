'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePermissions } from '@/hooks/usePermissions';
import { useProjectsStore } from '@/store/projects';
import { BarChart3, Calendar, Eye, FolderOpen, Lightbulb, Star, ThermometerSun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WeatherData {
    temperature: number;
    condition: string;
}

interface DailyQuote {
    text: string;
    author: string;
}

export function DashboardStats() {
    const { stats, isLoading, fetchProjectStats } = useProjectsStore();
    const { isViewer } = usePermissions();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);

    // Solo cargar estadísticas si NO es visualizador
    useEffect(() => {
        if (!isViewer) {
            fetchProjectStats();
        }
    }, [isViewer, fetchProjectStats]);

    // Actualizar fecha cada segundo
    useEffect(() => {
        if (isViewer) {
            const timer = setInterval(() => {
                setCurrentDate(new Date());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isViewer]);

    // Seleccionar frase del día aleatoria
    useEffect(() => {
        if (isViewer) {
            const quotes: DailyQuote[] = [
                { text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día", author: "Robert Collier" },
                { text: "La única forma de hacer un gran trabajo es amar lo que haces", author: "Steve Jobs" },
                { text: "El código limpio siempre parece que fue escrito por alguien a quien le importa", author: "Robert C. Martin" },
                { text: "Primero resuelve el problema. Luego, escribe el código", author: "John Johnson" },
                { text: "La experiencia es el nombre que damos a nuestros errores", author: "Oscar Wilde" },
                { text: "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora", author: "Proverbio chino" },
                { text: "No cuentes los días, haz que los días cuenten", author: "Muhammad Ali" },
                { text: "La perfección se alcanza no cuando no hay nada más que añadir, sino cuando no hay nada más que quitar", author: "Antoine de Saint-Exupéry" },
                { text: "El aprendizaje nunca agota la mente", author: "Leonardo da Vinci" },
                { text: "La simplicidad es la máxima sofisticación", author: "Leonardo da Vinci" },
                { text: "Haz de cada día tu obra maestra", author: "John Wooden" },
                { text: "El único modo de hacer un gran trabajo es amar lo que haces", author: "Steve Jobs" },
                { text: "La innovación distingue entre un líder y un seguidor", author: "Steve Jobs" },
                { text: "Cualquier tonto puede escribir código que una computadora entienda. Los buenos programadores escriben código que los humanos puedan entender", author: "Martin Fowler" },
                { text: "La única manera de aprender un nuevo lenguaje de programación es escribir programas en él", author: "Dennis Ritchie" },
            ];

            // Seleccionar frase basada en el día del año para que sea consistente durante el día
            const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000);
            const selectedQuote = quotes[dayOfYear % quotes.length];
            setDailyQuote(selectedQuote);
        }
    }, [isViewer, currentDate.getDate()]);

    // Obtener información del clima (usando ubicación predeterminada: Madrid)
    useEffect(() => {
        if (isViewer) {
            const fetchWeather = async () => {
                try {
                    // Usar Madrid como ubicación por defecto (latitud: 40.4168, longitud: -3.7038)
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=40.4168&longitude=-3.7038&current=temperature_2m,weather_code&timezone=auto`
                    );
                    const data = await response.json();

                    const weatherConditions: Record<number, string> = {
                        0: 'Despejado',
                        1: 'Parcialmente nublado',
                        2: 'Nublado',
                        3: 'Cubierto',
                        45: 'Niebla',
                        48: 'Niebla',
                        51: 'Llovizna ligera',
                        53: 'Llovizna moderada',
                        55: 'Llovizna intensa',
                        61: 'Lluvia ligera',
                        63: 'Lluvia moderada',
                        65: 'Lluvia intensa',
                        71: 'Nieve ligera',
                        73: 'Nieve moderada',
                        75: 'Nieve intensa',
                        80: 'Chubascos',
                        95: 'Tormenta',
                    };

                    setWeather({
                        temperature: Math.round(data.current.temperature_2m),
                        condition: weatherConditions[data.current.weather_code] || 'Desconocido',
                    });
                } catch (error) {
                    console.error('Error fetching weather:', error);
                    setWeather({
                        temperature: 22,
                        condition: 'Clima agradable',
                    });
                } finally {
                    setWeatherLoading(false);
                }
            };

            fetchWeather();
        }
    }, [isViewer]);

    // Si es visualizador, mostrar información de fecha y clima
    if (isViewer) {
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const viewerCards = [
            {
                title: 'Fecha Actual',
                value: `${currentDate.getDate()} ${months[currentDate.getMonth()]}`,
                icon: Calendar,
                description: currentDate.getFullYear().toString(),
            },
            {
                title: 'Día de la Semana',
                value: daysOfWeek[currentDate.getDay()],
                icon: Calendar,
                description: currentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            },
            {
                title: 'Temperatura',
                value: weatherLoading ? '...' : `${weather?.temperature}°C`,
                icon: ThermometerSun,
                description: weatherLoading ? 'Cargando...' : weather?.condition || 'N/A',
            },
            {
                title: 'Frase del Día',
                value: dailyQuote?.author || 'Inspiración',
                icon: Lightbulb,
                description: dailyQuote?.text || 'Cargando frase...',
                isQuote: true,
            },
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {viewerCards.map((card) => {
                    const Icon = card.icon;
                    const isQuote = 'isQuote' in card && card.isQuote;

                    return (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {isQuote ? (
                                    <>
                                        <div className="text-sm italic text-muted-foreground mb-2 line-clamp-3">
                                            &ldquo;{card.description}&rdquo;
                                        </div>
                                        <p className="text-xs font-semibold text-foreground">
                                            — {card.value}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">{card.value}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {card.description}
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    }

    // Para usuarios con permisos de edición
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No se pudieron cargar las estadísticas</p>
            </div>
        );
    }

    const statsCards = [
        {
            title: 'Total Proyectos',
            value: stats.total_projects,
            icon: FolderOpen,
            description: 'Proyectos creados',
        },
        {
            title: 'Publicados',
            value: stats.published_projects,
            icon: BarChart3,
            description: 'Proyectos públicos',
        },
        {
            title: 'Destacados',
            value: stats.featured_projects,
            icon: Star,
            description: 'Proyectos destacados',
        },
        {
            title: 'Total Vistas',
            value: stats.total_views,
            icon: Eye,
            description: 'Vistas acumuladas',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
