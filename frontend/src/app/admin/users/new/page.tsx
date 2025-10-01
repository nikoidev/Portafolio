'use client';

import { UserForm } from '@/components/admin/UserForm';
import { Header } from '@/components/shared/Header';
import { usersApi } from '@/lib/users-api';
import { UserCreate, UserUpdate } from '@/types/user';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewUserPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: UserCreate | UserUpdate) => {
        try {
            setIsLoading(true);
            await usersApi.createUser(data as UserCreate);
            toast.success('Usuario creado correctamente');
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Error al crear usuario';
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header variant="admin" />
            <div className="container mx-auto px-4 py-8">
                <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </>
    );
}
