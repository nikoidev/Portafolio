'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Shield, ShieldCheck } from 'lucide-react';

export function RolePermissionsInfo() {
    const roles = [
        {
            name: 'Super Administrador',
            icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
            color: 'bg-red-100 text-red-800 border-red-200',
            description: 'Control total del sistema, incluyendo gestión de administradores y configuración del sistema.',
            permissions: [
                'Gestionar todos los usuarios (crear, editar, eliminar)',
                'Asignar cualquier rol incluyendo Super Admin',
                'Gestión completa de proyectos',
                'Gestión completa de CV',
                'Subir y eliminar archivos',
                'Gestión completa de contenido (CMS)',
                'Ver analíticas del sistema',
                'Gestionar configuración del sistema',
            ]
        },
        {
            name: 'Administrador',
            icon: <Shield className="w-5 h-5 text-blue-600" />,
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            description: 'Gestión completa del contenido y usuarios (excepto Super Admins).',
            permissions: [
                'Crear y gestionar usuarios (excepto Super Admin)',
                'Gestión completa de proyectos',
                'Gestión completa de CV',
                'Subir y eliminar archivos',
                'Gestión completa de contenido (CMS)',
                'Ver analíticas del sistema',
            ],
            restrictions: [
                'No puede crear/editar Super Administradores',
                'No puede gestionar configuración del sistema',
            ]
        },
        {
            name: 'Editor',
            icon: <Shield className="w-5 h-5 text-green-600" />,
            color: 'bg-green-100 text-green-800 border-green-200',
            description: 'Puede crear y editar contenido, pero no eliminarlo ni gestionar usuarios.',
            permissions: [
                'Crear, editar y publicar proyectos',
                'Editar y generar CV en PDF',
                'Subir archivos',
                'Crear y editar contenido del CMS',
                'Ver analíticas del sistema',
            ],
            restrictions: [
                'No puede eliminar proyectos',
                'No puede eliminar contenido del CMS',
                'No puede gestionar usuarios',
                'No puede eliminar archivos',
            ]
        },
        {
            name: 'Visualizador',
            icon: <Eye className="w-5 h-5 text-gray-600" />,
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            description: 'Solo lectura de contenido público del sistema.',
            permissions: [
                'Ver proyectos',
                'Ver contenido del CMS',
                'Ver analíticas del sistema',
            ],
            restrictions: [
                'No puede crear ni editar nada',
                'No puede ver lista de usuarios',
                'No puede subir archivos',
                'Solo acceso de lectura',
            ]
        },
    ];

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Roles y Permisos del Sistema</CardTitle>
                <CardDescription>
                    Descripción detallada de cada rol y sus permisos asociados
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    {roles.map((role, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                {role.icon}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{role.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {role.description}
                                    </p>
                                </div>
                                <Badge variant="outline" className={role.color}>
                                    {role.name}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-green-700">✅ Permisos:</h4>
                                <ul className="space-y-1">
                                    {role.permissions.map((perm, idx) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">•</span>
                                            {perm}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {role.restrictions && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-red-700">❌ Restricciones:</h4>
                                    <ul className="space-y-1">
                                        {role.restrictions.map((rest, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="text-red-600 mt-0.5">•</span>
                                                {rest}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">💡 Recomendaciones de Uso:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span><strong>Super Admin</strong>: Solo para el propietario del sitio. Límitalo a 1-2 personas de confianza.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span><strong>Admin</strong>: Para gerentes de contenido que necesitan control completo del día a día.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span><strong>Editor</strong>: Para creadores de contenido que publican proyectos y actualizan el CV.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span><strong>Visualizador</strong>: Para clientes o stakeholders que solo necesitan ver el contenido sin modificarlo.</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}

