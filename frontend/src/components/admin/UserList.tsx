'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/store/auth';
import { ROLE_COLORS, ROLE_LABELS, User, UserRole } from '@/types/user';
import { Edit, Shield, ShieldCheck, ShieldOff, Trash2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface UserListProps {
    users: User[];
    onDelete: (id: number) => Promise<void>;
    isLoading?: boolean;
}

export function UserList({ users, onDelete, isLoading = false }: UserListProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { user: currentUser } = useAuthStore();

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await onDelete(userToDelete.id);
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.SUPER_ADMIN:
                return <ShieldCheck className="w-4 h-4" />;
            case UserRole.ADMIN:
                return <Shield className="w-4 h-4" />;
            default:
                return <ShieldOff className="w-4 h-4" />;
        }
    };

    const canDeleteUser = (user: User) => {
        // No se puede eliminar a sí mismo
        if (user.id === currentUser?.id) return false;

        // Solo super admin puede eliminar admins
        if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
            return currentUser?.role === UserRole.SUPER_ADMIN;
        }

        return true;
    };

    const canEditUser = (user: User) => {
        // Solo super admin puede editar otros super admins
        if (user.role === UserRole.SUPER_ADMIN && currentUser?.role !== UserRole.SUPER_ADMIN) {
            return false;
        }
        return true;
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Cargando usuarios...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center">
                        <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No hay usuarios</h3>
                        <p className="text-muted-foreground mb-4">
                            Crea el primer usuario del sistema
                        </p>
                        <Button asChild>
                            <Link href="/admin/users/new">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Crear Usuario
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Usuarios del Sistema</CardTitle>
                            <CardDescription>
                                Gestiona los usuarios y sus permisos
                            </CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/admin/users/new">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Nuevo Usuario
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Permisos</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                {user.id === currentUser?.id && (
                                                    <p className="text-xs text-muted-foreground">(Tú)</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={ROLE_COLORS[user.role as UserRole]}
                                        >
                                            <span className="mr-1.5">
                                                {getRoleIcon(user.role as UserRole)}
                                            </span>
                                            {ROLE_LABELS[user.role as UserRole]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {user.permissions && user.permissions.length > 0 ? (
                                                <>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {user.permissions.length} permisos
                                                    </Badge>
                                                    {user.permissions.slice(0, 2).map((perm, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                            {perm.replace(/_/g, ' ')}
                                                        </Badge>
                                                    ))}
                                                    {user.permissions.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{user.permissions.length - 2}
                                                        </Badge>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Sin permisos</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.is_active ? (
                                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                                Activo
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                                Inactivo
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {canEditUser(user) && (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Editar
                                                    </Link>
                                                </Button>
                                            )}
                                            {canDeleteUser(user) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Eliminar
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog de confirmación de eliminación */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar usuario?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el usuario
                            <strong className="block mt-2">
                                {userToDelete?.name} ({userToDelete?.email})
                            </strong>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar Usuario'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
