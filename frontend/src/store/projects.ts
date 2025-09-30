/**
 * Store de proyectos con Zustand
 */
import { api } from '@/lib/api';
import { Project, ProjectStats } from '@/types/api';
import { create } from 'zustand';

interface ProjectsState {
    projects: Project[];
    featuredProjects: Project[];
    currentProject: Project | null;
    stats: ProjectStats | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProjects: (params?: {
        skip?: number;
        limit?: number;
        featured_only?: boolean;
        search?: string;
        include_unpublished?: boolean;
    }) => Promise<void>;
    fetchFeaturedProjects: (limit?: number) => Promise<void>;
    fetchProject: (identifier: string) => Promise<void>;
    fetchProjectStats: () => Promise<void>;
    createProject: (data: any) => Promise<boolean>;
    updateProject: (id: number, data: any) => Promise<boolean>;
    deleteProject: (id: number) => Promise<boolean>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
    projects: [],
    featuredProjects: [],
    currentProject: null,
    stats: null,
    isLoading: false,
    error: null,

    fetchProjects: async (params) => {
        set({ isLoading: true, error: null });

        try {
            const projects = await api.getProjects(params);
            set({
                projects: Array.isArray(projects) ? projects : [],
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Error al cargar proyectos',
                isLoading: false,
            });
        }
    },

    fetchFeaturedProjects: async (limit = 6) => {
        set({ isLoading: true, error: null });

        try {
            const projects = await api.getFeaturedProjects(limit);
            set({
                featuredProjects: Array.isArray(projects) ? projects : [],
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Error al cargar proyectos destacados',
                isLoading: false,
            });
        }
    },

    fetchProject: async (identifier: string) => {
        set({ isLoading: true, error: null });

        try {
            const project = await api.getProject(identifier) as any;
            set({
                currentProject: project,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Proyecto no encontrado',
                isLoading: false,
            });
        }
    },

    fetchProjectStats: async () => {
        set({ isLoading: true, error: null });

        try {
            const stats = await api.getProjectStats() as any;
            set({
                stats,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Error al cargar estadísticas',
                isLoading: false,
            });
        }
    },

    createProject: async (data) => {
        set({ isLoading: true, error: null });

        try {
            const newProject = await api.createProject(data) as any;
            set((state) => ({
                projects: [newProject, ...state.projects],
                isLoading: false,
            }));
            return true;
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Error al crear proyecto',
                isLoading: false,
            });
            return false;
        }
    },

    updateProject: async (id: number, data) => {
        set({ isLoading: true, error: null });

        try {
            const updatedProject = await api.updateProject(id, data) as any;
            set((state) => ({
                projects: state.projects.map(p => p.id === id ? updatedProject : p),
                currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
                isLoading: false,
            }));
            return true;
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Error al actualizar proyecto',
                isLoading: false,
            });
            return false;
        }
    },

    deleteProject: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
            await api.deleteProject(id);
            set((state) => ({
                projects: state.projects.filter(p => p.id !== id),
                featuredProjects: state.featuredProjects.filter(p => p.id !== id),
                currentProject: state.currentProject?.id === id ? null : state.currentProject,
                isLoading: false,
            }));
            return true;
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Error al eliminar proyecto',
                isLoading: false,
            });
            return false;
        }
    },

    clearError: () => set({ error: null }),

    setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
