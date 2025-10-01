'use client';

import { UserList } from '@/components/admin/UserList';
import { Header } from '@/components/shared/Header';
import { usersApi } from '@/lib/users-api';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await usersApi.getUsers();
            setUsers(data);
        } catch (error: any) {
            toast.error('Error al cargar usuarios');
            console.error('Error loading users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await usersApi.deleteUser(id);
            toast.success('Usuario eliminado correctamente');
            loadUsers(); // Recargar lista
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Error al eliminar usuario';
            toast.error(errorMessage);
            throw error;
        }
    };

    return (
        <>
            <Header variant="admin" />
            <div className="container mx-auto px-4 py-8">
                <UserList
                    users={users}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
}
