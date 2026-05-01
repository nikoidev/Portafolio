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
    updateProject: (slug: string, data: any) => Promise<boolean>;
    deleteProject: (slug: string) => Promise<boolean>;
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
            set({ projects: Array.isArray(projects) ? projects : [], isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Error al cargar proyectos', isLoading: false });
        }
    },

    fetchFeaturedProjects: async (limit = 6) => {
        set({ isLoading: true, error: null });
        try {
            const projects = await api.getFeaturedProjects(limit);
            set({ featuredProjects: Array.isArray(projects) ? projects : [], isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Error al cargar proyectos destacados', isLoading: false });
        }
    },

    fetchProject: async (identifier: string) => {
        set({ isLoading: true, error: null });
        try {
            const project = await api.getProject(identifier);
            set({ currentProject: project, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Proyecto no encontrado', isLoading: false });
        }
    },

    fetchProjectStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const stats = await api.getProjectStats() as any;
            set({ stats, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Error al cargar estadísticas', isLoading: false });
        }
    },

    createProject: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newProject = await api.createProject(data);
            set((state) => ({ projects: [newProject, ...state.projects], isLoading: false }));
            return true;
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Error al crear proyecto', isLoading: false });
            return false;
        }
    },

    updateProject: async (slug: string, data) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await api.updateProject(slug, data);
            set((state) => ({
                projects: state.projects.map(p => p.slug === slug ? updated : p),
                currentProject: state.currentProject?.slug === slug ? updated : state.currentProject,
                isLoading: false,
            }));
            return true;
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Error al actualizar proyecto', isLoading: false });
            return false;
        }
    },

    deleteProject: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.deleteProject(slug);
            set((state) => ({
                projects: state.projects.filter(p => p.slug !== slug),
                featuredProjects: state.featuredProjects.filter(p => p.slug !== slug),
                currentProject: state.currentProject?.slug === slug ? null : state.currentProject,
                isLoading: false,
            }));
            return true;
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Error al eliminar proyecto', isLoading: false });
            return false;
        }
    },

    clearError: () => set({ error: null }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
