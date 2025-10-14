/**
 * Store de autenticación con Zustand
 */
import { api } from '@/lib/api';
import { Token, User } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isValidating: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    getCurrentUser: () => Promise<void>;
    validateSession: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isValidating: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    const tokenData: Token = await api.login(email, password);

                    // Obtener información del usuario
                    const userData: User = await api.getCurrentUser() as any;

                    set({
                        user: userData,
                        token: tokenData.access_token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return true;
                } catch (error: any) {
                    const errorMessage = error.response?.data?.detail || 'Error al iniciar sesión';
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: errorMessage,
                    });
                    return false;
                }
            },

            logout: () => {
                api.logout();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            getCurrentUser: async () => {
                if (!get().token) return;

                set({ isLoading: true });

                try {
                    const userData: User = await api.getCurrentUser() as any;
                    set({
                        user: userData,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error: any) {
                    // Si falla, limpiar la sesión
                    get().logout();
                    set({ isLoading: false });
                }
            },

            validateSession: async () => {
                const state = get();

                // Si no hay token o ya está validando, no hacer nada
                if (!state.token || state.isValidating) return;

                set({ isValidating: true });

                try {
                    // Intentar obtener el usuario actual (esto valida el token)
                    const userData: User = await api.getCurrentUser() as any;
                    set({
                        user: userData,
                        isAuthenticated: true,
                        isValidating: false,
                        error: null,
                    });
                } catch (error: any) {
                    // Token expirado o inválido: limpiar sesión silenciosamente
                    console.log('Sesión expirada, cerrando automáticamente...');
                    get().logout();
                    set({ isValidating: false });
                }
            },

            clearError: () => set({ error: null }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),

            isSuperAdmin: () => {
                const state = get();
                return state.user?.role === 'super_admin';
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
