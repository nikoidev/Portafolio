'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { CheckCircle, Loader2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminSetupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const createSuperAdmin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await api.createSuperAdmin();
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/admin/login');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error al crear super administrador');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-700 mb-2">
                            ¡Configuración Completada!
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Usuario administrador creado exitosamente.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Redirigiendo al login...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <UserPlus className="w-16 h-16 text-primary mx-auto mb-4" />
                    <CardTitle className="text-2xl font-bold">
                        Configuración Inicial
                    </CardTitle>
                    <CardDescription>
                        Crea el super administrador del sistema. Las credenciales se toman del archivo .env del backend.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Credenciales desde backend/.env:
                        </h3>
                        <div className="text-sm text-blue-800 space-y-1">
                            <p><strong>SUPER_ADMIN_EMAIL</strong></p>
                            <p><strong>SUPER_ADMIN_PASSWORD</strong></p>
                            <p><strong>SUPER_ADMIN_NAME</strong></p>
                        </div>
                        <p className="text-xs text-blue-700 mt-2">
                            Por defecto: admin@portfolio.com / changeme123 (CÁMBIALO en producción)
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <Button
                        onClick={createSuperAdmin}
                        disabled={isLoading}
                        className="w-full"
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creando super administrador...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Crear Super Administrador
                            </>
                        )}
                    </Button>

                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            Solo necesitas hacer esto una vez. Después podrás cambiar las credenciales.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
