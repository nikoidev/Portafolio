/**
 * Cliente API — ahora apunta a los Route Handlers del mismo dominio.
 * baseURL vacío = URLs relativas (funciona en desarrollo y en Vercel).
 */
import { Project } from '@/types/api';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: '',
            headers: { 'Content-Type': 'application/json' },
        });

        // Manejo de errores 401
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
                        window.location.href = '/admin/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

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

    async patch<T>(url: string, data?: any): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(url, data);
        return response.data;
    }

    async delete<T>(url: string): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url);
        return response.data;
    }

    // Projects
    async getProjects(params?: {
        skip?: number;
        limit?: number;
        featured_only?: boolean;
        search?: string;
        include_unpublished?: boolean;
    }): Promise<Project[]> {
        return this.get<Project[]>('/api/projects', params);
    }

    async getFeaturedProjects(limit = 6): Promise<Project[]> {
        return this.get<Project[]>('/api/projects', { featured_only: true, limit });
    }

    async getProject(identifier: string): Promise<Project> {
        return this.get<Project>(`/api/projects/${identifier}`);
    }

    async createProject(data: any): Promise<Project> {
        return this.post<Project>('/api/projects', data);
    }

    async updateProject(slug: string, data: any): Promise<Project> {
        return this.put<Project>(`/api/projects/${slug}`, data);
    }

    async deleteProject(slug: string): Promise<void> {
        return this.delete(`/api/projects/${slug}`);
    }

    async getProjectStats() {
        const projects = await this.getProjects({ include_unpublished: true });
        const total = projects.length;
        const published = projects.filter((p: any) => p.is_published).length;
        const featured = projects.filter((p: any) => p.is_featured).length;
        const totalViews = projects.reduce((sum: number, p: any) => sum + (p.view_count || 0), 0);
        return { total_projects: total, published_projects: published, featured_projects: featured, total_views: totalViews };
    }

    // Uploads
    async uploadImage(formData: FormData): Promise<{ url: string; filename: string; size: number }> {
        return this.post<{ url: string; filename: string; size: number }>('/api/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async uploadMultipleImages(formData: FormData): Promise<{ images: Array<{ url: string; filename: string; size: number }> }> {
        return this.post<{ images: Array<{ url: string; filename: string; size: number }> }>('/api/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async uploadFile(formData: FormData): Promise<{ url: string; filename: string; size: number }> {
        return this.post<{ url: string; filename: string; size: number }>('/api/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async uploadVideo(formData: FormData): Promise<{ url: string; filename: string; size: number; thumbnail?: string }> {
        return this.post<{ url: string; filename: string; size: number; thumbnail?: string }>('/api/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}

export const api = new ApiClient();

export const handleApiError = (error: any): string => {
    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.data?.detail) return error.response.data.detail;
    if (error.message) return error.message;
    return 'Ha ocurrido un error inesperado';
};

// getImageUrl ya no necesita prefijo de backend — las URLs de Vercel Blob
// son absolutas. Las rutas relativas siguen funcionando para compatibilidad.
export const getImageUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url; // relative paths served by Next.js
};
