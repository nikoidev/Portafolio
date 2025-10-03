/**
 * API Client para gestión de usuarios
 */
import { RoleInfo, User, UserCreate, UserUpdate } from '@/types/user';
import { api } from './api';

export const usersApi = {
    // Listar usuarios
    async getUsers(params?: { skip?: number; limit?: number }): Promise<User[]> {
        return api.get('/api/v1/users/', params);
    },

    // Obtener usuario actual con permisos
    async getCurrentUser(): Promise<User> {
        return api.get('/api/v1/users/me');
    },

    // Obtener usuario por ID
    async getUser(id: number): Promise<User> {
        return api.get(`/api/v1/users/${id}`);
    },

    // Crear usuario
    async createUser(data: UserCreate): Promise<User> {
        return api.post('/api/v1/users/', data);
    },

    // Actualizar usuario
    async updateUser(id: number, data: UserUpdate): Promise<User> {
        return api.put(`/api/v1/users/${id}`, data);
    },

    // Eliminar usuario
    async deleteUser(id: number): Promise<void> {
        return api.delete(`/api/v1/users/${id}`);
    },

    // Obtener roles disponibles
    async getAvailableRoles(): Promise<RoleInfo[]> {
        return api.get('/api/v1/users/roles/available');
    },

    // Verificar permiso
    async checkPermission(permission: string): Promise<{ permission: string; has_permission: boolean }> {
        return api.post('/api/v1/users/check-permission', { permission });
    },
};
