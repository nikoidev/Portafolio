/**
 * Tipos TypeScript para la API del backend
 */

// Base types
export interface BaseEntity {
    id: number;
    created_at: string;
    updated_at: string;
}

// User types
export interface User extends BaseEntity {
    email: string;
    name: string;
    bio?: string;
    avatar_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    website_url?: string;
    is_active: boolean;
    role: 'super_admin' | 'admin' | 'editor' | 'viewer';
    permissions: string[];
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// Project types
export interface Project extends BaseEntity {
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    content?: string;
    github_url?: string;

    // DEMO CONFIGURATION
    // VIDEO DEMO
    demo_video_type?: string;  // 'youtube' | 'local'
    demo_video_url?: string;
    demo_video_thumbnail?: string;

    // GALLERY DEMO
    demo_images?: Array<{ url: string; title?: string; order?: number }>;

    // Legacy fields
    thumbnail_url?: string;
    images?: string[];
    image_urls?: string[];

    technologies: Array<{ name: string; icon: string; enabled: boolean }>;
    tags?: string[];
    is_featured: boolean;
    is_published?: boolean;
    view_count: number;
    order_index?: number;
}

export interface ProjectCreate {
    title: string;
    slug?: string;
    description: string;
    short_description?: string;
    content?: string;
    github_url?: string;

    // DEMO CONFIGURATION
    // VIDEO DEMO
    demo_video_type?: string;
    demo_video_url?: string;
    demo_video_thumbnail?: string;

    // GALLERY DEMO
    demo_images?: Array<{ url: string; title?: string; order?: number }>;

    // Legacy fields
    thumbnail_url?: string;
    images?: string[];
    image_urls?: string[];

    technologies: Array<{ name: string; icon: string; enabled: boolean }>;
    tags?: string[];
    is_featured?: boolean;
    is_published?: boolean;
    order_index?: number;
}

export interface ProjectStats {
    total_projects: number;
    published_projects: number;
    featured_projects: number;
    total_views: number;
    most_viewed?: Project;
}

// CV types
export interface CV extends BaseEntity {
    filename: string;
    file_size: number;
}

export interface CVDeleteResponse {
    message: string;
    success: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
    message: string;
    success: boolean;
    data?: T;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

// Error types
export interface ApiError {
    detail: string;
    status_code: number;
}
