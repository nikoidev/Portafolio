/**
 * Tipos para el sistema de usuarios, roles y permisos
 */

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer'
}

export enum Permission {
    // Usuarios
    CREATE_USER = 'create_user',
    READ_USER = 'read_user',
    UPDATE_USER = 'update_user',
    DELETE_USER = 'delete_user',
    MANAGE_ROLES = 'manage_roles',

    // Proyectos
    CREATE_PROJECT = 'create_project',
    READ_PROJECT = 'read_project',
    UPDATE_PROJECT = 'update_project',
    DELETE_PROJECT = 'delete_project',
    PUBLISH_PROJECT = 'publish_project',

    // CV
    UPDATE_CV = 'update_cv',
    GENERATE_CV_PDF = 'generate_cv_pdf',

    // Archivos
    UPLOAD_FILE = 'upload_file',
    DELETE_FILE = 'delete_file',

    // Sistema
    VIEW_ANALYTICS = 'view_analytics',
    MANAGE_SETTINGS = 'manage_settings'
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    is_active: boolean;
    permissions: string[];
    bio?: string;
    avatar_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    website_url?: string;
    created_at: string;
    updated_at: string;
}

export interface UserCreate {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    bio?: string;
    avatar_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    website_url?: string;
}

export interface UserUpdate {
    name?: string;
    bio?: string;
    avatar_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    website_url?: string;
    role?: UserRole;
    is_active?: boolean;
    password?: string;
}

export interface RoleInfo {
    name: string;
    value: string;
    permissions: string[];
}

export const ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Administrador',
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.EDITOR]: 'Editor',
    [UserRole.VIEWER]: 'Visualizador'
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Control total del sistema. Puede gestionar todos los usuarios y configuraciones.',
    [UserRole.ADMIN]: 'Gestión completa de contenido y usuarios (excepto super admins).',
    [UserRole.EDITOR]: 'Puede crear y editar proyectos y CV, pero no gestionar usuarios.',
    [UserRole.VIEWER]: 'Solo puede ver contenido, sin permisos de edición.'
};

export const ROLE_COLORS: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-200',
    [UserRole.ADMIN]: 'bg-blue-100 text-blue-800 border-blue-200',
    [UserRole.EDITOR]: 'bg-green-100 text-green-800 border-green-200',
    [UserRole.VIEWER]: 'bg-gray-100 text-gray-800 border-gray-200'
};
