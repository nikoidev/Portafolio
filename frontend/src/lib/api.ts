/**
 * Cliente API para comunicación con el backend
 */
import { Token } from '@/types/api';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

class ApiClient {
    private client: AxiosInstance;
    private token: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8004',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para añadir token automáticamente
        this.client.interceptors.request.use((config) => {
            if (this.token) {
                config.headers.Authorization = `Bearer ${this.token}`;
            }
            return config;
        });

        // Interceptor para manejo de errores
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expirado o inválido
                    this.clearToken();
                    // Redirigir a login si estamos en el admin
                    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
                        window.location.href = '/admin/login';
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cargar token del localStorage al inicializar
        if (typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('auth_token');
            if (savedToken) {
                this.token = savedToken;
            }
        }
    }

    // Gestión de tokens
    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    getToken(): string | null {
        return this.token;
    }

    // Métodos HTTP genéricos
    async get<T>(url: string, params?: any): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, { params });
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: any): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data);
        return response.data;
    }

    async delete<T>(url: string): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url);
        return response.data;
    }

    // Métodos específicos de autenticación
    async login(email: string, password: string): Promise<Token> {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await this.client.post<Token>('/api/v1/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        this.setToken(response.data.access_token);
        return response.data;
    }

    async logout() {
        this.clearToken();
    }

    async getCurrentUser() {
        return this.get('/api/v1/auth/me');
    }

    // Métodos para proyectos
    async getProjects(params?: {
        skip?: number;
        limit?: number;
        featured_only?: boolean;
        search?: string;
        include_unpublished?: boolean;
    }) {
        return this.get('/api/v1/projects/', params);
    }

    async getFeaturedProjects(limit = 6) {
        return this.get('/api/v1/projects/featured', { limit });
    }

    async getProject(identifier: string) {
        return this.get(`/api/v1/projects/${identifier}`);
    }

    async createProject(data: any) {
        return this.post('/api/v1/projects/', data);
    }

    async updateProject(id: number, data: any) {
        return this.put(`/api/v1/projects/${id}`, data);
    }

    async deleteProject(id: number) {
        return this.delete(`/api/v1/projects/${id}`);
    }

    async getProjectStats() {
        return this.get('/api/v1/projects/stats');
    }

    // Métodos para CV
    async getCV() {
        return this.get('/api/v1/cv/');
    }

    async getPublicCV() {
        return this.get('/api/v1/cv/public');
    }

    async createOrUpdateCV(data: any) {
        return this.post('/api/v1/cv/', data);
    }

    async updateCV(data: any) {
        return this.put('/api/v1/cv/', data);
    }

    async generateCVPDF(template = 'modern', colorScheme = 'blue') {
        return this.post('/api/v1/cv/generate-pdf', {
            template,
            color_scheme: colorScheme,
        });
    }

    async getCVTemplates() {
        return this.get('/api/v1/cv/templates');
    }

    async getCVColorSchemes() {
        return this.get('/api/v1/cv/color-schemes');
    }

    // Método para crear super admin inicial
    async createSuperAdmin() {
        return this.post('/api/v1/auth/create-super-admin');
    }

    // Mantener compatibilidad con código viejo (deprecated)
    async createAdminUser() {
        return this.createSuperAdmin();
    }

    // Métodos para uploads
    async uploadImage(formData: FormData): Promise<{ url: string; filename: string; size: number }> {
        return this.post<{ url: string; filename: string; size: number }>('/api/v1/uploads/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async uploadMultipleImages(formData: FormData): Promise<{ images: Array<{ url: string; filename: string; size: number }> }> {
        return this.post<{ images: Array<{ url: string; filename: string; size: number }> }>('/api/v1/uploads/images/multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async uploadFile(formData: FormData): Promise<{ url: string; filename: string; size: number }> {
        return this.post<{ url: string; filename: string; size: number }>('/api/v1/uploads/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async getImages(limit = 50) {
        return this.get('/api/v1/uploads/images', { limit });
    }

    async getFiles(fileType = 'files', limit = 50) {
        return this.get('/api/v1/uploads/files', { file_type: fileType, limit });
    }

    async deleteImage(filename: string) {
        return this.delete(`/api/v1/uploads/images/${filename}`);
    }

    async deleteFile(filename: string, fileType = 'files') {
        return this.delete(`/api/v1/uploads/files/${filename}?file_type=${fileType}`);
    }

    async getFileInfo(filename: string, fileType = 'images') {
        return this.get(`/api/v1/uploads/info/${filename}?file_type=${fileType}`);
    }
}

// Instancia singleton del cliente API
export const api = new ApiClient();

// Hook personalizado para manejo de errores
export const handleApiError = (error: any): string => {
    if (error.response?.data?.detail) {
        return error.response.data.detail;
    }
    if (error.message) {
        return error.message;
    }
    return 'Ha ocurrido un error inesperado';
};

// Helper para obtener URL completa de imágenes
export const getImageUrl = (url: string): string => {
    if (!url) return '';

    // Si ya es una URL completa, devolverla tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Si es una ruta relativa, agregar el dominio del backend
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8004';
    return `${baseUrl}${url}`;
};
