/**
 * Tipos TypeScript para Settings (Configuración Global)
 */

import { BaseEntity } from './api';

// ========== Social Links ==========

export interface SocialLink {
    name: string;
    url: string;
    icon: string;
    enabled: boolean;
}

// ========== Settings Types ==========

export interface Settings extends BaseEntity {
    // Información del Sitio
    site_name: string;
    site_description?: string;
    site_logo_url?: string;
    site_favicon_url?: string;

    // Contacto Global
    contact_email?: string;
    contact_phone?: string;
    contact_location?: string;
    contact_availability?: string;

    // Social Links Global
    social_links: SocialLink[];

    // SEO y Marketing
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    seo_og_image?: string;
    google_analytics_id?: string;
    google_search_console?: string;

    // Apariencia
    theme_mode: 'light' | 'dark' | 'auto';
    primary_color: string;
    font_family?: string;

    // Avisos y Notificaciones
    maintenance_mode: boolean;
    maintenance_message?: string;
    global_banner?: string;
    banner_enabled: boolean;
    banner_type: 'info' | 'warning' | 'error' | 'success';

    // Newsletter
    newsletter_enabled: boolean;
    newsletter_provider?: string;
    newsletter_api_key?: string;

    // Integraciones
    facebook_pixel?: string;
    hotjar_id?: string;

    // Configuración adicional
    extra_config?: Record<string, any>;
}

export interface SettingsCreate {
    // Información del Sitio
    site_name: string;
    site_description?: string;
    site_logo_url?: string;
    site_favicon_url?: string;

    // Contacto Global
    contact_email?: string;
    contact_phone?: string;
    contact_location?: string;
    contact_availability?: string;

    // Social Links Global
    social_links?: SocialLink[];

    // SEO y Marketing
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    seo_og_image?: string;
    google_analytics_id?: string;
    google_search_console?: string;

    // Apariencia
    theme_mode?: 'light' | 'dark' | 'auto';
    primary_color?: string;
    font_family?: string;

    // Avisos y Notificaciones
    maintenance_mode?: boolean;
    maintenance_message?: string;
    global_banner?: string;
    banner_enabled?: boolean;
    banner_type?: 'info' | 'warning' | 'error' | 'success';

    // Newsletter
    newsletter_enabled?: boolean;
    newsletter_provider?: string;
    newsletter_api_key?: string;

    // Integraciones
    facebook_pixel?: string;
    hotjar_id?: string;

    // Configuración adicional
    extra_config?: Record<string, any>;
}

export interface SettingsUpdate {
    // Información del Sitio
    site_name?: string;
    site_description?: string;
    site_logo_url?: string;
    site_favicon_url?: string;

    // Contacto Global
    contact_email?: string;
    contact_phone?: string;
    contact_location?: string;
    contact_availability?: string;

    // Social Links Global
    social_links?: SocialLink[];

    // SEO y Marketing
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    seo_og_image?: string;
    google_analytics_id?: string;
    google_search_console?: string;

    // Apariencia
    theme_mode?: 'light' | 'dark' | 'auto';
    primary_color?: string;
    font_family?: string;

    // Avisos y Notificaciones
    maintenance_mode?: boolean;
    maintenance_message?: string;
    global_banner?: string;
    banner_enabled?: boolean;
    banner_type?: 'info' | 'warning' | 'error' | 'success';

    // Newsletter
    newsletter_enabled?: boolean;
    newsletter_provider?: string;
    newsletter_api_key?: string;

    // Integraciones
    facebook_pixel?: string;
    hotjar_id?: string;

    // Configuración adicional
    extra_config?: Record<string, any>;
}

export interface SettingsPublic {
    // Información del Sitio
    site_name: string;
    site_description?: string;
    site_logo_url?: string;
    site_favicon_url?: string;

    // Contacto Global (público)
    contact_email?: string;
    contact_phone?: string;
    contact_location?: string;
    contact_availability?: string;

    // Social Links Global
    social_links: SocialLink[];

    // SEO (solo info pública)
    seo_title?: string;
    seo_description?: string;

    // Apariencia
    theme_mode: 'light' | 'dark' | 'auto';
    primary_color: string;

    // Avisos públicos
    global_banner?: string;
    banner_enabled: boolean;
    banner_type: 'info' | 'warning' | 'error' | 'success';
    maintenance_mode: boolean;
    maintenance_message?: string;
}

