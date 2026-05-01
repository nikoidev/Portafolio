/**
 * Hardcoded list of CMS pages (ported from backend/app/services/cms_service.py:185-250)
 */

export interface PageConfig {
  page_key: string
  label: string
  icon: string
  description: string
}

export const CMS_PAGES: PageConfig[] = [
  { page_key: 'home', label: 'Inicio', icon: 'home', description: 'Página principal del portafolio' },
  { page_key: 'about', label: 'Sobre Mí', icon: 'user', description: 'Información personal y profesional' },
  { page_key: 'projects', label: 'Proyectos', icon: 'folder', description: 'Galería de proyectos' },
  { page_key: 'contact', label: 'Contacto', icon: 'mail', description: 'Formulario de contacto' },
  { page_key: 'footer', label: 'Footer', icon: 'layout', description: 'Pie de página del sitio web' },
  { page_key: 'navbar', label: 'Menú Público', icon: 'menu', description: 'Barra de navegación pública' },
  { page_key: 'admin_header', label: 'Menú Admin', icon: 'settings', description: 'Barra de navegación del panel admin' },
  { page_key: 'privacy', label: 'Privacidad', icon: 'shield', description: 'Política de privacidad' },
  { page_key: 'terms', label: 'Términos', icon: 'file-text', description: 'Términos y condiciones' },
]

export const PAGE_KEYS = CMS_PAGES.map(p => p.page_key)
