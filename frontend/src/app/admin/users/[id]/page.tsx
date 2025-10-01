'use client';

import { UserForm } from '@/components/admin/UserForm';
import { usersApi } from '@/lib/users-api';
import { User, UserUpdate } from '@/types/user';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditUserPage() {
    const params = useParams();
    const userId = parseInt(params.id as string);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        loadUser();
    }, [userId]);

    const loadUser = async () => {
        try {
            setIsFetching(true);
            const data = await usersApi.getUser(userId);
            setUser(data);
        } catch (error: any) {
            toast.error('Error al cargar usuario');
            console.error('Error loading user:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (data: UserUpdate) => {
        try {
            setIsLoading(true);
            await usersApi.updateUser(userId, data);
            toast.success('Usuario actualizado correctamente');
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Error al actualizar usuario';
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando usuario...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Usuario no encontrado</h2>
                <p className="text-muted-foreground">El usuario que buscas no existe.</p>
            </div>
        );
    }

    return (
        <UserForm user={user} onSubmit={handleSubmit} isLoading={isLoading} />
    );
}
