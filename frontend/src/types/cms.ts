/**
 * Tipos TypeScript para el CMS (Content Management System)
 */

import { BaseEntity } from './api';

// ========== Content Types ==========

export interface PageContent extends BaseEntity {
    page_key: string;
    section_key: string;
    title: string;
    description?: string;
    content: Record<string, any>;
    styles?: Record<string, any>;
    is_active: boolean;
    is_editable: boolean;
    order_index: number;
    version: number;
    last_edited_by?: number;
}

export interface PageContentCreate {
    page_key: string;
    section_key: string;
    title: string;
    description?: string;
    content: Record<string, any>;
    styles?: Record<string, any>;
    is_active?: boolean;
    is_editable?: boolean;
    order_index?: number;
}

export interface PageContentUpdate {
    title?: string;
    description?: string;
    content?: Record<string, any>;
    styles?: Record<string, any>;
    is_active?: boolean;
    is_editable?: boolean;
    order_index?: number;
}

export interface PageSectionPublic {
    section_key: string;
    title: string;
    content: Record<string, any>;
    styles: Record<string, any>;
    order_index: number;
}

export interface PagePublic {
    page_key: string;
    sections: PageSectionPublic[];
}

export interface PageInfo {
    page_key: string;
    label: string;
    icon: string;
    description: string;
    sections_count: number;
}

export interface CMSStats {
    total_pages: number;
    total_sections: number;
    active_sections: number;
    editable_sections: number;
}

// ========== Helper Types ==========

export type PageKey = 'home' | 'about' | 'projects' | 'contact' | 'footer' | 'privacy' | 'terms' | 'navbar' | 'admin_header';

export const PAGE_LABELS: Record<PageKey, string> = {
    home: 'Inicio',
    about: 'Sobre Mí',
    projects: 'Proyectos',
    contact: 'Contacto',
    footer: 'Footer',
    privacy: 'Privacidad',
    terms: 'Términos y Condiciones',
    navbar: 'Menú Público',
    admin_header: 'Menú Admin',
};

export const PAGE_ICONS: Record<PageKey, string> = {
    home: '🏠',
    about: '👤',
    projects: '📁',
    contact: '📧',
    footer: '📐',
    privacy: '🔒',
    terms: '📄',
    navbar: '📱',
    admin_header: '⚙️',
};

